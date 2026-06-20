# USERTASK（玩家任务）编写指南

## 目录

1. [概述](#1-概述)
2. [继承体系](#2-继承体系)
3. [生命周期与回调钩子](#3-生命周期与回调钩子)
4. [UI 查询钩子](#4-ui-查询钩子)
5. [静态方法](#5-静态方法)
6. [完整 API 参考](#6-完整-api-参考)
7. [关键概念与最佳实践](#7-关键概念与最佳实践)
8. [颜色标签系统](#8-颜色标签系统)
9. [完整示例一：每日领取型任务](#9-完整示例一每日领取型任务)
10. [完整示例二：进度型任务](#10-完整示例二进度型任务)
11. [完整示例三：多阶段任务](#11-完整示例三多阶段任务)
12. [任务注册与触发](#12-任务注册与触发)
13. [调试与测试](#13-调试与测试)
14. [常见错误排查](#14-常见错误排查)

---

## 1. 概述

USERTASK（玩家任务）是游戏引擎中为每个玩家独立设计的任务系统。与 TASK（系统任务、全局周期性任务，如世界 Boss、排行榜发放等）不同，USERTASK 关注的是每个玩家独有的任务状态——师门任务、衙门兼职、武道塔奖励、新人成长任务等。

### 核心特征

- **单例模式**：每个任务类型仅有一个实例（存储在 `WORLD.TASKS` 数组中），而非每个玩家一个。
- **玩家隔离**：每个玩家的任务进度、状态通过 `me.temp`（`me.set_temp() / me.query_temp()`）存储，天然相互隔离。
- **被动轮询**：任务系统不主动推送——客户端定期调用 `query_state()`、`query_title()`、`query_desc()` 获取展示信息。
- **热更新支持**：修改任务文件保存后，引擎自动重新加载，无需重启服务器。

### 与 TASK 的区别

| 特性 | USERTASK（玩家任务） | TASK（系统任务） |
|------|----------------------|------------------|
| 存储位置 | `WORLD.TASKS` | `WORLD.SYSTEMTASKS` |
| 生命周期 | `create()` → 等待玩家 `start()` → `on_finish()` / `giveup()` | `create()` → `startup()` → 循环运行 → `stop()` |
| 玩家关联 | 每个玩家独立进度（通过 temp 隔离） | 全服共享状态 |
| 文件位置 | `server/res/task/` | `server/res/task/`（同一目录） |
| 基类 | `USERTASK extends BASE` | `TASK extends BASE` |
| 典型用途 | 师门任务、衙门追捕、武道塔、成长任务 | Boss 刷新、消息推送、排行榜发放、襄阳攻城 |

> **注意**：`server/res/task/` 目录下同时包含 `USERTASK` 和 `TASK` 文件。判断方式：`USERTASK` 继承自 `../../core/task/playertask.js`，`TASK` 继承自 `../../core/task/task.js`。

---

### 类型标注准则

> **编写玩家任务时，必须遵循以下类型标注规则：**

1. **重写方法必须显式标注参数类型和返回类型：**
   ```typescript
   // ✅ 正确
   query_title(me: CHARACTER): string | undefined {
       return `<hic>我的任务</hic>`;
   }
   query_desc(me: CHARACTER): string | undefined {
       return `进度：${me.query_temp("progress", 0)}/10`;
   }
   query_state(me: CHARACTER): number | undefined {
       let progress = me.query_temp("progress", 0);
       if (progress >= 10) return 2;
       if (progress > 0) return 1;
       return 0;
   }
   start(me: CHARACTER): boolean | void {
       me.set_temp("progress", 0);
       me.notify("<hic>任务开始！</hic>");
   }
   on_finish(me: CHARACTER): boolean {
       let progress = me.query_temp("progress", 0);
       if (progress < 10) return false;
       me.set_temp("progress", 0);
       me.add_exp(10000, 5000);
       return true;
   }
   on_create(): void {
       const old = USERTASK.GET('my_task');
       if (old) this.runtimeMap = (old as typeof this).runtimeMap;
   }

   // ❌ 错误：缺少参数类型和返回类型
   start(me) { me.set_temp("progress", 0); }
   on_finish(me) { return true; }
   query_state(me) { return 1; }
   ```

2. **类属性为对象时需标注类型：**
   ```typescript
   // ✅ 正确
   stages: StageDef[] = [
       { id: 0, title: "收集物资", ... },
   ];
   ```

---

## 2. 继承体系

### 类层次

```
BASE (server/core/base.ts)
  ├── ITEM (server/core/item.ts)        ← 提供 set_temp / query_temp / add_temp / remove_temp
  │     └── CHARACTER (server/core/char/character.ts)  ← 提供 add_exp / add_pot
  │           └── USER (server/core/char/user.ts)      ← 提供 add_obj / notify / send / level 等
  │
  └── USERTASK (server/core/task/playertask.ts)  ← 玩家任务基类
```

> 注意：`USER` 继承了 `CHARACTER`，`CHARACTER` 继承了 `ITEM`。所以 `USER` 实例（即回调中的 `me` 参数）拥有 `set_temp() / add_exp() / add_obj() / notify()` 等所有方法。

### USERTASK 类的完整定义

```typescript
// server/core/task/playertask.ts
class USERTASK extends BASE {
    id?: string;           // 任务唯一标识（在资源文件中设置）
    path?: string;         // 资源文件路径（引擎自动设置）

    // === 生命周期 ===
    on_create?(player?: CHARACTER): any;
    on_start?(player?: CHARACTER): any;     // 由资源文件动态注入
    start(player?: CHARACTER, target?: CHARACTER | null): any;
    on_finish?(player?: CHARACTER, par?: string): any;
    giveup?(player?: CHARACTER): any;
    quick_start?(player?: CHARACTER): any;

    // === UI 查询 ===
    query_title(player?: CHARACTER): string | undefined;
    query_desc(player?: CHARACTER): string | undefined;
    query_state(player?: CHARACTER): number | undefined;

    // === 静态方法 ===
    static RUN(id: string, player: CHARACTER): any;
    static GET(id: string): USERTASK | undefined;
}
```

---

## 3. 生命周期与回调钩子

### 3.1 `on_create(player?)`

- **触发时机**：任务资源文件加载/热更新时调用一次
- **用途**：一次性初始化（如恢复旧实例的状态、设置全局常量等），**不要**在这里做玩家相关的初始化
- **示例**：

```typescript
on_create() {
    // 热更新时恢复旧实例的 requests Map
    var task = USERTASK.GET('yamen2');
    if (task) {
        this.requests = (task as typeof this).requests;
    }
}
```

### 3.2 `start(player?, target?)`

- **触发时机**：调用 `USERTASK.RUN(id, player)` 时触发
- **用途**：玩家开始或接受任务时的初始化逻辑
- **说明**：这是标准的任务启动入口，子类覆写实现自定义逻辑
- **示例**：

```typescript
start(player, target?) {
    player.set_temp("quest_started", true);
    player.notify("<hic>任务开始了！</hic>");
}
```

### 3.3 `on_start(player?)`

- **触发时机**：任务启动时触发（通过资源文件动态注入的方式添加）
- **用途**：与 `start` 功能类似，但由外部资源文件注入，不需要修改基类
- **说明**：在 `on_create` 中通过 `this.on_start = function(me) { ... }` 赋值
- **注意**：通常更推荐直接覆写 `start()` 方法

### 3.4 `on_finish(player?, par?)`

- **触发时机**：玩家完成任务/点击领取奖励时触发
- **用途**：发放奖励、更新玩家状态、重置进度
- **参数**：`par` 是完成命令传递的可选参数
- **返回值**：
  - 返回 `false` / `undefined`：表示任务尚未完成，拒绝领取
  - 返回 `true` / `其他值`：表示成功完成
- **必须实现的条件检查**：在方法开头检查玩家是否满足完成条件，不满足则 `return false`

### 3.5 `giveup(player?)`

- **触发时机**：玩家放弃任务时触发
- **用途**：清理玩家任务相关状态、销毁临时 NPC 等

### 3.6 `quick_start(player?)`

- **触发时机**：快速完成模式调用
- **用途**：实现任务的快速完成/领取（由具体任务决定是否支持）

---

## 4. UI 查询钩子

这些方法在客户端打开任务面板时被引擎调用，用于渲染任务列表。

### 4.1 `query_title(player)`

- **返回值**：任务标题字符串（支持 HTML 颜色标签），或在玩家无此任务时返回 `undefined`
- **用法**：

```typescript
query_title(me) {
    let lv = me.query_temp("sm_level", 0);
    return `<hic>师门物资</hic>`;
}
```

### 4.2 `query_desc(player)`

- **返回值**：任务描述/状态文本（支持 `<br>` 换行和颜色标签），无任务时返回 `undefined`
- **用法**：这是最主要的玩家交互文本，应清晰地展示任务进度、剩余时间、当前状态等信息

```typescript
query_desc(me) {
    let progress = me.query_temp("my_progress", 0);
    return `任务进度：${progress}/10<br><mem>完成 10 次即可领取奖励</mem>`;
}
```

### 4.3 `query_state(player)`

- **返回值**：
  - `0` = 不显示 / 未激活（任务不显示在客户端面板）
  - `1` = 进行中（显示"进行中"状态）
  - `2` = 可领取（显示"领取"按钮）
  - `3` = 已完成（显示"已完成"状态）
- **用法**：

```typescript
query_state(me) {
    let progress = me.query_temp("my_progress", 0);
    if (progress >= 10) return 2;  // 显示领取按钮
    if (progress > 0) return 1;    // 显示进行中
    return 0;                       // 未激活，不显示
}
```

---

## 5. 静态方法

### 5.1 `USERTASK.RUN(id, player)`

- **功能**：按 ID 查找任务实例并调用其 `start(player)` 方法
- **参数**：
  - `id: string` — 任务 ID（对应任务类中的 `id` 属性）
  - `player: CHARACTER` — 启动任务的玩家
- **返回值**：`start()` 的返回值，未找到任务时返回 `false`
- **用法**：

```typescript
// 从命令或 NPC 交互中触发
USERTASK.RUN("yamen2", player);
```

### 5.2 `USERTASK.GET(id)`

- **功能**：按 ID 获取任务实例
- **参数**：`id: string` — 任务 ID
- **返回值**：找到的 `USERTASK` 实例，或 `undefined`
- **用法**：

```typescript
const task = USERTASK.GET('yamen');
if (task) {
    task.on_finish?.(player);
}
```

---

## 6. 完整 API 参考

### 6.1 玩家对象 (me) 的常用方法

以下方法在 `on_finish`、`start`、`query_desc` 等所有回调中的 `me` 参数上可用。

#### 临时数据（temp）操作规范

> **强制约束**：所有临时数据**必须**通过 temp 操作接口（`query_temp` / `set_temp` / `add_temp` / `remove_temp`）进行读写，**禁止**直接访问 `obj.temp["key"]` 或 `obj.temp.key`。临时数据**必须**储存于 `temp` 中。

USER 继承自 CHARACTER → ITEM，因此拥有完整的 temp 操作接口：

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取临时值。**必须提供默认值**，避免 `undefined`。若值已过期则自动返回默认值。 |
| `set_temp` | `(name: string, value: number\|string, time?: number) => void` | 写入临时值。`time` 为有效期（**毫秒**），省略则永久有效。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加数值型临时值，返回累加后的值。 |
| `remove_temp` | `(name: string) => void` | 移除临时值（设为 `null`，**不删除键名**，保留用于 JSON 序列化）。 |

**核心约束：**

1. **禁止直接访问 `temp` 对象**：`me.temp["progress"]` 或 `me.temp.progress` 是**不允许**的，必须使用上述四个方法。直接访问会绕过过期检查机制。
2. **`query_temp` 必须提供默认值**：防止 key 不存在时返回 `undefined` 导致 NaN 或类型错误。
   ```typescript
   // ❌ 错误：key 不存在时为 undefined + 1 = NaN
   let count = me.query_temp("count") + 1;
   // ✅ 正确
   let count = me.query_temp("count", 0) + 1;
   ```
3. **时间单位为毫秒**：`set_temp` / `add_temp` 的 `time` 参数是**毫秒**（不是秒）。例如 24 小时 = `86400000`。
4. **过期机制**：当值以 `{v, e}` 格式存储且 `Date.now() > e` 时，`query_temp` 自动返回默认值并将该键置为 `null`。
5. **`remove_temp` 设为 `null`**：不会真正删除键名。
6. **单例模式中玩家数据隔离**：USERTASK 是单例，所有玩家状态**必须**通过 `me.set_temp()` / `me.query_temp()` 存储（每个玩家独立），**禁止**将玩家进度存储在任务实例的 `this` 属性上。

#### 奖励发放

```typescript
// 添加经验/潜能，自动发送通知消息
me.add_exp(exp: number, pot?: number, money?: number): void

// 添加物品到背包（支持路径字符串或 OBJ 实例）
me.add_obj(obj: OBJ | string, count?: number): OBJ | undefined

// 示例：
me.add_exp(10000, 5000);
let item = me.add_obj("st/xuanjing", 10);
if (item) me.notify("你获得了" + item.unit_name() + "。");
```

#### 消息通知

```typescript
// 发送通知消息（玩家苏醒状态下可见）
me.notify(text: string): void

// 发送失败通知（总是返回 false，方便直接 return）
me.notify_fail(text: string): boolean

// 发送原始 JSON 消息到客户端
me.send(text: string): void
```

#### 属性查询

```typescript
me.level      // 玩家等级（number）
me.name       // 玩家名称（string）
me.gender     // 性别（string）
me.family     // 所属门派（FAMILY 对象）
me.skills     // 技能表（SkillsMap）
me.exp        // 玩家当前经验值
me.pot        // 玩家当前潜能值
me.money      // 玩家金钱
me.id         // 玩家唯一 ID（string）

// 查询技能等级
me.query_skill(skill_id: string): number | undefined

// 检查玩家是否可以传送
me.can_trans(): boolean
```

#### 称号操作

```typescript
// 添加称号（title 为 null 时移除称号）
me.add_title(title: string | null, type: string): void
```

### 6.2 物品相关（OBJ）

```typescript
// 创建一个物品实例
OBJ.CREATE(path: string, count?: number): OBJ

// 按概率表创建物品（返回创建的物品数组）
OBJ.create_by_odds(oddsEntries: OddsEntry[]): OBJ[]

// OddsEntry 结构：
interface OddsEntry {
    obj: string | string[];       // 命中时的物品路径（数组则随机取一）
    odds?: number;                // 概率（万分比，默认 10000 = 100%）
    fall_obj?: string | string[]; // 未命中时的保底物品
    count?: number;               // 固定数量（与 min/max 互斥）
    min?: number;                 // 随机数量下限
    max?: number;                 // 随机数量上限
}

// 物品的常用方法
item.unit_name(count?: number): string   // 获取物品的单位名称（如"十两银子"）

// 物品的常用属性
item.color_name   // 带颜色标签的名称
item.count        // 物品数量
item.grade        // 品级
```

### 6.3 世界对象（WORLD）

```typescript
WORLD.TASKS       // USERTASK 实例数组（所有玩家任务）
WORLD.SYSTEMTASKS // TASK 实例数组（所有系统任务）
WORLD.USERS       // 所有在线玩家（USER[]）
WORLD.getUser(id) // 按 ID 获取在线玩家

// 全局临时数据（用于全服状态）
WORLD.DATA.query_temp<T>(name: string, def?: T): T
WORLD.DATA.set_temp(name: string, value: any, time?: number): void
WORLD.DATA.add_temp(name: string, value: number, time?: number): number
```

### 6.4 其他工具

```typescript
// 获取技能定义
SKILL.get(id: string): SKILL | undefined

// 获取门派（所有门派在 FAMILIES 常量中）
FAMILIES.GAIBANG
FAMILIES.WUDANG
FAMILIES.HUASHAN
FAMILIES.XIAOYAO
FAMILIES.EMEI
FAMILIES.SHASHOU
FAMILIES.SHAOLIN
FAMILIES.NONE

// 当前时间戳
Date.now()

// 随机数（来自 BASE）
this.random(num: number): number   // 返回 [0, num-1] 的随机整数

// 延时调用
this.call_out(func, delay_ms, arg1?, arg2?)
```

---

## 7. 关键概念与最佳实践

### 7.1 单例模式

USERTASK 是**单例**——整个服务器每种任务只有一个实例。不要将玩家特定数据存储在任务实例的 `this` 上。错误示例：

```typescript
// 错误：多人共用会导致数据污染
start(me) {
    this.playerProgress = 5; // 所有玩家共享这个值！
}
```

正确做法是将所有玩家状态存储在 `me.temp` 中：

```typescript
// 正确：每个玩家独立存储
start(me) {
    me.set_temp("my_progress", 5);
}
```

### 7.2 使用 me 参数

所有钩子的第一个参数是**触发该回调的玩家**（类型为 `CHARACTER`，实际是 `USER` 实例）。在回调中始终通过参数 `me`（或 `player`）访问玩家数据。

### 7.3 条件检查模式

在 `on_finish` 等发放奖励的方法中，始终执行条件检查：

```typescript
on_finish(me) {
    let count = me.query_temp("my_count", 0);
    if (!(count > 0)) return false;       // 不满足条件，拒绝
    if (count < 10) {
        me.notify("你还未完成任务。");
        return false;
    }
    // ... 发放奖励
    me.set_temp("my_count", 0);           // 重置进度
    return true;
}
```

### 7.4 query_state 与 on_finish 的配合

- `query_state` 返回 `2`（可领取）时，客户端会显示"领取"按钮
- 玩家点击领取按钮触发 `on_finish`（通过命令系统）
- `on_finish` 应重置状态，使 `query_state` 重新返回 `1` 或 `0`

### 7.5 时间管理

- 所有时间使用 `Date.now()` 获取（毫秒时间戳）
- `set_temp` 的 `duration` 参数自动处理过期：
  - `me.set_temp("daily_quest", true, 86400000)` — 24 小时后自动过期
  - 过期的 temp 在 `query_temp` 时返回默认值，不会残留
- 也可以手动控制时间：

```typescript
// 存储时间戳自行判断
me.set_temp("start_time", Date.now());
let elapsed = Date.now() - me.query_temp("start_time", 0);
if (elapsed > 3600000) { // 超过1小时
    // 超时逻辑
}
```

### 7.6 热更新注意事项

- 修改任务文件后，引擎自动重新加载并调用 `on_create()`
- `on_create()` 应处理从旧实例恢复状态：

```typescript
on_create() {
    const old = USERTASK.GET('my_task');
    if (old) {
        // 恢复旧实例中的运行时数据（如 Map、定时器等）
        this.someMap = (old as typeof this).someMap;
    }
}
```

### 7.7 query_desc 中的 HTML 标签

- `<br>` 用于换行
- `<mem>` 标签表示次要/提示信息（显示为灰色）
- 颜色标签 `<hic>`、`<hiy>`、`<hig>` 等用于高亮（见颜色标签章节）

---

## 8. 颜色标签系统

引擎支持以下颜色标签，可在 `notify()`、`query_title()`、`query_desc()` 中使用：

| 标签 | 效果 | 用途 |
|------|------|------|
| `<hic>` | 亮青色 | 标题、重要信息 |
| `<hiy>` | 亮黄色 | 奖励、金币、经验 |
| `<hig>` | 亮绿色 | 成功、获得物品 |
| `<hiz>` | 亮紫色 | 特殊物品、高品级 |
| `<hio>` | 亮橙色 | 元宝、高级奖励 |
| `<wht>` | 白色 | 普通物品、常规文本 |
| `<red>` | 红色 | 错误、失败、危险 |
| `<grn>` | 绿色 | 一般正面状态 |
| `<yel>` | 黄色 | 警告、提示 |
| `<blu>` | 蓝色 | 信息提示 |
| `<cyn>` | 青色 | 一般信息 |
| `<mem>` | 灰色 | 辅助说明、次要提示 |
| `<hil>` | 亮色高亮 | 强调内容 |

示例：

```typescript
me.notify("<hiy>你获得了 1000 点经验！</hiy>");
me.notify("<red>任务失败了！</red>");

query_title(me) {
    return `<hic>我的日常任务</hic>`;
}

query_desc(me) {
    return `当前进度：5/10<br><mem>每天可完成一次</mem>`;
}
```

---

## 9. 完整示例一：每日领取型任务

此类任务基于时间累积奖励，玩家可以定时领取（类似师门物资、衙门报酬）。

```typescript
// 文件：server/res/task/daily_reward.ts
import {USERTASK} from "../../core/task/playertask.js";
import {OBJ} from "../../core/item/obj.js";

export default class DailyRewardTask extends USERTASK {
    id = "daily_reward";

    on_create(): void {
        // 可在热更新时恢复状态
    }

    /**
     * 查询可领取次数（根据时间累积计算）
     */
    query_claimable(me: CHARACTER): number {
        let baseTime = me.query_temp("daily_base_time", 0);
        if (!baseTime) return 0;

        // 每 24 小时累积 1 次，最多累积 7 次
        let hours = Math.floor((Date.now() - baseTime) / 3600000);
        let count = Math.floor(hours / 24);
        return Math.min(count, 7);
    }

    query_title(me: CHARACTER): string | undefined {
        let count = this.query_claimable(me);
        let completed = me.query_temp("daily_done", false);
        if (completed) return `<hig>每日任务（已完成）</hig>`;
        return `<hic>每日任务</hic>`;
    }

    query_desc(me: CHARACTER): string | undefined {
        let count = this.query_claimable(me);
        let completed = me.query_temp("daily_done", false);

        if (completed) {
            return "你已完成今日的每日任务，<wht>明天再来</wht>吧。<br><mem>每日任务每天可完成一次</mem>";
        }

        if (count > 0) {
            let mem = "";
            if (count >= 7) mem = "，已到累积上限";
            return `你已累积了 <hiy>${count}</hiy> 份奖励待领取${mem}。<br><mem>每 24 小时累积 1 份，最多 7 份</mem>`;
        }

        let remainTime = (3600000 * 24) - (Date.now() - me.query_temp("daily_base_time", Date.now()));
        if (remainTime > 0) {
            let hours = Math.floor(remainTime / 3600000);
            let mins = Math.floor((remainTime % 3600000) / 60000);
            return `等待奖励累积中……<br><mem>下次领取约 ${hours} 小时 ${mins} 分钟后</mem>`;
        }
        return "等待奖励累积中……";
    }

    query_state(me: CHARACTER): number | undefined {
        let completed = me.query_temp("daily_done", false);
        if (completed) return 3; // 已完成

        let count = this.query_claimable(me);
        if (count > 0) return 2; // 可领取
        return 1;                // 进行中（等待累积）
    }

    /**
     * 玩家主动开始任务
     */
    start(me: CHARACTER): boolean | void {
        if (!me.query_temp("daily_base_time", 0)) {
            // 首次启动，记录基准时间
            me.set_temp("daily_base_time", Date.now());
            me.notify("<hic>你开始了每日任务！每 24 小时可领取一份奖励，别忘了按时领取。</hic>");
        } else {
            me.notify("<hic>每日任务已在进行中。</hic>");
        }
    }

    on_finish(me: CHARACTER): boolean {
        let count = this.query_claimable(me);
        if (!(count > 0)) {
            me.notify("<red>暂无奖励可领取。</red>");
            return false;
        }

        // 计算奖励
        let expReward = 5000 * count;
        let potReward = 3000 * count;
        let silverCount = 5 * count;

        // 发放经验/潜能
        me.add_exp(expReward, potReward);

        // 发放物品
        let silver = OBJ.CREATE("money/silver", silverCount);
        if (silver) {
            let obj = me.add_obj(silver);
            if (obj) {
                me.notify("你获得了" + obj.unit_name() + "。");
            }
        }

        // 额外几率物品
        let oddsItems = [
            {
                obj: "st/xuanjing",
                odds: 3000,     // 30% 概率
                count: count
            },
            {
                obj: "drug/exp#0",
                odds: 1000,     // 10% 概率
                count: 1
            }
        ];
        let extraItems = OBJ.create_by_odds(oddsItems);
        for (let item of extraItems) {
            let obj = me.add_obj(item);
            if (obj) {
                me.notify("你额外获得了" + obj.unit_name() + "。");
            }
        }

        // 更新领取时间（按领取次数推进基准时间）
        let baseTime = me.query_temp("daily_base_time", Date.now());
        me.set_temp("daily_base_time", baseTime + count * 86400000);

        // 标记今日已完成
        me.set_temp("daily_done", true, 86400000);

        me.notify(`<hiy>你领取了 ${count} 份每日奖励，获得 ${expReward} 点经验，${potReward} 点潜能。</hiy>`);
        return true;
    }

    giveup(me: CHARACTER): void {
        me.remove_temp("daily_base_time");
        me.remove_temp("daily_done");
        me.notify("<hic>你放弃了每日任务。</hic>");
    }
}
```

---

## 10. 完整示例二：进度型任务

此类任务通过玩家的各类行为推进进度（杀怪、收集物品、完成副本等），达到目标后领取奖励。

```typescript
// 文件：server/res/task/hunt_task.ts
import {USERTASK} from "../../core/task/playertask.js";
import {OBJ} from "../../core/item/obj.js";
import type {OddsEntry} from "../../core/item/obj.js";

export default class HuntTask extends USERTASK {
    id = "hunt";
    /** 任务目标数量 */
    targetCount = 20;

    query_title(me: CHARACTER): string | undefined {
        let progress = me.query_temp("hunt_progress", 0);
        if (progress >= this.targetCount) return `<hig>狩猎任务（可领取）</hig>`;
        return `<hic>狩猎任务</hic>`;
    }

    query_desc(me: CHARACTER): string | undefined {
        let progress = me.query_temp("hunt_progress", 0);
        let isActive = me.query_temp("hunt_active", false);

        if (!isActive) {
            return "你还没有开始狩猎任务。<br><mem>找到猎人 NPC 接取任务</mem>";
        }

        if (progress >= this.targetCount) {
            return `你已完成狩猎任务，共击杀 ${progress} 只怪物。<br><mem>回去找猎人领取奖励吧</mem>`;
        }

        return `狩猎进度：<hiy>${progress}</hiy> / ${this.targetCount}<br>` +
               `<mem>击杀野外怪物推进进度，击杀 ${this.targetCount} 只后可领取奖励</mem>`;

        // 也可以显示进度条效果（通过 unicode 字符）：
        // let barLength = 20;
        // let filled = Math.floor(progress / this.targetCount * barLength);
        // return `[${'■'.repeat(filled)}${'□'.repeat(barLength - filled)}] ${progress}/${this.targetCount}`;
    }

    query_state(me: CHARACTER): number | undefined {
        if (!me.query_temp("hunt_active", false)) return 0; // 未激活，不显示
        let progress = me.query_temp("hunt_progress", 0);
        if (progress >= this.targetCount) return 2; // 可领取
        return 1; // 进行中
    }

    /**
     * 从 NPC 处接取任务
     */
    start(me: CHARACTER): boolean | void {
        if (me.query_temp("hunt_active", false)) {
            me.notify("你已经在进行狩猎任务了。");
            return false;
        }

        me.set_temp("hunt_active", true);
        me.set_temp("hunt_progress", 0);

        me.notify(`<hic>猎人告诉你：去击杀 ${this.targetCount} 只怪物历练一下吧！</hic>`);
        return true;
    }

    /**
     * 由外部系统（击杀怪物事件）调用，推进进度
     */
    add_progress(me, amount = 1) {
        if (!me.query_temp("hunt_active", false)) return;

        let progress = me.add_temp("hunt_progress", amount);
        if (progress >= this.targetCount) {
            me.notify(`<hiy>狩猎任务已完成！回去找猎人领取奖励吧。</hiy>`);
        } else if (progress % 5 === 0) {
            // 每 5 只提醒一次
            me.notify(`狩猎进度：${progress}/${this.targetCount}`);
        }
    }

    on_finish(me: CHARACTER): boolean {
        if (!me.query_temp("hunt_active", false)) {
            me.notify("<red>你没有接取狩猎任务。</red>");
            return false;
        }

        let progress = me.query_temp("hunt_progress", 0);
        if (progress < this.targetCount) {
            me.notify(`<red>你只击杀了 ${progress} 只怪物，还需要继续努力。</red>`);
            return false;
        }

        // 发放基础奖励
        let baseExp = 8000;
        let basePot = 5000;
        me.add_exp(baseExp, basePot);

        // 按等级分段额外奖励
        let level = me.level;
        let extraExp = 0;
        if (level >= 3) extraExp = 50000;
        else if (level >= 2) extraExp = 20000;
        else if (level >= 1) extraExp = 5000;

        if (extraExp > 0) {
            me.add_exp(extraExp, extraExp / 2);
        }

        // 随机奖励物品
        let oddsItems: OddsEntry[] = [
            {
                obj: "st/xuanjing",
                odds: 8000,  // 80%
                min: 1,
                max: 5
            },
            {
                obj: ["st/st_red#0", "st/st_gre#0", "st/st_blu#0"],
                odds: 4000,  // 40%
                count: 1
            },
            {
                obj: "cash/tianshifu",
                odds: 1500,  // 15%
                count: 1
            }
        ];
        let items = OBJ.create_by_odds(oddsItems);
        for (let item of items) {
            let obj = me.add_obj(item);
            if (obj) {
                me.notify("你获得了" + obj.unit_name() + "。");
            }
        }

        // 重置状态
        me.remove_temp("hunt_active");
        me.remove_temp("hunt_progress");

        me.notify(`<hiy>狩猎任务完成！共获得 ${baseExp + extraExp} 点经验。</hiy>`);
        return true;
    }

    giveup(me) {
        me.remove_temp("hunt_active");
        me.remove_temp("hunt_progress");
        me.notify("<hic>你放弃了狩猎任务。</hic>");
    }
}
```

**外部触发进度更新**（在怪物死亡事件中调用）：

```typescript
// 在 NPC 的 on_died 回调中：
let task = USERTASK.GET('hunt');
if (task) {
    (task as HuntTask).add_progress(killer);
}
```

---

## 11. 完整示例三：多阶段任务

此类任务由多个步骤组成，玩家按顺序完成每个阶段，阶段之间有依赖关系。

```typescript
// 文件：server/res/task/multi_stage.ts
import {USERTASK} from "../../core/task/playertask.js";
import {OBJ} from "../../core/item/obj.js";
import {WORLD} from "../../core/world.js";

// 阶段定义
interface StageDef {
    id: number;
    title: string;
    desc: string;
    checkComplete: (me: any) => boolean;
    reward: (me: any) => void;
}

export default class MultiStageTask extends USERTASK {
    id = "multi_stage";

    /** 阶段配置表 */
    stages: StageDef[] = [
        {
            id: 0,
            title: "收集物资",
            desc: "收集 5 份木材交给管事。<br><mem>到扬州城外伐木获得木材</mem>",
            checkComplete: (me) => (me.query_temp("stage_0_count", 0) ?? 0) >= 5,
            reward: (me) => {
                me.add_exp(2000, 1000);
                me.notify("<hig>管事满意地点了点头。</hig>");
            }
        },
        {
            id: 1,
            title: "运送货物",
            desc: "将货物送往襄阳商会。<br><mem>找到扬州商会领取货物</mem>",
            checkComplete: (me) => me.query_temp("stage_1_done", false),
            reward: (me) => {
                let item = me.add_obj("money/silver", 20);
                if (item) me.notify("你获得了" + item.unit_name() + "。");
                me.add_exp(5000, 3000);
            }
        },
        {
            id: 2,
            title: "击败山贼",
            desc: "前往城西山贼营寨，击败山贼头目。<br><mem>山贼头目随身携带重要信物</mem>",
            checkComplete: (me) => me.query_temp("stage_2_done", false),
            reward: (me) => {
                me.add_exp(15000, 8000);
                let odds = [
                    { obj: "st/st_red#1", odds: 5000, count: 1 },
                    { obj: "book/bc#dodge", odds: 2000, count: 1 }
                ];
                let items = OBJ.create_by_odds(odds);
                for (let item of items) {
                    let obj = me.add_obj(item);
                    if (obj) me.notify("你获得了" + obj.unit_name() + "。");
                }
            }
        },
        {
            id: 3,
            title: "最终考验",
            desc: "回到管事处报告，完成全部任务。<br><mem>这是任务的最后一步</mem>",
            checkComplete: (me) => true, // 只要到达此阶段即完成
            reward: (me) => {
                me.add_exp(50000, 30000);
                let item = me.add_obj("cash/xi", 1);
                if (item) me.notify("你获得了一颗" + item.color_name + "！");
                me.notify("<hiy>恭喜你完成了全部考验！</hiy>");
            }
        }
    ];

    /**
     * 获取玩家当前阶段
     */
    getStage(me: CHARACTER): number {
        return me.query_temp("multi_stage", 0) ?? 0;
    }

    /**
     * 推进到下一阶段
     */
    nextStage(me: CHARACTER): boolean {
        let stage = this.getStage(me);
        if (stage >= this.stages.length) {
            me.notify("你已经完成了所有阶段。");
            return false;
        }

        // 检查当前阶段是否完成
        if (!this.stages[stage].checkComplete(me)) {
            me.notify("<red>你还没有完成当前阶段的任务。</red>");
            return false;
        }

        // 发放当前阶段奖励
        this.stages[stage].reward(me);

        // 推进阶段
        let nextStage = stage + 1;
        me.set_temp("multi_stage", nextStage);

        if (nextStage >= this.stages.length) {
            me.notify("<hiy><hic>恭喜你完成了多阶段任务的所有内容！</hic></hiy>");
        } else {
            me.notify(`<hiy>阶段完成！当前进度：${nextStage}/${this.stages.length}</hiy>`);
            me.notify(`<hic>下一阶段：${this.stages[nextStage].title}</hic>`);
        }

        return true;
    }

    query_title(me: CHARACTER): string | undefined {
        let stage = this.getStage(me);
        if (stage >= this.stages.length) return `<hig>历练任务（已完成）</hig>`;
        if (this.stages[stage].checkComplete(me)) return `<hiy>历练任务（可提交）</hiy>`;
        return `<hic>历练任务</hic>`;
    }

    query_desc(me: CHARACTER): string | undefined {
        let stage = this.getStage(me);
        if (stage >= this.stages.length) {
            return "你已经完成了所有阶段的历练任务！<br><mem>感谢你的付出</mem>";
        }

        let s = this.stages[stage];
        let progressStr = "";
        if (stage === 0) {
            let count = me.query_temp("stage_0_count", 0) ?? 0;
            progressStr = `<br>木材：${count}/5`;
        }

        return `当前阶段【${s.title}】（${stage + 1}/${this.stages.length}）<br>${s.desc}${progressStr}`;
    }

    query_state(me: CHARACTER): number | undefined {
        let stage = this.getStage(me);
        if (stage >= this.stages.length) return 3; // 全部完成
        if (this.stages[stage].checkComplete(me)) return 2; // 当前阶段可提交
        return 1; // 进行中
    }

    start(me: CHARACTER): boolean | void {
        let stage = this.getStage(me);
        if (stage > 0) {
            me.notify("你已经开始了历练任务，继续努力吧。");
            return false;
        }
        me.set_temp("multi_stage", 1); // 初始阶段从 0 开始，设置到阶段 0
        // 恢复为 0
        me.set_temp("multi_stage", 0);
        me.notify("<hic>你开始了历练任务，先去收集 5 份木材吧。</hic>");
        return true;
    }

    /**
     * 提交当前阶段（由 NPC 交互调用）
     */
    on_finish(me: CHARACTER): boolean {
        return this.nextStage(me);
    }

    // 阶段 0 专用：添加木材
    add_wood(me: CHARACTER, count: number = 1): void {
        let stage = this.getStage(me);
        if (stage !== 0) {
            me.notify("你现在不需要木材。");
            return;
        }
        let total = me.add_temp("stage_0_count", count);
        me.notify(`木材：${total}/5`);
        if (total >= 5) {
            me.notify("<hiy>木材收集够了！回去找管事提交吧。</hiy>");
        }
    }

    // 阶段 1 专用：标记货物送达
    mark_delivery(me: CHARACTER): void {
        let stage = this.getStage(me);
        if (stage !== 1) return;
        me.set_temp("stage_1_done", true);
        me.notify("<hiy>货物已送达！回去找管事提交吧。</hiy>");
    }

    // 阶段 2 专用：标记山贼击败
    mark_boss_killed(me: CHARACTER): void {
        let stage = this.getStage(me);
        if (stage !== 2) return;
        me.set_temp("stage_2_done", true);
        me.notify("<hiy>你击败了山贼头目！回去找管事提交吧。</hiy>");
    }

    giveup(me: CHARACTER): void {
        // 放弃任务，清理所有阶段数据
        for (let i = 0; i < this.stages.length; i++) {
            me.remove_temp(`stage_${i}_count`);
            me.remove_temp(`stage_${i}_done`);
        }
        me.remove_temp("multi_stage");
        me.notify("<hic>你放弃了历练任务。</hic>");
    }
}
```

---

## 12. 任务注册与触发

### 12.1 自动注册

将文件放入 `server/res/task/` 目录后，引擎在启动时自动扫描该目录，通过 `BASE.PRELOAD` 预加载并创建实例：

```typescript
// 引擎内部（world.ts）
const dirs = [
    __PATH.EXTENDS, __PATH.COMMAND, __PATH.FAMILY,
    __PATH.OBJ, __PATH.AREA, __PATH.SKILL,
    __PATH.MAP, __PATH.TASK, __PATH.NPC,
];

// Phase 1: preload all modules (async)
// Phase 2: create instances from cache (sync)
// 在 Phase 2 中，引擎读取 res/task/ 下的 .js 文件，
// 调用 BASE.CREATE(__PATH.TASK, fname)，
// 这会执行默认导出类的构造函数，然后调用 create(path)
// USERTASK 的 create(path) 将 this 推入 WORLD.TASKS
```

### 12.2 文件要求

- 文件扩展名：`.ts`（源代码，编译为 `.js` 后生效）
- 默认导出：必须 `export default class extends USERTASK { ... }`
- 必须设置 `id` 属性：`id = "my_task";`
- 导入基类：`import {USERTASK} from "../../core/task/playertask.js";`

### 12.3 触发方式

**方式一：通过命令触发**

```typescript
// 在命令文件中：
import {USERTASK} from "../../core/task/playertask.js";
COMMAND.add("start_quest", {
    exec: (me) => {
        USERTASK.RUN("hunt", me);
    }
});
```

**方式二：通过 NPC 交互触发**

```typescript
// 在 NPC 资源文件中：
npc.on_command = {
    quest: function(me) {
        USERTASK.RUN("hunt", me);
    }
};
```

**方式三：通过条件自动触发**

```typescript
// 在某个系统事件中：
if (me.level >= 1 && !me.query_temp("hunt_active", false)) {
    USERTASK.RUN("hunt", me);
}
```

**方式四：手动调用 `start()`**

```typescript
let task = USERTASK.GET('hunt');
if (task) {
    task.start(me);
}
```

### 12.4 触发完成

```typescript
// 玩家点击"领取"按钮（由命令系统处理）：
// 命令系统调用 USERTASK 实例的 on_finish(me)

// 或手动触发：
let task = USERTASK.GET('hunt');
if (task) {
    task.on_finish?.(me);
}
```

---

## 13. 调试与测试

### 13.1 添加测试命令

```typescript
// 在开发环境添加调试命令：
COMMAND.add("test_task", {
    exec: function(me) {
        // 查看所有任务
        for (let task of WORLD.TASKS) {
            me.notify(`任务: ${task.id}, path: ${task.path}`);
        }
        // 启动特定任务
        USERTASK.RUN("hunt", me);
        // 强制完成任务
        let t = USERTASK.GET("hunt");
        if (t) t.on_finish?.(me);
    }
});
```

### 13.2 查看玩家 temp 数据

```typescript
// 管理命令中查看玩家 temp：
COMMAND.add("check_temp", {
    exec: function(me, targetId) {
        let target = WORLD.getUser(targetId);
        if (target) {
            me.notify(JSON.stringify(target.temp, null, 2));
        }
    }
});
```

### 13.3 热更新测试

1. 确保 TypeScript 编译运行中（`npm run dev` 或类似）
2. 修改 `server/res/task/` 下的 `.ts` 文件
3. 保存后引擎自动检测文件变化并热更新
4. `on_create()` 会被调用（检查控制台日志中是否有错误）
5. 刷新客户端任务面板查看效果

### 13.4 常见调试模式

```typescript
// 在 on_create 中打印日志
on_create() {
    console.log("【任务】my_task 已加载");
}

// 在关键方法中打印日志
start(me) {
    console.log(`【任务】玩家 ${me.name} 开始 my_task`);
}

on_finish(me) {
    console.log(`【任务】玩家 ${me.name} 完成 my_task`);
}
```

---

## 14. 常见错误排查

### 14.1 任务不显示在客户端

**原因**：
- `query_state()` 返回 `0`（不显示）或 `undefined`
- 文件未正确放置在 `res/task/` 目录
- TypeScript 编译错误导致文件未生成 `.js`

**解决**：
- 检查 `query_state` 的逻辑：确保玩家触发后返回 `1` 或 `2`
- 确认 `id` 属性已正确设置
- 检查控制台错误日志

### 14.2 点击领取按钮无反应

**原因**：
- `on_finish` 返回了 `false`（条件检查不通过）
- `on_finish` 未定义（未覆写）

**解决**：
- 在 `on_finish` 开头添加日志确认被调用
- 检查条件判断逻辑
- 确保 `on_finish` 在满足条件时返回 `true` 或非 `false` 的值

### 14.3 多人数据污染

**原因**：将玩家状态存储在任务实例的 `this` 上

**解决**：全部改用 `me.set_temp()` / `me.query_temp()`

### 14.4 热更新后状态丢失

**原因**：`on_create()` 没有恢复热更新前旧实例的运行时数据

**解决**：

```typescript
on_create() {
    let old = USERTASK.GET('my_task');
    if (old) {
        // 恢复运行时状态（如 Map、setTimeout 句柄等）
        this.runtimeMap = (old as typeof this).runtimeMap;
    }
}
```

### 14.5 物品创建失败

**原因**：物品路径错误或物品资源未加载

**解决**：
- 检查 `OBJ.CREATE()` 的路径是否存在于 `res/obj/` 目录
- 物品路径使用正斜杠 `/`（不要用反斜杠）
- 用 `if (item)` 判断创建是否成功

### 14.6 add_exp 无效果

**原因**：`me.add_exp()` 仅在 `CHARACTER` 上定义，确保 `me` 是 `USER` 实例

**解决**：始终使用回调参数中的 `me`（引擎传入的必定是 `USER`）

### 14.7 query_temp 返回 undefined 导致 NaN

**原因**：`query_temp` 没有提供默认值

**解决**：

```typescript
// 错误：当 key 不存在时 me.query_temp("count") 返回 undefined
let count = me.query_temp("count") + 1;  // NaN

// 正确：提供默认值
let count = me.query_temp("count", 0) + 1;
```

---

## 附录：快速模板

### 最小模板

```typescript
import {USERTASK} from "../../core/task/playertask.js";

export default class MyTask extends USERTASK {
    id = "my_task";

    query_title(me: CHARACTER): string | undefined {
        return `<hic>我的任务</hic>`;
    }

    query_desc(me: CHARACTER): string | undefined {
        let progress = me.query_temp("progress", 0);
        return `进度：${progress}/10`;
    }

    query_state(me: CHARACTER): number | undefined {
        let progress = me.query_temp("progress", 0);
        if (progress >= 10) return 2;
        if (progress > 0) return 1;
        return 0;
    }

    start(me: CHARACTER): boolean | void {
        me.set_temp("progress", 0);
        me.notify("<hic>任务开始！</hic>");
    }

    on_finish(me: CHARACTER): boolean {
        let progress = me.query_temp("progress", 0);
        if (progress < 10) return false;
        me.set_temp("progress", 0);
        me.add_exp(10000, 5000);
        me.notify("<hiy>任务完成！</hiy>");
        return true;
    }
}
```

### 文件目录

```
server/
├── res/
│   ├── task/                     ← 所有 TASK 和 USERTASK 文件放在这里
│   │   ├── sm_task.ts            ← 师门物资任务 (USERTASK)
│   │   ├── ym_task.ts            ← 衙门兼职任务 (USERTASK)
│   │   ├── ym_task2.ts           ← 衙门追捕任务 (USERTASK)
│   │   ├── wd_task.ts            ← 武道塔任务 (USERTASK)
│   │   ├── grow_task.ts          ← 成长任务 (USERTASK)
│   │   ├── boss_task.ts          ← Boss 任务 (TASK)
│   │   ├── goods_task.ts         ← 商品任务 (TASK)
│   │   ├── xy_task.ts            ← 襄阳城战 (TASK)
│   │   ├── top_1.ts              ← 排行榜发放 (TASK)
│   │   ├── msg.ts                ← 消息推送 (TASK)
│   │   └── my_task.ts            ← 你的新任务 (USERTASK)
│   └── ...
└── core/
    ├── task/
    │   ├── playertask.ts         ← USERTASK 基类定义
    │   └── task.ts               ← TASK 基类定义
    └── ...
```
