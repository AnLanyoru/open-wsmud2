# TASK（系统任务）编写指南

> 适用于 open-wsmud2 MUD 服务端。本文档面向读者：**任何需要编写、修改或维护系统任务的后端开发者。**

---

## 目录

1. [概述](#1-概述)
2. [TASK vs USERTASK](#2-task-vs-usertask)
3. [文件路径与命名规范](#3-文件路径与命名规范)
4. [TASK 基类详解](#4-task-基类详解)
5. [生命周期详解](#5-生命周期详解)
6. [必须覆写的方法](#6-必须覆写的方法)
7. [可选的覆写方法](#7-可选的覆写方法)
8. [BASE 类提供的工具方法](#8-base-类提供的工具方法)
9. [WORLD 全局对象](#9-world-全局对象)
10. [EVENTS 活动事件系统](#10-events-活动事件系统)
11. [WORLD.DATA 全局持久化数据](#11-worlddata-全局持久化数据)
12. [临时数据（temp）操作规范](#12-临时数据temp操作规范)
13. [玩家角色相关 API](#13-玩家角色相关-api)
14. [NPC 与物品创建](#14-npc-与物品创建)
15. [完整示例一：定时排行榜任务](#15-完整示例一定时排行榜任务)
16. [完整示例二：周期广播清理任务](#16-完整示例二周期广播清理任务)
17. [完整示例三：世界 BOSS 事件任务](#17-完整示例三世界-boss-事件任务)
18. [完整示例四：商城货物刷新任务](#18-完整示例四商城货物刷新任务)
19. [任务的热更新机制](#19-任务的热更新机制)
20. [常见问题与陷阱](#20-常见问题与陷阱)

---

## 1. 概述

**TASK**（系统任务）是运行在服务端的全局单例任务，不绑定到具体玩家。它们用于实现：

- 世界 BOSS 定时刷新
- 排行榜每日结算与奖励发放
- 门派巡逻 NPC 刷新
- 押镖/商城货物定时更新
- 襄阳守卫战等大型区域事件
- 系统消息轮播
- 竞技场定时赛程
- 文件清理等运维任务

TASK 文件位于 `server/res/task/` 目录，服务启动时自动预加载并实例化，也支持运行时热更新。

---

## 2. TASK vs USERTASK

| 特性 | TASK（系统任务） | USERTASK（玩家任务） |
|------|-----------------|---------------------|
| 基类 | `server/core/task/task.ts` 中的 `TASK` | `server/core/task/playertask.ts` 中的 `USERTASK` |
| 存储位置 | `WORLD.SYSTEMTASKS`（服务端全局数组） | `WORLD.TASKS`（服务端全局数组） |
| 生命周期 | 服务启动时创建，关闭时销毁 | 同左 |
| 作用范围 | 全局单例，与玩家无关 | 每个玩家独立实例 |
| 典型用途 | Boss、排行榜、货物刷新 | 师门任务、衙门追捕、成长任务 |

**本文档仅针对 TASK。** 若你需要编写玩家个人任务（每个玩家各自进度），请参考 USERTASK 相关文档。

---

## 3. 文件路径与命名规范

### 文件位置

```
server/res/task/{任务名}.ts
```

### 命名惯例

| 文件名 | 对应 ID | 用途 |
|--------|---------|------|
| `top_1.ts` | `"top"` | 排行榜每日结算 |
| `boss_task.ts` | `"boss"` | 世界 BOSS 刷新 |
| `goods_task.ts` | `"goods"` | 商城货物刷新 |
| `msg.ts` | `"msg"` | 系统消息轮播/文件清理 |
| `xy_task.ts` | `"xiangyang"` | 襄阳守卫战 |

### 文件基本结构

每个 TASK 文件必须有一个 `export default` 的类，继承自 `TASK`：

```typescript
import { TASK } from "../../core/task/task.js";

export default class extends TASK {
    id = "my_unique_task_id";

    startup() {
        // 初始化逻辑
    }

    stop() {
        // 清理逻辑
    }
}
```

> 注意导入路径：相对于 `server/res/task/`，`TASK` 类位于 `server/core/task/task.js`（编译后的 JS 文件）。TypeScript 源文件在 `server/core/task/task.ts`，但运行时导入的是编译好的 JS。

---

### 类型标注准则

> **编写系统任务时，必须遵循以下类型标注规则：**

1. **对象类型属性必须显式标注类型：**
   ```typescript
   // ✅ 正确
   customer: Record<string, OBJ[] | null> = {};
   next_time: Date | null = null;

   // ❌ 错误
   customer = {};
   ```

2. **重写方法必须显式标注参数类型和返回类型：**
   ```typescript
   // ✅ 正确
   startup(oldtask?: TASK): boolean | void {
       this.handler = this.call_out(this.run, 60000);
   }
   stop(): void {
       if (this.handler) clearTimeout(this.handler);
   }
   run(): void {
       // 任务逻辑
   }
   query_goods(me: CHARACTER): OBJ[] {
       return this.customer[me.id] || [];
   }

   // ❌ 错误：缺少返回类型
   startup(oldtask) { ... }
   stop() { ... }
   ```

3. **NPC 回调绑定时的类型处理。** 当将 TASK 方法赋值给 NPC 回调时，注意 `this` 指向变化，使用 `bind` 或闭包，同时保持参数类型：
   ```typescript
   // ✅ 正确
   boss.on_died = (killer: CHARACTER, corpse: CORPSE): void => {
       this.handleBossDeath(boss, killer, corpse);
   };
   ```

---

## 4. TASK 基类详解

### 完整定义（位于 `server/core/task/task.ts`）

```typescript
export class TASK extends BASE {
    /** 主动定时器句柄 — 用于 setTimeout/setInterval */
    time_handler: ReturnType<typeof setTimeout> | null = null;

    /** 备用定时器句柄 */
    handler: ReturnType<typeof setTimeout> | null = null;

    /** BOSS 任务：下次运行时间 */
    next_time?: Date | null;

    /** 货物缓存（goods/escort 任务） */
    customer?: Record<string, OBJ[] | null>;

    // ---- 生命周期方法 ----

    create(): void {
        let is_success = this.startup();
        if (is_success === false) return;
        WORLD.SYSTEMTASKS.push(this);
    }

    update(path: string): void {
        let oldtask: TASK | null = null;
        for (let i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
            if (WORLD.SYSTEMTASKS[i].path == path) {
                WORLD.SYSTEMTASKS[i].stop();
                oldtask = WORLD.SYSTEMTASKS[i];
                WORLD.SYSTEMTASKS[i] = this;
            }
        }
        if (!oldtask) {
            WORLD.SYSTEMTASKS.push(this);
        }
        this.startup(oldtask ?? undefined);
    }

    // ---- 子类应覆写的方法 ----

    startup(oldtask?: TASK): boolean | void {
        undefined;
    }

    stop(): void {
        return undefined;
    }

    // ---- 可选覆写的方法 ----

    query_goods?(me: CHARACTER): OBJ[];
    set_goods(me: CHARACTER, list: OBJ[] | null): void { return undefined; }
    run2?(): void;
    boss_auto_drops?(me: USER, boss: NPC, par: string): void;
    battle_over?(p1: CHARACTER, p2: CHARACTER): void;
}
```

### 公开属性详解

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | **必填**。任务唯一标识符，用于 `TASK.GET(id)` 查找。必须与 `export default class` 中的定义一致。 |
| `time_handler` | `Timer \| null` | 主定时器句柄。建议设为此属性，便于 `stop()` 中统一清理。 |
| `handler` | `Timer \| null` | 备用定时器句柄。可用于次级定时器。 |
| `next_time` | `Date \| null` | 仅 BOSS 任务使用，标记下次刷新的绝对时间。 |
| `customer` | `Record<string, OBJ[] \| null>` | 仅货物/押镖任务使用，缓存每个玩家的货物列表。 |

### 静态方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `TASK.GET` | `(id: string): TASK \| undefined` | 根据 ID 查找已注册的系统任务实例。返回 `undefined` 表示未找到。|

---

## 5. 生命周期详解

### 启动时的完整流程

```
服务启动
    │
    ▼
loadResource()  [world.ts]
    │
    ├─ Phase 1: preloadDir(__PATH.TASK)
    │   遍历 server/res/task/*.ts → BASE.PRELOAD(fkey, filepath)
    │   执行 import，将 default export 的类存入 BASE.ITEMS[fkey]
    │   注意：此时只加载类定义，不调用 constructor
    │
    ├─ Phase 2: readdir(__PATH.TASK)
    │   再次遍历 → 对每个文件调用 BASE.CREATE(__PATH.TASK, fname)
    │       │
    │       ├─ BASE.NEW(fname, constructor, paras?)
    │       │   ├─ new constructor(paras?)   ─── 实例化 TASK 子类
    │       │   ├─ obj.path = fname          ─── 设置资源路径
    │       │   └─ obj.create?.(fname, par)  ─── 调用 TASK.create()
    │       │
    │       └─ TASK.create()
    │           ├─ this.startup()  ─── 调用子类覆写的 startup()
    │           ├─ 若返回 false → 不加入 SYSTEMTASKS（任务启动失败）
    │           └─ 否则 → WORLD.SYSTEMTASKS.push(this)
    │
    └─ WORLD.on_resource_loaded()  ─── 全部任务创建完成后的回调
```

### 热更新流程

```
管理员输入 "update task/xxx"
    │
    ▼
update命令(do_update)
    │
    ├─ BASE.UPDATE(__PATH.WORLD + "task/", "xxx")
    │   ├─ 重新 import（带 ?update=时间戳 避免缓存）
    │   └─ 新类定义存入 BASE.ITEMS
    │
    └─ BASE.CREATE(__PATH.WORLD + "task/", "xxx")
        └─ BASE.NEW → new constructor() → obj.path = "xxx" → create()
            └─ TASK.create()
                ├─ startup()       ─── 新实例调用 startup()
                └─ push to SYSTEMTASKS
```

> **注意**：热更新会创建一个新实例并将它推入 `SYSTEMTASKS`，旧的实例仍然存在但不会被主动清理。如果旧实例上有定时器正在运行，它们仍会继续执行。在 `startup()` 开始时通过 `oldtask` 参数可以拿到旧实例进行状态迁移，然后在 `stop()` 中清理旧实例的定时器。

### 停止/关闭流程

```
服务器关闭 或 手动移除
    │
    ▼
对 WORLD.SYSTEMTASKS 中每个 task 调用 task.stop()
    │
    └─ 子类覆写的 stop() 清理所有定时器、NPC、监听器等
```

---

## 6. 必须覆写的方法

### `startup(oldtask?: TASK): boolean | void`

**调用时机：** 任务首次创建或热更新时调用。

**参数：**
- `oldtask` — 热更新时传入旧任务实例，可用于迁移状态（如货物缓存）。首次加载时为 `undefined`。

**返回值：**
- 返回 `false` — 阻止本任务加入 `WORLD.SYSTEMTASKS`。适用于前置条件不满足时的启动失败场景。
- 返回 `void/undefined`/不返回 — 正常启动，任务将被注册。

**必须在 startup 中完成：**
1. 设置 `this.id`（如果没有在类字段中定义）
2. 设置定时器（`this.call_out()` 或 `this.call_interval()`）
3. 初始化任务状态的属性
4. 迁移旧任务状态（如果有 `oldtask` 参数）

**典型模式：**

```typescript
startup(oldtask?: TASK) {
    // 1. 状态迁移
    if (oldtask && oldtask.customer) {
        this.customer = oldtask.customer;
    }

    // 2. 清除旧定时器（防止重复）
    if (this.time_handler) clearTimeout(this.time_handler);

    // 3. 设置新定时器
    this.time_handler = this.call_out(this.run.bind(this), delay);
}
```

### `stop(): void`

**调用时机：** 任务停止或热更新时旧实例被替换前调用。

**必须完成：**
1. 清除所有 `this.time_handler` 和 `this.handler` 定时器
2. 销毁任务创建的 NPC（调用 `npc.destroy()`）
3. 清理所有注册的事件监听
4. 清理所有任务相关的全局状态

**典型实现：**

```typescript
stop() {
    if (this.time_handler) clearTimeout(this.time_handler);
    if (this.handler) clearTimeout(this.handler);
    this.time_handler = null;
    this.handler = null;

    if (this.boss && this.boss.length) {
        for (let i = 0; i < this.boss.length; i++) {
            this.boss[i].destroy(this.boss[i].name + "离开了。");
        }
        this.boss.length = 0;
        this.boss = null;
    }
}
```

---

## 7. 可选的覆写方法

### `query_goods?(me: CHARACTER): OBJ[]`

用于押镖/商城类任务。查询某个玩家的货物列表（通常带缓存逻辑）。

```typescript
query_goods(me: CHARACTER): OBJ[] {
    // 先查缓存
    if (this.customer[me.id]) return this.customer[me.id];
    // 生成新货物
    let list = [OBJ.CREATE("st/xuanjing", 10)];
    this.customer[me.id] = list;
    return list;
}
```

### `set_goods(me: CHARACTER, list: OBJ[] | null): void`

设置或清除玩家的货物缓存。`list` 为 `null` 时清除。

```typescript
set_goods(me: CHARACTER, list: OBJ[] | null) {
    this.customer[me.id] = list;
}
```

### `run2?(): void`

用于基于时间触发的任务（如某些定时任务框架）。在 `time_handler` 之外独立调度。

### `boss_auto_drops?(me: USER, boss: NPC, par: string): void`

BOSS 被击败后自动分配掉落。由 EVENTS 机制或 `on_command` 触发调用。

```typescript
boss_auto_drops(me: USER, boss: NPC, par: string) {
    // 根据伤害占比给玩家发奖励
    let items = boss.query_items?.(me);
    if (items) {
        for (let item of items) {
            me.add_obj(item);
        }
    }
}
```

### `battle_over?(p1: CHARACTER, p2: CHARACTER): void`

竞技场/比武类任务的战斗结束回调。战斗系统会在每场战斗结束后调用。

---

## 8. BASE 类提供的工具方法

TASK 继承自 BASE，以下方法可直接使用。

### `call_out(func, delay, arg1?, arg2?): Timer`

延时调用。在 `delay` 毫秒后执行 `func`，`func` 的 `this` 自动绑定到当前 TASK 实例。

```typescript
this.call_out(this.run, 5000);
// 等价于: setTimeout(this.run.bind(this), 5000);
```

支持传递两个参数：

```typescript
this.call_out(this.process, 3000, player, item);
// 在 process(player, item) 中收到参数
```

### `call_interval(func, time, count, end_func?): Timer | undefined`

间隔调用。以 `time` 毫秒为间隔重复调用 `func`，共 `count` 次。每次调用传入当前调用序号（从 0 开始）。若 `func` 返回 `false` 则提前终止。所有调用结束后执行 `end_func`。

```typescript
// 每 5 秒输出一次，共 10 次
this.call_interval((index) => {
    console.log("第" + (index + 1) + "次");
    return;      // 返回 undefined 继续下一次
    // return false;  // 返回 false 提前终止
}, 5000, 10, () => {
    console.log("执行完毕");
});
```

### `random(num: number): number`

生成 `[0, num)` 区间内的随机整数。

```typescript
let value = this.random(100);  // 0 ~ 99
let dice = this.random(6) + 1; // 1 ~ 6
```

### `create_uid(): string`

生成唯一标识符。前 8 位为毫秒时间戳的 36 进制，后 4 位随机码，保证每毫秒不重复。

```typescript
let uid = this.create_uid();
```

---

## 9. WORLD 全局对象

`WORLD` 是全局单例，以 `import { WORLD } from "../../core/world.js"` 导入。

### 常用属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `WORLD.SYSTEMTASKS` | `TASK[]` | 所有已注册的系统任务实例 |
| `WORLD.USERS` | `USER[]` | 当前所有在线玩家 |
| `WORLD.ROOMS` | `Record<string, ROOM>` | 所有房间（路径 → 房间实例） |
| `WORLD.COMMANDS` | `Record<string, COMMAND>` | 所有命令实例 |
| `WORLD.DATA` | `object` | 全局持久化数据对象 |
| `WORLD.STATS` | `object` | 排行榜/统计信息 |
| `WORLD.USER_EVENTS` | `EventItem[]` | 活动事件列表 |

### 常用方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `WORLD.getUser(id)` | `(id: string): USER \| undefined` | 根据玩家 ID 获取在线玩家 |
| `WORLD.getRoom(path)` | `(path: string): ROOM \| undefined` | 根据路径获取房间实例 |
| `WORLD.send(msg)` | `(msg: string): void` | 向所有在线玩家发送消息 |

### COMMAND 执行

```typescript
// 系统公告
COMMAND.DO("sys", "这是一条系统公告。");

// 发送私信（邮件）
COMMAND.DO("send", "player_id", JSON.stringify({
    from: "system",
    from_name: "系统",
    content: "你的奖励",
    attach: [{ obj: "st/xuanjing", count: 10 }]
}));

// 谣言频道
COMMAND.DO("rumor", "听说世界BOSS出现了！");
```

---

## 10. EVENTS 活动事件系统

`EVENTS` 系统用于管理**玩家活动面板**中显示的活动条目。适合与 TASK 配合，让玩家在活动面板中看到并参与 BOSS 挑战、襄阳守城等事件。

### 导入

```typescript
import { EVENTS } from "../../core/task/events.js";
```

### 方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `EVENTS.add(item)` | `(item: EventItem): void` | 添加或更新活动。如果 `item.id` 已存在则更新，否则新建。 |
| `EVENTS.remove(id)` | `(id: string): any[] \| undefined` | 移除活动。通知所有符合条件的玩家。 |

### EventItem 接口

```typescript
interface EventItem {
    id: string;                         // 活动唯一 ID
    name?: string;                      // 活动名称（显示在面板上）
    desc?: string;                      // 活动描述
    time?: number;                      // 活动结束时间戳
    grade?: number;                     // 活动品级（影响排序和颜色）
    command?: string;                   // 活动按钮文本
    check?: (user: USER) => boolean;    // 检查玩家是否可见/可参与。返回 true 则显示
    on_command?: (me: USER, ...params: string[]) => void | boolean;
                                        // 按钮点击回调。返回 true 则隐藏该活动
}
```

### 示例

```typescript
// 创建活动
EVENTS.add({
    id: 'boss_challenge_1',
    name: "宗师BOSS挑战",
    desc: "听说有BOSS出现在扬州城一带，你可以前往尝试挑战。",
    time: Date.now() + 3600000,       // 1小时后结束
    grade: 3,
    command: "前往挑战",
    check: (me: USER) => me.level === 3,
    on_command: (me: USER) => {
        let room = WORLD.getRoom("yz/nanmen");
        if (!room) return;
        me.moveto(room.path, me.name + "离开了。", me.name + "走了过来。");
        return true;   // 隐藏活动
    }
});

// 移除活动
EVENTS.remove('boss_challenge_1');
```

---

## 11. WORLD.DATA 全局持久化数据

`WORLD.DATA` 是一个单例对象，用于存储服务端全局的临时/持久化数据（如活动状态、BOSS次数等）。数据会被持久化保存到 `data.js` 文件。

### 导入

无需额外导入，直接使用 `WORLD.DATA`。

### 方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp(name, def?)` | `<T>(name: string, def?: T): T` | 查询临时数据。支持过期时间检查。 |
| `set_temp(name, value, time?)` | `(name: string, value: unknown, time?: number): void` | 设置临时数据，可指定过期时间（毫秒）。 |
| `add_temp(name, value, time?)` | `(name: string, value: number, time?: number): number` | 累加数值型数据，返回累加后的值。 |
| `remove_temp(name)` | `(name: string): void` | 移除临时数据（设为 null）。 |

### 示例

```typescript
// 存储 BOSS 挑战次数计数器（当天有效）
let count = WORLD.DATA.query_temp<number>("boss_count", 0);
WORLD.DATA.set_temp("boss_count", count + 1, UTIL.diff_time());

// 累加简写
let newCount = WORLD.DATA.add_temp("boss_count", 1, UTIL.diff_time());

// 存储活动状态
WORLD.DATA.set_temp("xy_status", 1);              // 不超时
WORLD.DATA.set_temp("xy_status", 10, 3600000);     // 1小时后过期

// 移除
WORLD.DATA.remove_temp("xy_status");
```

### UTIL.diff_time / UTIL.diff_week_time

这两个工具方法常用于计算到下一个重置点的时间。

```typescript
import { UTIL } from "../../core/util/util.js";

// 计算到明天凌晨 5 点的毫秒数（默认 hour = 5）
let ms = UTIL.diff_time();       // 到 5 点
let ms = UTIL.diff_time(20);     // 到 20 点

// 计算到下周一凌晨 5 点的毫秒数
let ms = UTIL.diff_week_time();      // 到下周一 5 点
let ms = UTIL.diff_week_time(20);    // 到下周一 20 点
```

---

## 12. 临时数据（temp）操作规范

> **强制约束**：所有临时数据**必须**通过 temp 操作接口（`query_temp` / `set_temp` / `add_temp` / `remove_temp`）进行读写，**禁止**直接访问 `obj.temp["key"]` 或 `obj.temp.key`。临时数据**必须**储存于 `temp` 中。

### 12.1 玩家临时数据（per-player）

每个玩家独立存储，持久化在玩家角色存档中。通过 `me`（USER 实例）调用：

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取临时值。**必须提供默认值**。过期自动返回默认值。 |
| `set_temp` | `(name: string, value: number\|string, time?: number) => void` | 写入临时值。`time` 有效期（**毫秒**），省略则永久。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加数值，返回累加后的值。 |
| `remove_temp` | `(name: string) => void` | 移除（设为 `null`，不删除键名）。 |

```typescript
// ✅ 正确：通过方法操作
let count = me.query_temp<number>("bcc", 0);        // 必须提供默认值
let flag = me.query_temp("xy_bm", 0);
me.set_temp("bcc", 1);                               // 永久
me.set_temp("bcc", 1, 3600000);                      // 1小时后过期
let newVal = me.add_temp("bcc", 1);                  // 累加
me.remove_temp("bcc");

// ❌ 错误：直接访问 temp 对象
me.temp["bcc"] = 1;          // 禁止！
let val = me.temp["bcc"];    // 禁止！
```

### 12.2 全局临时数据（WORLD.DATA）

全服共享，持久化在 `data.js` 中：

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取全局值。**必须提供默认值**。 |
| `set_temp` | `(name: string, value: unknown, time?: number) => void` | 写入全局值。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加全局数值。 |
| `remove_temp` | `(name: string) => void` | 移除（设为 `null`）。 |

```typescript
// ✅ 正确
WORLD.DATA.set_temp("xy_status", 1);                      // 不超时
WORLD.DATA.set_temp("xy_status", 10, 3600000);             // 1小时后过期
let status = WORLD.DATA.query_temp("xy_status", 0) ?? 0;   // 必须默认值
let count = WORLD.DATA.add_temp("boss_count", 1);           // 累加
WORLD.DATA.remove_temp("xy_status");
```

### 12.3 核心约束

1. **禁止直接访问 `temp` 对象**：无论 `me.temp`、`WORLD.DATA.temp` 还是其他对象的 `.temp`，都不允许直接读写，必须使用上述四个方法。
2. **`query_temp` 必须提供默认值**：防止 key 不存在时返回 `undefined` 导致 NaN 或类型错误。
   ```typescript
   // ❌ 错误
   let count = me.query_temp("count") + 1;  // key 不存在时为 undefined + 1 = NaN
   // ✅ 正确
   let count = me.query_temp("count", 0) + 1;
   ```
3. **时间单位为毫秒**：`set_temp` / `add_temp` 的 `time` 参数是**毫秒**，不是秒。
4. **过期机制**：值以 `{v, e}` 格式存储时，`query_temp` 在 `Date.now() > e` 时自动返回默认值。
5. **`remove_temp` 设为 `null`**：不删除键名，用于 JSON 序列化兼容。
6. **作用范围区分**：`me.query_temp()` = 单个玩家，`WORLD.DATA.query_temp()` = 全服共享。不要混淆。

---

## 13. 玩家角色相关 API

TASK 中经常需要与玩家交互，以下是最常用的 CHARACTER/USER API。

### 获取玩家

```typescript
// 根据 ID 获取在线玩家
let user = WORLD.getUser("player_id_123");
if (user) {
    user.send("你好！");
}
```

### 玩家临时数据（每个玩家独立）

CHARACTER 继承自 ITEM，提供 `query_temp` / `set_temp` / `add_temp`。与 `WORLD.DATA` 的区别：这些数据是**每个玩家独立**的，持久化在玩家角色数据中。

```typescript
// 读取
let count = me.query_temp<number>("bcc", 0);        // 默认值 0
let flag = me.query_temp("xy_bm");                   // 返回 undefined 若不存在

// 写入（可选过期时间）
me.set_temp("bcc", 1);                               // 永久
me.set_temp("bcc", 1, 3600000);                      // 1小时后过期

// 累加
let newVal = me.add_temp("bcc", 1);                  // +1
let newVal = me.add_temp("jg_week", 5, UTIL.diff_week_time());  // 带周重置
```

### 玩家发送消息

```typescript
me.send("普通消息");
me.notify("<hic>高亮消息</hic>");
me.notify_fail("<red>错误消息</red>");
```

### 玩家执行命令

```typescript
me.do_command("go", "north");
me.do_command("look");
```

### 玩家添加物品

```typescript
// 通过 OBJ.CREATE 创建
let obj = OBJ.CREATE("st/xuanjing", 10);
let added = me.add_obj(obj);
if (added) {
    me.notify("你获得了" + added.unit_name() + "。");
}

// 直接通过路径添加（自动创建）
let result = me.add_obj("money/silver", 100);
```

### 玩家移动

```typescript
me.moveto(room_path, leave_msg, arrive_msg);
// 示例
me.moveto("yz/nanmen", me.name + "离开了。", me.name + "走了过来。");
```

### 玩家经验/潜能修改

```typescript
me.add_exp(1000, 500);  // +1000 经验, +500 潜能
```

---

## 14. NPC 与物品创建

TASK 中经常需要动态创建 NPC 和物品。

### NPC.CLONE

从 NPC 模板克隆一个新 NPC 实例（不放入任何房间）：

```typescript
import { NPC } from "../../core/char/npc.js";

let boss = NPC.CLONE("path/to/npc_template");
if (boss) {
    boss.hp = boss.max_hp = 50000;
    boss.level = 3;
    boss.init();
    boss.recount();
}
```

### NPC.CREATE

创建 NPC 并直接放入指定房间：

```typescript
let npc = NPC.CREATE("path/to/npc_template", room);
// 若 room 是 ROOM 实例，NPC 将出现在该房间
```

### 将 NPC 放入房间

```typescript
let rm = WORLD.getRoom("yz/nanmen");
if (rm) {
    rm.item_changed(npc, true, npc.name + "出现了。");
}
```

### NPC 回调设置

```typescript
boss.on_died = this.on_boss_died;        // 死亡回调（完全死亡后触发）
boss.on_die = this.on_boss_die;           // 死亡回调
boss.on_kill = this.on_boss_kill;         // 击杀玩家回调
boss.on_enter = this.check_enemy;         // 有 NPC/玩家进入房间时触发
boss.on_heart_beat = this.npc_tick;       // 心跳回调
boss.record_damage = true;                // 记录伤害（用于掉落分配）
```

> **注意**：`on_died` / `on_kill` 等回调的 `this` 指向 NPC 实例（而非 TASK 实例）。如果需要调用 TASK 的方法，请使用 `bind`：

```typescript
boss.on_died = this.on_boss_died.bind(this, boss);
// 或使用闭包
```

### OBJ.CREATE

```typescript
import { OBJ } from "../../core/item/obj.js";

// 创建简单物品
let item = OBJ.CREATE("st/xuanjing", 10);

// 使用几率表批量创建
let items = OBJ.create_by_odds([
    { obj: "st/xuanjing", min: 1, max: 10 },
    { obj: ["st/st_red#0", "st/st_gre#0"], odds: 5000 },
    { obj: "money/silver", min: 10, max: 50 }
]);
```

---

## 15. 完整示例一：定时排行榜任务

**功能**：每日 20:00 结算排行榜，发送奖励邮件。展示定时任务的标准模式。

**文件**：`server/res/task/top_1.ts`

```typescript
import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { COMMAND } from "../../core/command.js";
import { FAMILIES } from "../../core/skill/family.js";
import type { USER } from "../../core/char/user.js";
import type { FAMILY } from "../../core/skill/family.js";

export default class extends TASK {
    id = "top";
    prev_time = 0;

    /**
     * startup 中计算到下次 20:00 的时间，设置定时器
     */
    startup() {
        let dt = new Date();
        let hour = dt.getHours();
        let day = dt.getDate();
        if (hour >= 20) day = day + 1;  // 如果已经过了 20 点，算到明天
        dt = new Date(dt.getFullYear(), dt.getMonth(), day, 20);
        let diff_time = +dt - Date.now();
        this.time_handler = this.call_out(this.run.bind(this), diff_time);
    }

    stop() {
        clearTimeout(this.time_handler!);
    }

    /**
     * 结算逻辑：检查防重复、分发奖励、重新调度
     */
    run() {
        // 1. 重新调度下次执行
        this.startup();

        // 2. 防重入：距上次执行不足 10 分钟则跳过
        let diff = Date.now() - this.prev_time;
        if (diff < 600000) return;

        // 3. 分发各类排行榜奖励
        this.send_score();
        this.send_tops();
        this.send_weapons();
        this.send_family();

        // 4. 系统公告
        COMMAND.DO("sys", "排行榜奖励发放完毕，前往社交系统消息中收取。");
        this.prev_time = Date.now();
    }

    /**
     * 综合榜奖励
     */
    send_score() {
        // WORLD.STATS.SC_STATS 包含各门派的综合排名数据
        // 遍历门派，给前 20 名发奖励
        for (let key of FAMS_TATAS) {
            let stats = WORLD.STATS.SC_STATS[key as keyof typeof WORLD.STATS.SC_STATS];
            if (!stats) continue;
            for (let i = 0; i < stats.length; i++) {
                if (i > 19) break;
                let user = stats[i];
                if (!user.id) continue;
                COMMAND.DO("send", user.id, JSON.stringify({
                    from: "score",
                    from_name: "综合榜奖励",
                    content: "你目前在综合榜排名第" + (i + 1) + "，请再接再厉。",
                    attach: [
                        WORLD.COMMANDS.reward.score_reward!(i)
                    ]
                }));
            }
        }
    }

    /**
     * 高手榜奖励
     */
    send_tops() {
        for (let key of FAMS_TATAS) {
            let tops = WORLD.STATS['tops_' + key];
            if (!tops) continue;
            for (let i = 0; i < tops.length; i++) {
                let user = tops[i];
                if (!user.userid) continue;
                COMMAND.DO("send", user.userid, JSON.stringify({
                    from: "top",
                    from_name: "高手榜奖励",
                    content: "你目前在高手榜排名第" + (i + 1) + "。",
                    attach: [
                        WORLD.COMMANDS.reward?.top_reward?.(i)
                    ]
                }));
            }
        }
    }

    /**
     * 兵器谱奖励
     */
    send_weapons() {
        const map: Record<string, number> = {};
        const eqs = WORLD.STATS.EQ_STATS;
        for (let stats of eqs) {
            for (let i = 0; i < stats.length; i++) {
                if (i > 9) break;
                let item = stats[i];
                if (!item.user) continue;
                let max_count = map[item.user] ?? 0;
                if (max_count >= 200) continue;
                let count = (50 + (10 - i) * 5);
                max_count += count;
                if (max_count > 200) count = count - (max_count - 200);
                map[item.user] = max_count;

                COMMAND.DO("send", item.user, JSON.stringify({
                    from: "weapon",
                    from_name: "兵器谱奖励",
                    content: "你的" + item.wname + "在兵器谱排名第" + (i + 1) + "。",
                    attach: [{ obj: "st/xuanjing", count: count }]
                }));
            }
        }
    }

    /**
     * 门派大师兄/师姐评选
     */
    send_family() {
        for (let name in FAMILIES) {
            this.sort_family(FAMILIES[name as keyof typeof FAMILIES]);
        }
    }

    sort_family(fam: FAMILY) {
        // 评选门派贡献最高的玩家成为大师兄/师姐
        const list: any[] = [];
        if (!fam.tops) {
            // 无门派的特殊处理
            return;
        }
        let max = 0;
        for (let key in fam.tops) {
            let item = (fam.tops as any)[key];
            if (item.score > max) {
                max = item.score;
                list.length = 0;
                list.push({ name: item.name, id: key });
            } else if (item.score == max) {
                list.push({ name: item.name, id: key });
            }
        }
        if (!list.length) return;

        // 选出最终人选
        let user = list[0];
        if (list.length > 1) {
            let last_time = Number.MAX_VALUE;
            for (let i = 0; i < list.length; i++) {
                let u = WORLD.getUser(list[i].id);
                let time = u ? u.query_temp('last_sm', 1) ?? 1 : Date.now();
                if (time < last_time) {
                    user = list[i];
                    last_time = time;
                }
            }
        }

        fam.set_dadizi(user.id, user.name);

        COMMAND.DO("send", user.id, JSON.stringify({
            from: "fam",
            from_name: "门派奖励",
            content: "恭喜你成为" + fam.name + "的" + fam.top_name + "。",
            attach: [{ obj: "sp/dizi#" + fam.id, count: 1 }]
        }));
    }
}

const FAMS_TATAS = ['WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE'];
```

---

## 16. 完整示例二：周期广播清理任务

**功能**：每 20 分钟随机播报一条系统消息，每天凌晨 4 点检查清理过期日志文件，凌晨 5 点清理邮件和商店缓存。

**文件**：`server/res/task/msg.ts`

```typescript
import fs from "fs/promises";
import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { COMMAND } from "../../core/command.js";

declare var __PATH: Record<string, string>;

export default class extends TASK {
    id = "msg";
    msgs = [
        "欢迎登录，感谢你的支持，如有任何问题或建议请提交。",
        "如有BUG请提交管理员，谢谢配合。",
        "每日凌晨5点重置所有日常任务和次数。",
    ];
    is_check_file = false;  // 标记是否已检查文件

    startup() {
        this.handler = this.call_out(this.run, 20 * 60000);  // 20 分钟循环
    }

    stop() {
        if (this.handler) clearTimeout(this.handler);
    }

    run() {
        // 1. 随机播报一条消息
        COMMAND.DO("sys", this.msgs[this.random(this.msgs.length)]);

        // 2. 重新调度（形成循环）
        this.startup();

        // 3. 凌晨 4 点检查文件（每天只执行一次）
        let dt = new Date();
        if (dt.getHours() == 4 && !this.is_check_file) {
            this.is_check_file = true;
            this.check_file();
        }

        // 4. 凌晨 5 点清理邮件和商店
        if (dt.getHours() == 5) {
            this.is_check_file = false;
            this.clearyz();
        }
    }

    clearyz() {
        // 调用邮件和商店清理命令
        WORLD.COMMANDS['checkorg']?.cmd_clearmail?.();
        WORLD.COMMANDS['checkorg']?.cmd_clearstore?.();
    }

    async check_file() {
        // 删除过期日志文件和备份文件
        const min4 = new Date(Date.now() - 3600000 * 24 * 30);  // 30天

        await this.check_temp_files("log", (dir) => {
            let pars = dir.replace("log", "").replace(".txt", "").split('-');
            let dt = new Date(parseInt(pars[0]), parseInt(pars[1]) - 1, parseInt(pars[2]));
            return dt < min4;
        });

        await this.check_temp_files("req", (dir) => {
            let pars = dir.replace("request", "").replace(".txt", "").split('-');
            let dt = new Date(parseInt(pars[0]), parseInt(pars[1]) - 1, parseInt(pars[2]));
            return dt < min4;
        });
    }

    async check_temp_files(path: string, func: (dir: string) => boolean) {
        const dir = __PATH.DATA + path + "/";
        try {
            const paths = await fs.readdir(dir);
            for (let i = 0; i < paths.length; i++) {
                if (func(paths[i])) {
                    await fs.unlink(dir + paths[i]);
                }
            }
        } catch (e) {
            // 目录不存在时忽略
        }
    }
}
```

---

## 17. 完整示例三：世界 BOSS 事件任务

**功能**：每小时检测一次，在 21 点左右刷新 BOSS。根据玩家等级创建不同等级的 BOSS，将 BOSS 放入随机房间，创建活动事件供玩家参与，记录伤害，BOSS 死亡后按伤害分配掉落。

**文件**：`server/res/task/boss_task.ts`

```typescript
import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { OBJ } from "../../core/item/obj.js";
import { NPC } from "../../core/char/npc.js";
import { ROOM } from "../../core/room/room.js";
import { EVENTS } from "../../core/task/events.js";
import { UTIL } from "../../core/util/util.js";
import type { USER } from "../../core/char/user.js";
import type { CORPSE } from "../../core/item/corpse.js";

export default class extends TASK {
    id = "boss";
    /** BOSS NPC 数组 */
    boss: NPC[] | null = null;
    /** BOSS 下次刷新时间 */
    next_time: Date | null = null;
    /** 玩家掉落缓存 */
    user_items: Record<string, OBJ[]> | null = null;

    startup() {
        this.check_time();
    }

    stop() {
        if (this.time_handler) clearTimeout(this.time_handler);
        // 销毁所有已创建的 BOSS
        if (this.boss && this.boss.length) {
            for (let i = 0; i < this.boss.length; i++) {
                this.boss[i].destroy(this.boss[i].name + "离开了。");
            }
            this.boss = null;
        }
        this.time_handler = null;
    }

    /**
     * 计算下次刷新时间并设置定时器
     * 逻辑：21 点附近精确到 5 分钟；20-21 点之间则到 21:00；
     * 其他时间则在一小时后
     */
    check_time() {
        let dt = new Date();
        let hour = dt.getHours();

        if (hour == 21) {
            let min = dt.getMinutes();
            this.next_time = new Date(
                dt.getFullYear(), dt.getMonth(), dt.getDate(),
                hour, Math.floor((min + 5) / 5) * 5, 20
            );
        } else if (hour == 20) {
            this.next_time = new Date(
                dt.getFullYear(), dt.getMonth(), dt.getDate(), 21, 0, 20
            );
        } else {
            this.next_time = new Date(
                dt.getFullYear(), dt.getMonth(), dt.getDate(),
                hour + 1, 6 + this.random(50), 20
            );
        }

        this.time_handler = this.call_out(this.run, +this.next_time! - +dt);
    }

    /**
     * BOSS 刷新：检测可参与的玩家、创建 BOSS、放入随机房间、发布事件
     */
    run() {
        this.stop();
        this.check_time();  // 重新调度下次

        const list = this.check_users();   // 按等级分组玩家
        this.boss = [];

        for (let i = 0; i < list.length; i++) {
            if (!list[i]) continue;
            let level = i + 1;
            let bs = this.create_boss(level);
            if (!bs) continue;

            this.boss.push(bs);
            bs.record_damage = true;        // 开启伤害记录
            bs.on_died = this.on_boss_died; // BOSS 死亡处理

            // 放入随机房间
            let rm = ROOM.RANDOM()!;
            rm.item_changed(bs, true);

            // 谣言公告
            let desc = `${bs.name}出现在${rm.long_name()}一带`;
            COMMAND?.DO?.("rumor", `听说${desc}。`);

            // 创建活动事件
            EVENTS.add(this.create_event(bs, level, desc, rm));
        }
    }

    /**
     * 创建活动事件条目
     */
    create_event(boss: NPC, level: number, desc: string, rm: ROOM) {
        return {
            id: boss.id!,
            name: "BOSS挑战",
            desc: desc + "，你可前往尝试挑战，根据伤害获得丰厚奖励。",
            time: this.next_time?.getTime() ?? 0,
            grade: level,
            command: "前往挑战",
            check: (me: USER) => me.level === level,
            on_command: (me: USER) => {
                if (me.state) return me.send('你正在' + me.state.title + "。");
                if (rm.is_full(1))
                    return me.send('那里人太多了。');
                me.moveto(rm.path, me.name + "离开了。", me.name + "走了过来。");
            }
        };
    }

    /**
     * 按等级分组检测符合条件的玩家
     */
    check_users(): (USER[] | undefined)[] {
        let list: (USER[] | undefined)[] = [];
        for (let i = 0; i < WORLD.USERS.length; i++) {
            let user = WORLD.USERS[i];
            if (!user.level) continue;
            if (!user.socket) continue;
            if ((user.query_temp("bcc", 0) ?? 0) >= 5) continue;  // 每日上限

            let lv = Math.min(user.level - 1, 4);
            if (!list[lv]) list[lv] = [];
            list[lv]!.push(user);
        }
        return list;
    }

    /**
     * 创建 BOSS NPC
     */
    create_boss(player_level?: number): NPC | null {
        const BOSS_PATHS = [
            "yz/lm/zhao", "bj/ao/aobai", "bj/tdh/chen"
        ];
        let idx = this.random(BOSS_PATHS.length);
        let boss = NPC.CLONE(BOSS_PATHS[idx]);
        if (!boss) return null;

        boss.level = player_level || 1;
        boss.hp = boss.max_hp = 10000 * (player_level || 1);
        boss.mp = boss.max_mp = boss.max_hp / 2;
        boss.pfm_rate = 1;
        boss.init();
        boss.recount();

        return boss;
    }

    /**
     * BOSS 死亡回调（注意 this 指向 NPC 实例）
     */
    on_boss_died(this: NPC, me: USER, corpse: CORPSE) {
        if (!this.damages) return;

        // 设置掉落分配逻辑到 corpse 上
        corpse.no_alloc = true;
        corpse.query_items = (killer: USER) => {
            if (!this.damages) return;
            let sh = this.damages[killer.id];
            if (!(sh > 1)) return;

            let pct = Math.min(parseInt(String(sh * 100 / this.max_hp)), 80);
            if (pct < 1) pct = 1;

            return [
                OBJ.CREATE("money/silver", 1 + this.random(pct * 10)),
                OBJ.CREATE("st/xuanjing", pct)
            ];
        };
    }
}
```

---

## 18. 完整示例四：商城货物刷新任务

**功能**：每天中午 12 点刷新各门派商城的可兑换物资。展示状态迁移（热更新时保留缓存）和货物缓存模式。

**文件**：`server/res/task/goods_task.ts`

```typescript
import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { OBJ } from "../../core/item/obj.js";
import { UTIL } from "../../core/util/util.js";
import { FAMILIES } from "../../core/skill/family.js";
import type { CHARACTER } from "../../core/char/character.js";

export default class extends TASK {
    id = "goods";
    /** 玩家货物缓存：player_id → OBJ[] */
    customer: Record<string, OBJ[] | null> = {};

    startup(oldtask?: TASK) {
        // 热更新时：从旧任务实例迁移货物缓存
        if (oldtask && oldtask.customer) {
            this.customer = oldtask.customer;
        }

        // 计算到中午 12 点的时间，设置刷新定时器
        this.handler = this.call_out(this.refresh_goods, UTIL.diff_time(12));
    }

    stop() {
        if (this.handler) clearTimeout(this.handler);
    }

    /**
     * 刷新货物：广播通知，清空缓存，门派通知
     */
    refresh_goods() {
        this.handler = null;

        // 全服广播
        WORLD.send(JSON.stringify({
            type: "msg", ch: "chat",
            content: "近日新到一批宝石、秘籍、丹药，不知哪位江湖朋友需要。",
            lv: 0, name: "唐楠"
        }));

        // 清空所有玩家的缓存的货物
        this.customer = {};

        // 各门派单独通知
        for (let fam of [
            FAMILIES.GAIBANG, FAMILIES.WUDANG, FAMILIES.HUASHAN,
            FAMILIES.XIAOYAO, FAMILIES.EMEI, FAMILIES.SHASHOU,
            FAMILIES.SHAOLIN, FAMILIES.NONE
        ]) {
            fam.customer = {};
            fam.send(JSON.stringify({
                type: "msg", ch: "fam",
                content: "本门新调拨一批物资，有需要的师弟师妹请速来兑换。",
                uid: 0, name: "后勤管理员", fam: fam.name
            }));
        }

        // 重新调度下一次（24 小时后）
        this.handler = this.call_out(this.refresh_goods, UTIL.diff_time(12));
    }

    /**
     * 查询玩家的货物列表（带缓存）
     * 当玩家打开商城时调用
     */
    query_goods(me: CHARACTER): OBJ[] {
        // 查缓存
        let cached = this.customer[me.id];
        if (cached) return cached;

        // 生成该玩家的随机货物
        let list: OBJ[] = [];
        list.push(OBJ.CREATE("st/xuanjing", this.random(100) + 2));

        // 宝石
        let st = ["st/st_red", "st/st_gre", "st/st_blu", "st/st_yel"];
        for (let i = 0; i < 2; i++) {
            let g = Math.min(this.random(me.level + 1), 4);
            list.push(OBJ.CREATE(st[this.random(st.length)] + "#" + g,
                this.random(3) + 1));
        }

        // 缓存结果
        this.customer[me.id] = list;
        return list;
    }

    /**
     * 设置/清除玩家的货物（购买后清除缓存）
     */
    set_goods(me: CHARACTER, list: OBJ[] | null) {
        this.customer[me.id] = list;
    }
}
```

---

## 19. 任务的热更新机制

### 手动触发热更新

管理员在游戏中输入：

```
update task/任务文件名（不含 .ts）
```

例如：

```
update task/boss_task
update task/goods_task
update task/msg
```

### 热更新内部流程

1. `BASE.UPDATE(path, fname)` 重新 import 模块（带缓存破坏参数 `?update=时间戳`）
2. 新的类定义存入 `BASE.ITEMS`
3. `BASE.CREATE` 创建新实例 → 自动调用 `create()` → 调用 `startup()`
4. 新实例被推入 `WORLD.SYSTEMTASKS`

### 状态迁移

在 `startup(oldtask)` 中可以通过 `oldtask` 参数获取旧的实例引用，实现状态迁移：

```typescript
startup(oldtask?: TASK) {
    // 热更新时保留旧任务的货物缓存
    if (oldtask && (oldtask as any).customer) {
        this.customer = (oldtask as any).customer;
    }
    // 热更新时保留旧任务的 BOSS 时间
    if (oldtask && oldtask.next_time) {
        this.next_time = oldtask.next_time;
    }
    // ... 设置新定时器
}
```

### 热更新时旧实例的处理

- 旧实例上的定时器**不会**被自动清理--如果新实例重设了相同的定时器，两个定时器会同时运行。
- 建议在 `startup()` 开始时先清除 `this` 上的旧定时器：

```typescript
startup() {
    if (this.time_handler) clearTimeout(this.time_handler);
    if (this.handler) clearTimeout(this.handler);
    // ... 然后设置新的定时器
}
```

---

## 20. 常见问题与陷阱

### 1. 定时器泄漏

**问题**：`stop()` 中没有清理定时器，导致热更新后旧定时器继续运行。

**解决**：`stop()` 中必须清理所有定时器：

```typescript
stop() {
    if (this.time_handler) clearTimeout(this.time_handler);
    if (this.handler) clearTimeout(this.handler);
    this.time_handler = null;
    this.handler = null;
}
```

### 2. 回调中的 this 指向错误

**问题**：将 TASK 方法直接赋值给 NPC 回调（如 `boss.on_died = this.on_died`），但 `on_died` 被调用时 `this` 指向 NPC 而非 TASK。

**解决**：使用 `bind` 或在方法中通过闭包调用：

```typescript
boss.on_died = this.on_boss_died.bind(this, boss);

// 或
boss.on_died = (me: USER, corpse: CORPSE) => {
    this.handleBossDeath(boss, me, corpse);
};
```

### 3. 热更新后出现重复任务

**问题**：每次 `update task/xxx` 都创建一个新实例推入 `SYSTEMTASKS`，旧实例未被移除。

**解决**：在 `create()` 中（或 `startup()` 开头）检查是否已存在同名任务：

```typescript
startup() {
    // 查找是否已在列表中
    let existing = TASK.GET("my_task");
    if (existing && existing !== this) {
        existing.stop();
        // 替换
        let idx = WORLD.SYSTEMTASKS.indexOf(existing);
        if (idx >= 0) WORLD.SYSTEMTASKS[idx] = this;
    }

    // 清理当前定时器
    if (this.time_handler) clearTimeout(this.time_handler);

    // ... 设置新定时器
}
```

### 4. 忘记 return false 导致任务错误注册

**问题**：`startup()` 中前置条件不满足时未返回 `false`，导致任务以错误状态注册。

**解决**：在条件不满足时返回 `false`：

```typescript
startup() {
    let area = AREA.Get("xiangyang");
    if (!area) {
        console.error("【ERROR】未找到襄阳区域");
        return false;  // 阻止注册
    }
    this.xy_area = area;
    // ... 正常初始化
}
```

### 5. NPC/物品未被清理导致内存泄漏

**问题**：`stop()` 中没有销毁任务创建的 NPC 和物品，导致 NPC 仍存在于房间中。

**解决**：

```typescript
stop() {
    if (this.boss) {
        for (let npc of this.boss) {
            if (npc.environment) {
                npc.destroy(npc.name + "消失了。");
            }
        }
        this.boss = null;
    }
}
```

### 6. TIMER 覆盖导致无法清理

**问题**：直接使用 `setTimeout` 而非 `this.call_out`，导致 `stop()` 无法清理定时器。

**解决**：始终使用 `this.call_out()` 并保存返回值：

```typescript
// 正确
this.time_handler = this.call_out(this.run, 5000);

// 错误--定时器句柄没有保存
setTimeout(() => this.run(), 5000);
```

### 7. 与 EVENTS 配合时的生命周期管理

**问题**：任务停止时没有移除已注册的 EVENTS，玩家仍然可以看到过期的活动。

**解决**：

```typescript
stop() {
    // 清理所有已注册的活动事件
    if (this.boss) {
        for (let npc of this.boss) {
            if (npc.id) EVENTS.remove(npc.id);
        }
    }
    // ... 清理定时器
}
```

### 8. WORLD.DATA 与 CHARACTER.query_temp 的混淆

两者都有 `query_temp` / `set_temp` / `add_temp`，但作用范围完全不同：

| 对象 | 作用范围 | 持久化位置 | 典型用途 |
|------|---------|-----------|---------|
| `WORLD.DATA` | 全服共享 | `data.js` | BOSS 刷新状态、活动计数器 |
| `me.query_temp()` | 单个玩家 | 该玩家的角色存档 | 玩家 BOSS 次数、报名状态 |

```typescript
// 全服全局计数器
WORLD.DATA.add_temp("boss_global_count", 1);

// 玩家个人计数器
me.add_temp("bcc", 1, UTIL.diff_time());
```

### 9. 性能注意

- 不要在 `startup()` 中做耗时操作（如大量文件 I/O），这会影响服务启动速度。
- 需要定时执行的逻辑尽量使用 `call_out` 循环而非 `setInterval`，以便热更新时能安全重置。
- 遍历 `WORLD.USERS` 时注意在循环中不要执行可能阻塞的操作。

---

## 附录：可用导入路径速查

```typescript
import { TASK }    from "../../core/task/task.js";
import { WORLD }   from "../../core/world.js";
import { UTIL }    from "../../core/util/util.js";
import { EVENTS }  from "../../core/task/events.js";
import { OBJ }     from "../../core/item/obj.js";
import { NPC }     from "../../core/char/npc.js";
import { ROOM }    from "../../core/room/room.js";
import { COMMAND } from "../../core/command.js";
import { AREA }    from "../../core/room/area.js";
import { FAMILIES } from "../../core/skill/family.js";
import type { USER }      from "../../core/char/user.js";
import type { CHARACTER } from "../../core/char/character.js";
import type { CORPSE }    from "../../core/item/corpse.js";
```

> 注意：TypeScript 源文件在 `server/core/` 目录下，但编译后的 JS 在 `server/dist/`（或其他输出目录）。运行时路径引用的是编译后的 JS 文件（`.js` 后缀）。

---

## 附录：启动时 TASK 加载顺序依赖

TASK 的资源加载在 `loadResource()` 函数中与其他资源并行预加载和创建，其依赖关系如下：

```
preload 阶段（并行）：
    EXTENDS → COMMAND → FAMILY → OBJ → AREA → SKILL → MAP → TASK → NPC

create 阶段（按顺序，同 preload 顺序）：
    EXTENDS → COMMAND → FAMILY → OBJ → AREA → SKILL → MAP → TASK → NPC
```

因此：
- 在 TASK 的 `startup()` 中可以安全使用 `WORLD.ROOMS`、`WORLD.COMMANDS`、`WORLD.SKILLS` 等。
- 在 TASK 的 `startup()` 中可以安全使用 `NPC.CLONE()`、`OBJ.CREATE()`、`FAMILIES` 等。
- 如果需要在所有资源加载完成后执行回调，覆写 `WORLD.on_resource_loaded()`（在 extends 文件中）。
