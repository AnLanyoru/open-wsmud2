# ROOM（房间）编写指南

## 目录

1. [概述](#1-概述)
2. [类层次结构](#2-类层次结构)
3. [文件位置与路径约定](#3-文件位置与路径约定)
4. [完整属性参考](#4-完整属性参考)
5. [构造方法](#5-构造方法)
6. [回调钩子](#6-回调钩子)
7. [运行时方法](#7-运行时方法)
8. [出口系统与方向约定](#8-出口系统与方向约定)
9. [隐藏物品系统](#9-隐藏物品系统)
10. [镜像房间与副本系统](#10-镜像房间与副本系统)
11. [事件系统](#11-事件系统)
12. [新手教程：逐步编写房间](#12-新手教程逐步编写房间)
13. [完整工作示例](#13-完整工作示例)
14. [常见陷阱与注意事项](#14-常见陷阱与注意事项)
15. [附录：AREA 区域文件快速参考](#15-附录area-区域文件快速参考)

---

## 1. 概述

房间（ROOM）是 MUD 游戏世界的空间基础单位。玩家/NPC 在房间之间移动，房间容纳物品和角色，提供出口信息、自定义命令和游戏逻辑。

房间文件存放于 `server/res/map/` 目录下，按区域组织子目录。每个文件导出一个继承 `ROOM` 的默认类，由服务器启动时自动发现、预加载并实例化。

### 房间的生命周期

```
服务器启动
  │
  ├── Phase 1 (PRELOAD): 递归扫描 server/res/map/，动态 import 每个 .js 文件，缓存类定义
  │
  └── Phase 2 (CREATE): 再次递归扫描，对每个文件调用 BASE.CREATE()
        │
        └── 触发 new RoomClass() → constructor() → ROOM.create(path)
              │
              ├── WORLD.ROOM_STORE.set(path, this)    ← 保存干净资源原型
              ├── Object.create(this) → on_clone()    ← 创建基础运行房间
              ├── active.on_create?.()                ← 初始化该运行房间
              ├── WORLD.ROOMS.set(path, active)       ← 注册基础运行房间
              ├── active.parent = area                ← 关联区域
              ├── area.rooms.push(active)             ← 加入区域房间列表
              └── 非副本区域时加入 WORLD.RUN_ROOMS    ← 接收心跳
```

---

### 类型标注与 temp 操作

> **类型标注、temp 操作方法等通用约束详见 [全局开发约束.md](全局开发约束.md)。以下仅列出 ROOM 特有的注意事项。**

- **`exits` 需标注 `Record<string, string>`**，`hidden_items` 需标注 `ITEM[] | null`
- **ROOM 的副本共享 temp 使用 `fb_*` 方法**，详见下方 [4.10 临时数据操作规范](#410-临时数据temp操作规范)

---

## 2. 类层次结构

```
BASE
 └── ITEM
      └── ROOM
```

- **BASE**（`server/core/base.ts`）：所有对象的根基类。提供 `set()` 批量属性设置、`create_uid()` 生成唯一ID、`call_out()` 延时调用、`call_interval()` 间隔调用、`add_event()`/`remove_event()`/`fire_event()` 事件系统、以及静态的 `PRELOAD()`/`CREATE()`/`NEW()` 资源加载工厂方法。
- **ITEM**（`server/core/item.ts`）：所有游戏物件的基类（物品、角色、房间等）。提供 `add_action()`/`remove_action()`/`exec()` 命令系统、`notify()` 发送消息、物品容器管理（`items` 数组、`push_item()`/`remove_item()`/`find_obj_byid()`）、`query_temp()`/`set_temp()`/`add_temp()` 临时数据存储。
- **ROOM**（`server/core/room/room.ts`）：房间类。继承 ITEM，添加出口系统、NPC/物品放置、隐藏物品、镜像/副本机制、心跳、区域关联。

---

## 3. 文件位置与路径约定

### 文件存放

```
server/res/map/
  ├── yz/              ← 扬州区域
  │   ├── guangchang.ts
  │   ├── beidajie1.ts
  │   ├── wumiao.ts
  │   ├── by/          ← 子目录
  │   └── leitai/      ← 子目录
  ├── bj/              ← 北京区域
  │   ├── ao/
  │   ├── shenlong/
  │   └── tdh/
  ├── huashan/         ← 华山
  └── gaibang/         ← 丐帮
```

### 路径约定

- 每个房间有一个 `path` 属性，由文件路径自动推导。
- 文件 `server/res/map/yz/beidajie1.ts` 的 path 为 `"yz/beidajie1"`。
- 文件 `server/res/map/yz/leitai/biwu2.ts` 的 path 为 `"yz/leitai/biwu2"`。
- 出口（exits）中的目标路径使用此格式引用其他房间：`"east": "yz/beidajie2"`。

### 导入基类

```typescript
import {ROOM} from "../../../core/room/room.js";
// 根据文件嵌套深度调整相对路径：
// map/ 下的一级文件用 "../../"  (如 yz/guangchang.ts)
// map/ 下的二级文件用 "../../../" (如 yz/leitai/biwu2.ts)
// map/ 下的三级文件用 "../../../../" (如 yz/lw/milin3.ts)
```

---

## 4. 完整属性参考

所有属性在类体中直接声明为类字段（class field），可以在声明时赋予默认值，或在 constructor 中修改。

### 4.1 核心标识属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `""` | 房间短名称，如 "北大街"、"武庙"。客户端显示在顶部。 |
| `desc` | `string` | `""` | 房间描述文本，进入房间时显示。支持 HTML 标签，可用 `<cmd cmd='look tree'>大榕树(tree)</cmd>` 创建可点击链接。 |
| `_room_name` | `string` | 自动 | 房间完整名称 = `区域名-房间名`，由 `initBaseRoom()` 自动设置。通过 `long_name()` 方法访问。 |

### 4.2 出口属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `exits` | `Record<string, string> \| null` | `null` | 出口映射表，键为方向，值为目标房间路径。详见 [出口系统](#8-出口系统与方向约定)。 |
| `room_exits_json` | `string \| null` | `null` | 出口 JSON 缓存，自动维护。 |
| `move_exits` | `string[]` | 可选 | 可移动出口列表，供巡逻 NPC 使用。通常设为出口方向子集，如 `['southwest', 'southeast']`。 |

### 4.3 容器属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_item_count` | `number` | `50` | 最大容纳物品/角色数。设为 `1` 表示单人房间（如客栈客房、擂台）。 |
| `items` | `ITEM[]` | `[]` | 房间内的物品和角色数组。运行时包含 CHARACTER 和 OBJ 实例。 |

### 4.4 限制标志

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `no_fight` | `boolean` | 未定义 | `true` 时禁用战斗（安全区）。用于客栈、钱庄、武庙等。 |
| `no_relive` | `boolean` | 未定义 | `true` 时禁止在该房间复活。 |
| `no_shadow` | `boolean` | `false` | `true` 时禁止创建镜像房间（用于人满容纳时的 overflow 房间）。 |
| `no_save` | `boolean` | 未定义 | 非标准属性，某些房间用于标记不保存状态（如擂台）。 |

### 4.5 玩法属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `can_diaoyu` | `boolean` | `false` | `true` 时允许在该房间钓鱼。需配合 `add_action("diao", "钓鱼", handler)` 使用。 |
| `is_heartbeat` | `boolean` | 未定义 | **仅为标记属性**，引擎不读取此值。心跳的实际条件是定义了 `on_heart_beat()` 方法。 |
| `biwu_step` | `number` | 未定义 | 比武擂台用，计时步数。 |

### 4.6 副本/镜像属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `is_copy_room` | `boolean` | `false` | 由引擎在创建副本时自动设为 `true`。手动设置无效。 |
| `is_shadow` | `boolean` | `false` | 由引擎在创建镜像房间时自动设为 `true`。手动设置无效。 |
| `create_time` | `number` | `0` | 房间创建时间戳（Date.now()），副本房间使用。 |
| `copy_rooms` | `Record<string, ROOM> \| null` | `null` | 副本房间映射：`{ownerId: ROOM}`，由 `create_copy()` 管理。 |
| `shadow_rooms` | `ROOM[] \| null` | `null` | 镜像房间列表。 |
| `owner` | `string \| null` | `null` | 副本持有者 ID。 |

### 4.7 层级关系属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `area` | `AREA \| null` | `null` | 所属区域对象。与 `parent` 相同。 |
| `parent` | `AREA \| null` | `null` | 所属区域对象。由 `initBaseRoom()` 自动设置。 |

### 4.8 临时数据

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `temp` | `Record<string, any>` | `{}` | 副本临时数据存储。提供按玩家隔离的 `query_temp()`、`set_temp()`、`add_temp()` 方法（覆写自 ITEM）。 |

### 4.9 其他

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `json` | `string \| null` | `null` | 房间 JSON 缓存（含 name/desc/commands）。 |
| `commands_json` | `string \| null` | `null` | 命令列表 JSON 缓存。 |
| `hidden_items` | `ITEM[] \| null` | `null` | 隐藏物品列表，由 `set_item()` 管理。 |

---

### 4.10 临时数据（temp）操作规范

> **通用 temp 操作约束（禁止直接访问 temp、必须提供默认值、时间单位等）详见 [全局开发约束.md](全局开发约束.md) 第二条。** 以下仅说明 ROOM 的副本入口共享方法。

**重要**：ROOM 的普通 temp 方法继承自 ITEM；需要按队伍定位副本入口共享数据时，应调用 `fb_query_temp`、`fb_set_temp`、`fb_add_temp`。

#### 普通房间（继承自 ITEM，与 USER/CHARACTER/NPC 签名相同）

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取房间自身临时值。**必须提供默认值**。 |
| `set_temp` | `(name: string, value: number\|string, time?: number) => void` | 写入房间自身临时值。`time` 为有效期（**毫秒**）。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加数值，返回累加后的值。 |
| `remove_temp` | `(name: string) => void` | 删除临时值及其过期时间记录。 |

#### 副本入口共享状态（按 AREA owner 定位）

| 方法 | 签名 | 说明 |
|------|------|------|
| `fb_query_temp` | `(name: string, me: USER, def?: unknown) => unknown` | 使用当前克隆 owner 或 `AREA.query_owner(me)` 定位入口克隆后查询。 |
| `fb_set_temp` | `(name: string, value: unknown, me: USER, time?: number) => void` | 在入口克隆设置共享值。 |
| `fb_add_temp` | `(name: string, value: number, me: USER, time?: number) => number \| undefined` | 在入口克隆累加共享值。 |

> **注意**：`fb_*` 使用 `AREA.first` 定位入口克隆。从副本克隆调用时优先沿用当前房间 owner，从基础房间调用时使用 `AREA.query_owner(me)`。默认 AREA owner 是队伍 ID；自定义 owner 的持久副本会自动按其 owner 规则隔离。

```typescript
this.fb_set_temp("boss_killed", true, me, 3600000);
const killed = this.fb_query_temp("boss_killed", me, false);
this.fb_add_temp("kill_count", 1, me);
```

---

## 5. 构造方法

ROOM 的 constructor 中应调用 `super()`，然后可以调用以下方法来配置房间。

### 5.1 `add_action(cmd, name, func)`

添加一个自定义命令按钮，显示在客户端房间界面。

**参数：**
- `cmd: string` — 命令触发器，玩家点击按钮或输入命令时触发。
- `name: string` — 按钮显示名称。传入空字符串 `""` 表示不显示按钮（但仍可响应命令）。
- `func: Function` — 执行函数，接收参数 `(me: CHARACTER, par?: string, ...)`。`me` 是执行者。

**示例：**
```typescript
// 简单按钮
this.add_action("shangxiang", "上香", function(me: USER) {
    me.notify("你虔诚地上了一炷香。");
});

// 隐藏按钮（无名称，响应 say 命令）
this.add_action("say", "", this.action_say);

// 有参数的命令（玩家在命令后输入参数）
this.add_action("roll", "掷骰子", function(me, par) {
    if (par === "start") { /* ... */ }
});
```

**注意：** `add_action` 的 `func` 中的 `this` 指向房间对象（不是执行者）。如果使用箭头函数，`this` 保持为类实例。如果使用普通函数并在函数内需要访问房间，可存引用：`const room = this;` 然后在函数内用 `room`。

**命令前缀匹配：** 客户端发送的命令会尝试匹配已注册的 `cmd`。例如 `add_action("climb tree", ...)` 会匹配玩家发送的 `climb tree` 命令。无匹配时命令按标准流程处理。

### 5.2 `set_npc(...args)`

在房间创建时放置 NPC。每个参数可以是 NPC 路径字符串，或 `[路径, 数量]` 元组。

**参数：** `...(string | [string, number])[]`

**示例：**
```typescript
// 单个 NPC
this.set_npc("pub/xiaoer");

// 多个不同 NPC
this.set_npc("yz/linpingzhi", ["yz/biaotou", 2]);

// 同一 NPC 多个实例
this.set_npc('yz/hy/jiaotu', 'yz/hy/jiaotu');

// NPC 路径约定：server/res/npc/ 下的文件，不加扩展名
// "pub/xiaoer" → server/res/npc/pub/xiaoer.ts
// "yz/linpingzhi" → server/res/npc/yz/linpingzhi.ts
```

### 5.3 `set_obj(...names)`

在房间创建时放置物品。类似 `set_npc` 但放置的是 OBJ（物品）而非 NPC。

**参数：** `...(string | [string, number])[]`

**示例：**
```typescript
this.set_obj(["obj/food/kaoya", 3], "obj/money/silver");
```

**注意：** 当前没有房间文件使用此方法。物品通常通过 NPC 掉落、任务奖励或其他动态机制生成。此方法存在于 ROOM 类中，可用于需要静态场景物品的场景。

### 5.4 `set_item(id, name, desc, commands?)`

创建一个隐藏物品。隐藏物品不出现在房间物品列表中，但必须在房间描述里提供符合语境的可点击线索，玩家不应依靠猜测 ID 或拼音输入 `look <id>`。详见 [隐藏物品系统](#9-隐藏物品系统)。

**参数：**
- `id: string` — 物品 ID，玩家用 `look <id>` 查看。
- `name: string` — 物品显示名称。
- `desc: string` — 物品描述文本。
- `commands?: RoomAction | RoomAction[]` — 可选的交互命令。`RoomAction = [cmd: string, name: string, action: Function]`。

**示例：**
```typescript
// 仅可查看（无交互）
this.set_item("paizi", "牌子", "本店尚有空余客房，每天100两银子。");

// 可交互（点击"爬"按钮执行 climb_tree 函数）
this.set_item("tree", "大榕树", "一棵枝叶茂盛的大榕树，似乎可以爬上去", [[
    "climb", "爬", climb_tree
]]);

// 多个命令
this.set_item("men", "大铁门", "一扇半尺厚的铁门...", [[
    "unlock", "打开", this.open_men
]]);
```

**自动注册命令：** 当提供 `commands` 参数时，`set_item` 会自动为每个命令调用 `add_action(cmd, "", func)`（按钮名设为空字符串，不显示额外按钮）。因此通常不需要再手动调用 `add_action`，除非需要不同的按钮名称。

---

## 6. 回调钩子

回调钩子可以作为类方法直接定义（推荐），或在 constructor 中赋值。

### 6.1 `on_leave(obj, dir)`

**签名：** `on_leave(obj: ITEM, dir: string): boolean | void`

**触发时机：** 对象离开房间前，`do_leave()` 开头。

**用途：** 阻止离开、清理状态、执行离开前逻辑。

**返回 `false` 阻止离开：**
```typescript
on_leave(me: CHARACTER, dir: string) {
    if (dir === "up") {
        return me.notify_fail("你必须先打败守卫才能上去。");
    }
}
```

**清理状态：**
```typescript
on_leave(me: CHARACTER) {
    me.remove_status("room");
}
```

### 6.2 `on_before_enter(obj)`

**签名：** `on_before_enter(obj: ITEM): void`

**触发时机：** 对象进入房间前，`do_enter()` 开头，在发送房间 JSON 给玩家之前。

**用途：** 在玩家看到房间前进行准备工作（设置 NPC、调整房间名、准备战斗等）。

**示例（动态生成 NPC）：**
```typescript
on_before_enter(me: CHARACTER) {
    const level = me.query_temp("wd_level", 0) + 1;
    const name = UTIL.to_c(level);
    this.name = "第" + name + "层";

    const npc = NPC.CLONE("pub/wudao") as NPC;
    npc.init_from(me, level);
    npc.environment = this;
    this.items.length = 0;
    this.items.push(npc);
    this.refresh();
}
```

### 6.3 `on_enter(obj)`

**签名：** `on_enter(obj: ITEM): void`

**触发时机：** 对象进入房间后，已加入 `this.items` 数组。

**用途：** 发送欢迎消息、添加状态效果、触发战斗等。

**示例：**
```typescript
on_enter(me: CHARACTER) {
    if (!me.check_player()) return;
    me.die = challenge_over;
    this.start_time = Date.now();
    // 倒计时后开始战斗
    me.call_interval(function(x) { /* ... */ }, 1000, 10, function() {
        const npc = room.items.find(i => i.check_npc()) as CHARACTER;
        if (npc) npc.do_kill(me);
    });
}
```

### 6.4 `on_heart_beat(dt)`

**签名：** `on_heart_beat?(dt: number): void`

**触发时机：** 每个游戏心跳 tick 结束时（约每秒 1-4 次，取决于服务器配置）。

**要求：** 房间必须位于 `WORLD.RUN_ROOMS` 中。普通区域的基础运行房间默认加入；副本区域的基础运行房间不加入，只有实际克隆出的副本房间加入。只需定义此方法，无需设置 `is_heartbeat` 属性（后者仅为文档标记，引擎不读取）。

**用途：** 周期性逻辑——回血回蓝、超时检测、NPC 行为。

**示例（自动回血回蓝）：**
```typescript
on_heart_beat(dt: number): void {
    for (const item of this.items) {
        if (item.check_character()) {
            item.add_hp(Math.floor(item.max_hp / 10));
            item.add_mp(Math.floor(item.max_mp / 10));
        }
    }
}
```

**示例（超时检测——5分钟擂台超时）：**
```typescript
on_heart_beat(dt: number): void {
    if (this.start_time && dt - this.start_time >= 300000) {
        // 5分钟到，强制结束
        for (const item of this.items) {
            if (item.check_player()) {
                (item as CHARACTER).moveto("yz/leitai/ltx");
            }
        }
        this.items.length = 0;
        this.start_time = 0;
    }
}
```

### 6.5 `on_relive(obj, is_relive_here)`

**签名：** `on_relive?(obj: CHARACTER, is_relive_here: boolean): boolean | void`

**触发时机：** 角色在房间中复活前。

**返回 `false` 阻止复活：**
```typescript
on_relive?(obj: CHARACTER, is_relive_here: boolean): boolean | void {
    if (this.no_relive) return false;
}
```

### 6.6 `on_login(user)`

**签名：** `on_login?: (user: USER) => void`

**触发时机：** 玩家登录游戏后，进入该房间时。

**用途：** 发送登录欢迎信息、恢复状态。

### 6.7 `on_create()`

**签名：** `on_create?: () => void`

**触发时机：** 资源定义生成基础运行房间前，以及每次 `ROOM.CREATE()` 克隆房间时。回调执行时房间尚未完成 `initBaseRoom()` 注册。

**用途：** 初始化每个运行房间都需要的状态。不要在这里重复注册全局事件；房间热更新和副本克隆都会再次调用。

### 6.8 `on_set_difficulty(type)`

**签名：** `on_set_difficulty?: (type: number) => void`

**触发时机：** 副本房间创建副本时调用 `set_difficulty(type)`。

**用途：** 根据难度调整 NPC 强度、掉落等。

### 6.9 `is_time()`

**签名：** `is_time(): boolean`

**说明：** 由资源文件注入的房间方法，用于判断当前是否处于特定活动时间。默认返回 `false`。

**示例：**
```typescript
is_time(): boolean {
    const dt = new Date();
    const hour = dt.getHours();
    return dt.getFullYear() === 2024 && dt.getMonth() === 8
        && dt.getDate() >= 15 && dt.getDate() <= 17
        && hour >= 21 && hour <= 24;
}
```

---

## 7. 运行时方法

以下方法可在房间运行时调用（在 constructor 之外、回调函数中、或其他代码中）。

### 7.1 物品/角色管理

#### `item_changed(obj, isin, changed_msg?, dir?)`

处理物件进出房间的核心方法。通知房间内玩家、维护 `items` 数组。

**参数：**
- `obj: ITEM` — 变更对象
- `isin: boolean` — `true` 表示进入，`false` 表示离开
- `changed_msg?: string` — 广播给房间内玩家的文本消息
- `dir?: string` — 移动方向

```typescript
// 将 NPC 移出房间再移入（触发刷新）
this.item_changed(npc, false);
this.item_changed(npc, true);
```

#### `find_obj(oid)`

根据对象 ID 查找房间内的物件（包括隐藏物品）。

**参数：** `oid: string`

**返回：** `ITEM | null`

```typescript
const player = this.find_obj(playerId);
```

#### `find_by_path(path)`

根据资源路径查找房间内的物件（仅搜索 `items` 数组，不含隐藏物品）。

**参数：** `path: string`

**返回：** `ITEM | undefined`

```typescript
const npc = this.find_by_path("pub/wudao") as NPC | undefined;
```

#### `is_here(path)`

判断房间是否包含指定路径的物件。

**参数：** `path: string`

**返回：** `boolean | undefined`

#### `find_me()`

查找房间中第一个玩家。

**返回：** `CHARACTER | undefined`

```typescript
const firstPlayer = this.find_me();
```

### 7.2 消息发送

#### `notify(msg)`

向房间内所有玩家发送文本消息。

**参数：** `msg: string`

```typescript
this.notify("一阵阴风吹过，你不禁打了个寒颤。");
```

#### `send(msg)`

向房间内所有玩家发送 JSON 消息。

**参数：** `msg: string`

```typescript
this.send('{"type":"effect","name":"explosion"}');
```

### 7.3 出口操作

#### `query_exits(dir)`

查询指定方向是否存在出口。

**参数：** `dir: string`

**返回：** `boolean`

```typescript
if (this.query_exits("east")) {
    // 东边有路
}
```

#### `add_exit(dir, rm)`

动态添加出口。

**参数：**
- `dir: string` — 方向
- `rm: string` — 目标房间路径

```typescript
this.add_exit("east", "yz/mishi");
```

#### `remove_exit(dir)`

动态移除出口。

```typescript
this.remove_exit("secret");
```

#### `exits_changed()`

通知房间内所有玩家出口已变更（刷新客户端出口显示）。

```typescript
this.exits_changed();
```

#### `send_exits(player)`

向指定玩家发送出口信息。

```typescript
this.send_exits(somePlayer);
```

### 7.4 JSON 生成

#### `to_json()`

生成房间完整 JSON（含 name、desc、commands），发送给客户端渲染。

**返回：** `string`

#### `items_to_json()`

生成房间内所有非隐藏物件的 JSON 列表。

**返回：** `string`

#### `item_json(item, isin)`

生成单个物件进出房间的 JSON 消息。

**返回：** `string`

#### `query_commands()`

生成命令列表 JSON。

**返回：** `string`

#### `exitsto_roomjson()`

生成出口信息的 JSON。

**返回：** `string`

### 7.5 缓存刷新

#### `refresh(obj?)`

刷新房间的 JSON 缓存（`json`、`commands_json`、`room_exits_json` 置空）。如果有玩家在房间中，传入 `obj` 参数（任意真值）会重新发送更新后的房间数据给所有玩家。

```typescript
// 修改房间名或描述后刷新缓存
this.name = "新名称";
this.refresh(true); // 通知房间内玩家刷新
```

### 7.6 副本相关

#### `is_copy()`

判断该房间是否属于副本区域。

**返回：** `boolean`

#### `is_fb()`

判断该房间是否属于会消失的副本（即 `is_copy && !not_fb`）。

**返回：** `boolean`

#### `is_enter()`

判断该房间是否是所属区域的入口房间（`area.first == this.path`）。

**返回：** `boolean`

#### `query_copy(id)`

根据所有者 ID 查询该房间对应的副本房间。

**参数：** `id: string`

**返回：** `ROOM | undefined`

#### `query_copy2(user)`

根据玩家查询对应的副本房间（通过 `area.query_owner(user)` 获取 ID）。

**参数：** `user: CHARACTER`

**返回：** `ROOM | undefined`

#### `create_copy(id, diff_type)`

为指定 ID 创建该区域的所有副本房间。

**参数：**
- `id: string` — 副本所有者 ID
- `diff_type: number` — 难度

**返回：** `ROOM | undefined`

#### `create_copy2(me, diff_type?)`

为玩家创建副本（自动从 area 获取 owner ID）。

**返回：** `ROOM | undefined`

#### `clear_copy(me)`

清除该副本区域（指定玩家的副本实例）。

**参数：** `me: CHARACTER`

#### `query_fb_first(id)`

查询副本入口房间。

**返回：** `ROOM | undefined`

#### `set_difficulty(type)`

设置副本难度。触发 `on_set_difficulty` 回调。

#### `fb_query_temp(name, me, def?)`

按 `me.query_teamid()` 查询副本入口克隆上的共享临时数据。

#### `fb_set_temp(name, value, me, time?)`

在副本入口克隆上设置共享临时数据。`time` 为可选有效期（毫秒）。

#### `fb_add_temp(name, value, me, time?)`

在副本入口克隆上累加共享临时数据。

### 7.7 其他

#### `query_recover_room()`

查询复活房间路径（沿 area 链向上查找 `recover_room`）。

**返回：** `string`，默认 `"yz/wumiao"`。

#### `get_path()`

获取房间完整路径。

**返回：** `string`

#### `destroy()`

销毁房间（清空物品和所有者）。

---

## 8. 出口系统与方向约定

### 8.1 支持的出口方向

| 方向键 | 含义 |
|--------|------|
| `east` | 东 |
| `west` | 西 |
| `south` | 南 |
| `north` | 北 |
| `northeast` | 东北 |
| `northwest` | 西北 |
| `southeast` | 东南 |
| `southwest` | 西南 |
| `up` | 上 |
| `down` | 下 |
| `enter` | 进入 |
| `out` | 出 |

### 8.2 出口定义格式

```typescript
exits = {
    "east": "yz/beidajie2",
    "west": "yz/wumiao",
    "south": "yz/beidajie1",
    "north": "yz/beimen"
};
```

出口的值是**目标房间的路径**（不含 `server/res/map/` 前缀和 `.ts` 扩展名）。服务器在运行时通过 `WORLD.getRoom(path)` 查找目标房间，并获取其 `name` 显示在客户端。

### 8.3 多出口与双向出口

房间出口是**单向**的。如果 `roomA` 的 east 指向 `roomB`，但 `roomB` 没有 west 指向 `roomA`，则玩家无法从 roomB 直接走回 roomA。通常需要手动保证双向连通：

```typescript
// roomA: yz/beidajie1.ts
exits = { "north": "yz/beidajie2" };

// roomB: yz/beidajie2.ts
exits = { "south": "yz/beidajie1" };
```

### 8.4 动态出口

使用 `add_exit()` 和 `remove_exit()` 在运行时增加或移除出口：

```typescript
// 打开密室
this.add_exit("east", "yz/mishi");
this.exits_changed(); // 通知所有玩家

// 关闭出口
this.remove_exit("east");
```

### 8.5 出口可用性检查

`query_exits(dir)` 只检查出口是否存在，不检查目标房间是否存在或可到达。

### 8.6 `move_exits` 与巡逻 NPC

`move_exits` 属性定义了一组出口方向，供巡逻 NPC 用于随机移动：

```typescript
// 校场，NPC 可以在西北和东北之间巡逻
move_exits = ['northwest', 'northeast'];
```

---

## 9. 隐藏物品系统

隐藏物品（hidden items）是不直接出现在房间物品列表中的场景细节，玩家通过房间描述里的可点击线索查看。底层仍使用 `look <id>` 命令，它们存放在 `this.hidden_items` 数组中。

### 9.1 创建隐藏物品

使用 `set_item()` 方法：

```typescript
// 最简单的形式：仅查看
this.set_item("paizi", "牌子", "本店尚有空余客房，每天100两银子。");

// 带交互命令
this.set_item("tree", "大榕树", "一棵枝叶茂盛的大榕树，看来似乎可以爬上去", [[
    "climb", "爬", climb_tree
]]);

// 多个命令
this.set_item("bag", "布袋", "一个破旧的布袋", [
    ["open", "打开", openBag],
    ["search", "搜索", searchBag]
]);
```

### 9.2 在描述中引导玩家

在 `desc` 中使用 `<cmd>` 标签创建可点击的链接：

```typescript
desc = `墙上挂着一个<cmd cmd='look paizi'>牌子(paizi)</cmd>。`;
desc = `中央有一棵<cmd cmd='look tree'>大榕树(tree)</cmd>，盘根错节。`;
```

**必须遵守：**
- 每个需要玩家主动查看的隐藏物品，都必须在当前房间 `desc` 中提供至少一个可点击入口。
- 链接文字应自然藏在房间描写中，可以是物品名称、局部特征或含蓄线索，不应把隐藏物品作为独立列表直接罗列。
- 玩家应能通过点击中文描述发现内容，不能把猜测拼音、内部 ID，或手动输入 `look <id>` 作为唯一发现方式。
- `id` 只用于命令和程序定位；除非玩法确有提示需要，否则链接文字不必显示 `(id)`。

推荐写法：

```typescript
desc = `石壁潮痕间，似乎夹着一缕<cmd cmd='look jinwen'>暗金纹路</cmd>。`;
this.set_item("jinwen", "暗金纹路", "纹路首尾相衔，隐约勾出一枚古篆。石粉下似乎还压着什么。", [[
    "search", "摸索", search_pattern
]]);
```

不推荐只调用 `set_item("jinwen", ...)`，却不给房间描述添加入口。这会迫使玩家猜测 `jinwen` 等内部 ID，无法从场景本身合理发现内容。

### 9.3 隐藏物品的工作原理

1. 玩家在房间中发送 `look paizi`。
2. 引擎查找 `this.find_obj("paizi")`。
3. 在 `items` 中找不到，回退到 `hidden_items` 搜索。
4. 找到后，调用 `on_look_hidden_item()` 生成包含 `desc` 和 `commands` 的 JSON 返回给客户端。
5. 客户端显示物品描述和交互按钮。
6. 玩家点击按钮时，发送 `climb paizi` 命令（`cmd + " " + id`）。
7. 引擎执行对应的 action 函数。

### 9.4 命令自动注册

`set_item()` 在提供 `commands` 参数时，会自动调用 `this.add_action(cmd, "", func)` 注册每个命令。所以如果不需要专门的按钮名称，无需额外调用 `add_action`：

```typescript
// set_item 内部自动注册 add_action("climb", "", climb_tree)
this.set_item("tree", "大榕树", "描述", [["climb", "爬", climb_tree]]);

// 若需要一个不同的客户端按钮名，可额外手动注册
this.add_action("climb tree", "爬树", climb_tree);
// 这会让客户端显示一个额外按钮"爬树"，点击发送 "climb tree"
```

---

## 10. 镜像房间与副本系统

### 10.1 镜像房间（Shadow Rooms）

当房间物品数达到 `max_item_count` 上限时，引擎自动创建镜像房间来容纳更多玩家。

**触发条件：**
- 房间不是副本房间（`is_copy_room` 为 `false`）
- 房间未设置 `no_shadow = true`
- 房间物品数已达上限

**工作方式：**
- `create_shadow()` 方法检查现有镜像中是否有空位。
- 如果没有空位，创建新的镜像房间（`BASE.CREATE(__PATH.MAP, this.path)`）。
- 新创建的镜像的 `is_shadow` 属性会被设为 `true`。
- 镜像房间也加入 `WORLD.RUN_ROOMS`。
- 离开镜像房间时，玩家回到基础房间。

**适用场景：**
- 客栈客房：`max_item_count = 1` 且 `is_shadow = true`，每个玩家获得独立房间。
- 练功房：允许多人同时练功但互不干扰。

```typescript
// 客栈客房 — 每个玩家独立房间
export default class extends ROOM {
    name = "人字号客房";
    exits = {"down": "yz/kedian"};
    max_item_count = 1;
    is_shadow = true;

    on_enter(me) {
        // 给玩家添加练功增益状态
    }
    on_leave(me) {
        me.remove_status("room");
    }
}
```

### 10.2 副本房间（Copy Rooms / Instance System）

副本系统允许同一区域为不同玩家/队伍创建独立的实例。

**关键属性：**
- `is_copy`（在 AREA 上）：标记该区域为副本区域。
- `is_copy_room`（在 ROOM 上）：引擎自动设置，标记为副本房间。
- `not_fb`（在 AREA 上）：`true` 表示该副本不会消失（如门派地图）。
- `copy_rooms`（在 ROOM 上）：`{ownerId: ROOM}` 映射。
- `owner`（在 ROOM 上）：该副本的持有者 ID。

**创建副本流程：**

```typescript
// 在既有副本进入命令中（简化示意）
const area = AREA.Get("some_fb");
const firstRoom = area?.first ? WORLD.getRoom(area.first) : undefined;
const copyRoom = firstRoom?.create_copy2(me, difficulty);
if (copyRoom) me.moveto(copyRoom);
```

这会按 `area.query_owner(me)` 得到的 owner 为区域及子区域的每个房间创建独立克隆。克隆沿用资源 `path`，所以必须把具体 ROOM 对象传给 `moveto()`，不能再用 `copyRoom.path` 查询实例。

**副本临时数据隔离：**
```typescript
this.set_temp("boss_killed", true, 3600000);
const killed = this.query_temp("boss_killed", false);

this.fb_set_temp("boss_killed", true, me, 3600000);
const sharedKilled = this.fb_query_temp("boss_killed", me, false);
```

**清除副本：**
```typescript
area.clear_copy(me);
```

完整的房间原型、克隆隔离、热更新和清理约束见 [副本编写指南.md](副本编写指南.md)。

### 10.3 区域入口房间

`AREA.first` 属性指定了区域的入口房间路径。`is_enter()` 方法判断当前房间是否为入口房间：

```typescript
if (this.is_enter()) {
    // 这是区域的入口
}
```

---

## 11. 事件系统

ROOM 继承自 BASE，所以可以使用 BASE 的事件系统。

### 11.1 `add_event(fname, func, time?)`

临时覆盖一个方法的行为。

**参数：**
- `fname: string` — 要覆盖的方法名
- `func: Function` — 替换函数
- `time?: number` — 有效期（毫秒），不传则永久有效

```typescript
// 临时修改 on_enter 行为
this.add_event("on_enter", function(obj: ITEM) {
    if (obj.check_player()) {
        (obj as USER).notify("欢迎来到特殊活动房间！");
    }
}, 60000); // 60秒后自动恢复
```

### 11.2 `remove_event(name, func)`

移除事件。

### 11.3 `fire_event(name)`

手动触发事件。

### 11.4 延时与间隔

```typescript
// 3秒后执行
this.call_out(this.someMethod, 3000, arg1, arg2);

// 每秒执行一次，共5次
this.call_interval(function(index) {
    console.log("第" + (index + 1) + "次");
    if (index >= 4) return false; // 提前终止
}, 1000, 5, function() {
    console.log("完成");
});
```

---

## 12. 新手教程：逐步编写房间

### 12.1 最简单的房间

创建一个只有名称、描述和出口的房间，没有任何 NPC 和交互。

```typescript
// server/res/map/yz/beidajie1.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "北大街";
    desc = "这是一条宽阔的青石大道，两旁是一家家店铺，人来人往，一片繁华。";
    exits = {
        "east": "yz/kedian",
        "south": "yz/guangchang",
        "west": "yz/qianzhuang",
        "north": "yz/beidajie2"
    };
}
```

**要点：**
- `export default class extends ROOM` — 使用默认导出且不命名类（匿名类），这是标准做法。
- 导出命名类也可以：`export default class BeiDaJie extends ROOM`。
- 不需要 constructor，因为不需要额外初始化。
- 不需要 `super()`，因为 `extends ROOM` 的隐式构造函数会自动调用。

### 12.2 有 NPC 的房间

添加 NPC 需要在 constructor 中调用 `set_npc()`。

```typescript
// server/res/map/yz/datiepu.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "打铁铺";
    desc = "这是一家简陋的打铁铺，中心摆着一个火炉，炉火把四周照得一片通红。";
    exits = {"north": "yz/dongdajie2"};
    no_fight = true;

    constructor() {
        super();
        this.set_npc("pub/tiejiang");
    }
}
```

**要点：**
- 有 constructor 时必须先调用 `super()`。
- `no_fight = true` 让此房间成为安全区。
- NPC 路径 `"pub/tiejiang"` 对应 `server/res/npc/pub/tiejiang.ts`。
- 多个 NPC：`this.set_npc("npc1", ["npc2", 3], "npc3")`。

### 12.3 有隐藏物品的房间

允许玩家查看和交互隐藏物品。

```typescript
// server/res/map/yz/guangchang.ts 简化版
import {ROOM} from "../../../core/room/room.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends ROOM {
    name = "广场";
    desc = `中央有一棵<cmd cmd='look tree'>大榕树(tree)</cmd>，盘根错节。`;
    exits = {
        east: "yz/dongdajie1", west: "yz/xidajie1",
        south: "yz/nandajie1", north: "yz/beidajie1"
    };

    constructor() {
        super();
        this.set_npc("yz/zhubanxian");
        this.set_item("tree", "大榕树", "一棵枝叶茂盛的大榕树，看来似乎可以爬上去", [[
            "climb", "爬", climbTree
        ]]);
    }
}

function climbTree(me: CHARACTER, par?: string): void {
    if (par !== "tree") return me.notify("你要爬什么？");
    me.moveto("yz/tree1", me.name + "爬了上去。", me.name + "从下面爬了上来。");
}
```

### 12.4 有自定义命令按钮的房间

使用 `add_action` 添加按钮。

```typescript
// server/res/map/yz/hanshui.ts
import {ROOM} from "../../../core/room/room.js";
import {WORLD} from "../../../core/world.js";

export default class extends ROOM {
    name = "江边";
    desc = "面前是一条波涛翻滚的大江，浊流滚滚，万舟竞发。";
    exits = {"south": "yz/beimen"};
    no_fight = true;
    can_diaoyu = true;

    constructor() {
        super();
        this.add_action("diao", "钓鱼", function(me: CHARACTER): void {
            WORLD.COMMANDS.get('diaoyu')?.enter(me);
        });
    }
}
```

**要点：**
- `add_action("diao", "钓鱼", handler)` 在客户端显示一个"钓鱼"按钮。
- 点击按钮时，客户端发送 `diao` 命令，服务器执行 handler 函数。
- `can_diaoyu = true` 标记可钓鱼，但钓鱼逻辑通过 `WORLD.COMMANDS.get('diaoyu')` 取得。

### 12.5 有心跳的房间

添加定期执行的逻辑。

```typescript
// server/res/map/yz/wumiao.ts 简化版
import {ROOM} from "../../../core/room/room.js";

export default class WuMiaoRoom extends ROOM {
    name = "武庙";
    desc = "武庙是供奉武圣的地方，殿内庄严肃穆。";
    exits = {"east": "yz/beidajie2"};
    no_fight = true;

    on_heart_beat(dt: number): void {
        for (const item of this.items) {
            if (item.check_character()) {
                item.add_hp(Math.floor(item.max_hp / 10));
                item.add_mp(Math.floor(item.max_mp / 10));
            }
        }
    }
}
```

**要点：**
- `on_heart_beat` 直接作为类方法定义，不需要在 constructor 中设置。
- 不需要设置 `is_heartbeat = true`（该属性仅为文档标记）。
- 普通区域的基础运行房间会接收心跳；副本区域的基础运行房间不接收，实际克隆出的副本房间会接收。
- 不要在心跳中做耗时操作，会影响服务器性能。

### 12.6 完整的复杂房间

结合 NPC、隐藏物品、自定义命令和回调。

```typescript
// server/res/map/yz/duchang.ts 参考（简化）
import {ROOM} from "../../../core/room/room.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends ROOM {
    name = "赌场";
    desc = "赌桌围着黑压压的赌徒，吆喝声此起彼伏。";
    exits = {"east": "yz/nandajie1"};
    no_fight = true;
    master: CHARACTER | null = null;

    constructor() {
        super();
        this.set_npc('pub/baodi');
        this.master = this.items[0] as CHARACTER | null;
        this.set_item("paper", "说明", "小赌怡情，大赌伤身。");
        this.add_action("roll", "掷骰子", this.rollHandler);
        this.add_action("say", "", this.onSay);
    }

    rollHandler(me: CHARACTER, par?: string): void {
        // 骰子游戏逻辑
        me.notify("你掷出了骰子。");
    }

    onSay(me: CHARACTER, par?: string): void {
        // 处理说话命令
    }

    on_leave(me: CHARACTER): void {
        if (me === this.master) {
            this.master = null;
        }
    }
}
```

---

## 13. 完整工作示例

### 示例 1：公共区域街道

```typescript
// server/res/map/yz/xidajie1.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西大街";
    desc = "这是扬州西大街，街道两旁店铺林立，行人如织。路面由青石板铺成，历经风雨已经磨得十分光滑。街道东边通向中央广场，西边是西门方向。";
    exits = {
        "east": "yz/guangchang",
        "west": "yz/xidajie2",
        "north": "yz/datiepu",
        "south": "yz/yaopu"
    };
}
```

### 示例 2：安全区商店

```typescript
// server/res/map/yz/yaopu.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "药铺";
    desc = "一股浓重的药味扑面而来，店内墙壁上挂满了各式各样的草药，柜台上摆着几只青瓷药瓶。";
    exits = {"north": "yz/xidajie1"};
    no_fight = true;

    constructor() {
        super();
        this.set_npc("pub/yaopu");
    }
}
```

### 示例 3：单人副本房间（心跳 + 动态生成）

```typescript
// server/res/map/wudao/ta.ts
import {ROOM} from "../../../core/room/room.js";
import {NPC} from "../../../core/char/npc.js";
import {UTIL} from "../../../core/util/util.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends ROOM {
    name = "武道塔";
    desc = "塔身石迹斑驳，四周都是坚固的石壁。";
    exits = {"up": "wudao/up", "out": "wudao/men"};
    max_item_count = 1;

    /** 进入前动态生成 NPC */
    on_before_enter(me: CHARACTER) {
        const level = (me.query_temp("wd_level", 0) as number) + 1;
        this.name = "第" + UTIL.to_c(level) + "层";

        const npc = NPC.CLONE("pub/wudao") as NPC;
        npc.init_from(me, level);
        npc.environment = this;
        this.items.length = 0;
        this.items.push(npc);
        this.refresh();
    }

    /** 进入后触发战斗 */
    on_enter(me: CHARACTER) {
        const npc = this.items[0] as NPC;
        if (npc && !npc.is_player) {
            me.do_kill(npc);
        }
    }

    /** 阻止向上离开（需击败守卫） */
    on_leave(me: CHARACTER, dir: string): boolean | void {
        if (dir === "up") {
            const npc = this.find_by_path("pub/wudao");
            if (npc) {
                return me.notify_fail("你必须先打败守卫才能上去。");
            }
        }
    }
}
```

### 示例 4：镜像房间（客栈客房）

```typescript
// server/res/map/kezhan/fang1.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "人字号客房";
    desc = "这是客栈里的一间客房，房间不大，还算干净整洁。";
    exits = {"down": "yz/kedian"};
    max_item_count = 1;
    is_shadow = true;

    on_enter(me) {
        if (checkMoveout(me)) {
            me.add_status({
                id: "room",
                duration: 0,
                desc: "在客栈客房中安安静静地练功",
                name: "客房",
                prop: { study_per: 10, lianxi_per: 10, dazuo_per: 10 }
            });
        }
    }

    on_leave(me) {
        me.remove_status("room");
    }

    on_heart_beat(dt: number) {
        for (const item of this.items) {
            if (item.check_character()) {
                return checkMoveout(item);
            }
        }
    }
}

function checkMoveout(me) {
    if (!me.query_temp("kezhan")) {
        me.moveto("yz/kedian", null, me.name + "走了下来。");
        me.send_room("店小二对$N说道：客官，需要付钱才可继续住店。");
        return false;
    }
    return true;
}
```

---

## 14. 常见陷阱与注意事项

### 14.1 `super()` 必须在 constructor 中第一行调用

```typescript
constructor() {
    // ❌ 错误：在 super() 前做了其他操作
    this.name = "我的房间";
    super();

    // ✅ 正确：
    super();
    this.name = "我的房间";
}
```

### 14.2 `add_action` 回调中的 this 指向

在 `add_action` 中传入普通函数时，`this` 默认**不指向房间对象**。要访问房间，需要提前保存引用：

```typescript
// ✅ 方式一：使用箭头函数（推荐）
constructor() {
    super();
    this.add_action("test", "测试", (me: CHARACTER) => {
        this.notify("箭头函数中的 this 指向房间！");
    });
}

// ✅ 方式二：保存 this 引用
constructor() {
    super();
    const room = this;
    this.add_action("test", "测试", function(me: CHARACTER) {
        room.notify("通过 room 变量访问房间！");
    });
}

// ✅ 方式三：使用类方法（推荐）
constructor() {
    super();
    this.add_action("test", "测试", this.handleTest);
}
handleTest(me: CHARACTER) {
    // 方法中的 this 指向房间实例
    this.notify("类方法中的 this 指向房间！");
}
```

### 14.3 出口是单向的

出口是单向边，必须手动确保双向连通：

```typescript
// ❌ 错误：玩家无法从 beidajie2 走回 beidajie1
// beidajie1.ts
exits = {"north": "yz/beidajie2"};
// beidajie2.ts
exits = {"east": "yz/wumiao"};

// ✅ 正确
// beidajie2.ts
exits = {"south": "yz/beidajie1", "east": "yz/wumiao"};
```

### 14.4 desc 中的特殊标签

在 `desc` 中可以用 `<cmd>` 标签创建可点击的链接：

```typescript
// 语法：<cmd cmd='命令'>显示文本</cmd>
desc = `墙上有张<cmd cmd='look paper'>告示(paper)</cmd>。`;
desc = `中央有棵<cmd cmd='look tree'>大榕树(tree)</cmd>。`;
```

如果不使用 `<cmd>` 标签，玩家仍然可以通过输入 `look tree` 来查看隐藏物品——但 `<cmd>` 标签会在描述中生成可点击的链接，提升用户体验。


### 14.6 不要在构造器中做耗时操作

构造器在服务器启动的 Phase 2（CREATE）阶段同步执行，所有房间串行创建。避免在构造器中做：
- 网络请求
- 文件读写
- 大规模循环
- 创建大量 NPC 实例

将复杂初始化放在 `on_create()` 回调中。

### 14.7 NPC 路径引用

`set_npc` 的路径指向 `server/res/npc/` 下的文件，不是 `server/res/map/`。NPC 文件需要单独的 NPC 系统来创建。

### 14.8 修改房间名/描述后需刷新缓存

```typescript
this.name = "新名字";
this.desc = "新描述";
this.refresh(true); // 刷新 JSON 缓存并通知房间内玩家
```

### 14.9 `on_leave` 返回 `false` 阻止离开

```typescript
on_leave(me: CHARACTER, dir: string) {
    if (me.fight_type) {
        return me.notify_fail("战斗中不能离开！");
    }
}
```

`me.notify_fail()` 返回 `false`，所以可以直接 `return me.notify_fail(msg)`。

### 14.10 `set_item` 命令的自动注册

当 `set_item` 带 `commands` 参数时，会自动调用 `add_action(cmd, "", func)`。这意味着：
- 命令的按钮名称被设为空字符串，不会在房间界面显示额外按钮。
- 命令通过 `look <id>` 找到物品后，在物品的命令列表中显示。

如果需要额外按钮，可以额外调用 `add_action` 指定一个非空名称。

### 14.11 文件命名与路径

- 文件使用小写英文字母、数字和下划线。
- 不要使用空格或中文文件名。
- 路径不包含文件扩展名（`.ts` 在编译后变为 `.js`，服务器通过 `BASE.CREATE` 查找）。
- 子目录创建新目录时，确保对应的 AREA 文件中的地图数据也已更新。

### 14.12 房间文件热更新

服务器支持运行时热更新房间文件（不重启服务器）。更新后，现有玩家会被迁移到新房间对象，保持其状态。`update()` 方法处理此流程。

### 14.13 OBJ 和 CHARACTER 的 `is` 方法

`ITEM.is()` 方法可用于按路径比较对象：

```typescript
if (obj.is("pub/wudao")) { /* 这个对象是武道塔守卫 */ }
if (obj.is("food/yuebing")) { /* 这个对象是月饼 */ }
```

---

## 15. 附录：AREA 区域文件快速参考

每个区域需要一个 AREA 定义文件，位于 `server/res/area/map/`。

```typescript
// server/res/area/map/yz.ts
import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yz";              // 区域 ID
    name = "扬州城";         // 区域名称
    is_area = true;          // 标记为正式区域
    is_public = true;        // 公共区域（所有人可访问）
    first = "yz/guangchang"; // 默认入口房间路径
    room_path = "yz/";       // 房间路径前缀，用于自动关联房间到区域
    map = [                  // 小地图数据
        {n: "中央广场", id: "yz/guangchang", p: [0, 0], exits: ["w2", "e2", "s", "n"]},
        // ...
    ];
    actions = [              // 区域级的命令按钮
        ['goto home', '回家', '回到你的房屋'],
        ['pm list', '拍卖', '查看拍卖列表'],
    ];
}
```

**关键：** `room_path` 属性必须与房间文件的路径前缀匹配，这样 `getAreaByPath()` 才能正确将房间分配到此区域。例如 `room_path = "yz/"` 会匹配所有路径以 `"yz/"` 开头的房间。

---

> **版本：** 2024-06-20
> **引擎版本：** Open WSMUD2 TypeScript
> **核心文件：** `server/core/room/room.ts`（ROOM 类）、`server/core/room/area.ts`（AREA 类）、`server/core/item.ts`（ITEM 基类）、`server/core/base.ts`（BASE 根类）
