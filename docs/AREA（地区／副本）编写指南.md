# AREA（地区／副本）编写指南

> 本文档面向 MUD 服务端开发人员，完整说明 AREA（区域）系统的结构与编写方法。
> 阅读本文档后，应能从零开始编写一个功能完整的区域，包括门派公共区域和副本(秘境/禁地)。

---

## 目录

1. [概述与文件结构](#1-概述与文件结构)
2. [AREA 基类属性速查](#2-area-基类属性速查)
3. [FAMILY_AREA 门派区域](#3-family_area-门派区域)
4. [房间文件 (ROOM) 编写](#4-房间文件-room-编写)
5. [地图坐标系统](#5-地图坐标系统)
6. [文件注册与显示排序](#6-文件注册与显示排序)
7. [副本（Instance/Dungeon）系统](#7-副本instancedungeon系统)
8. [掉落系统](#8-掉落系统)
9. [生命周期与回调钩子](#9-生命周期与回调钩子)
10. [完整示例：创建门派公共区域](#10-完整示例创建门派公共区域)
11. [完整示例：创建副本区域](#11-完整示例创建副本区域)
12. [完整示例：创建禁地区域](#12-完整示例创建禁地区域)
13. [区域自定义命令 (actions)](#13-区域自定义命令-actions)
14. [常见问题与调试技巧](#14-常见问题与调试技巧)

---

### 类型标注与 temp 操作

> **类型标注、temp 操作方法等通用约束详见 [全局开发约束.md](全局开发约束.md)。**

AREA 中需特别注意：`map` 标注 `MapEntry[]`、`quick_drops` 标注 `QuickDropEntry[]`；回调方法（`on_enter`、`on_leave` 等）标注参数与返回类型。

---

---

## 1. 概述与文件结构

### 1.1 区域文件位置

所有 AREA 文件位于 `server/res/area/` 下，按用途分为两个子目录：

```
server/res/area/
  ├── map/          # 公共区域和门派区域（在大地图上显示）
  │   ├── yz.ts           # 扬州城（公共区域）
  │   ├── huashan.ts      # 华山派（门派区域）
  │   ├── shaolin.ts      # 少林派
  │   ├── wudang.ts       # 武当派
  │   ├── emei.ts         # 峨眉派
  │   ├── xiangyang.ts    # 襄阳城（特殊公共区域）
  │   └── ...
  └── fb1/          # 副本区域（秘境/地下城）
      ├── fb1.ts          # 树林（lv）
      ├── fb2.ts          # 财主家（cuifu）
      ├── fb3.ts          # 流氓巷（lmw）
      └── ...
```

### 1.2 房间文件位置

房间（ROOM）文件位于 `server/res/map/` 下，路径与 AREA 的 `room_path` 对应：

```
server/res/map/
  ├── huashan/       ← 对应 AREA.room_path = "huashan/"
  │   ├── lianwu.ts
  │   ├── zhenyue.ts
  │   └── ...
  ├── yz/            ← 对应 AREA.room_path = "yz/"
  │   ├── guangchang.ts
  │   ├── lw/        ← 子目录对应子区域 room_path
  │   │   ├── shangu.ts
  │   │   └── ...
  │   └── ...
  └── ...
```

### 1.3 类继承关系

```
BASE
 └── AREA                     (server/core/room/area.ts)
      ├── FAMILY_AREA          (server/core/room/fam_area.ts)
      └── (直接使用 AREA 的副本区域)

ROOM extends ITEM extends BASE (server/core/room/room.ts)
```

### 1.4 加载流程

1. 服务器启动时，`WORLD.init()` 遍历 `__PATH.AREA` 目录（即 `server/res/area/`）
2. 通过 `BASE.PRELOAD()` 异步预加载所有 .ts 文件
3. 第二阶段通过 `BASE.CREATE()` 同步实例化，触发每个文件 default 导出的类的构造函数
4. 构造函数执行类字段声明，然后调用 `create()` 方法（AREA 的 create 将自身 push 到 `WORLD.AREAS[]`）
5. 房间文件同理，在 `initBaseRoom()` 中通过 `getAreaByPath()` 根据路径前缀自动关联到父区域

---

## 2. AREA 基类属性速查

以下属性定义在 `AREA` 类中（`server/core/room/area.ts`），所有区域文件可直接在类体中赋值。

### 2.1 核心标识属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `id` | `string` | `""` | **必填**。区域唯一标识，如 `"huashan"`、`"lw"`。用于 `AREA.Get(id)` 查找 |
| `name` | `string` | `""` | **必填**。区域显示名称，如 `"华山派"`、`"树林"` |
| `desc` | `string` | `""` | 区域描述文本，显示在详情面板中 |
| `is_area` | `boolean` | `false` | 是否为大地图可见区域。**门派/公共区域必须设为 `true`** |
| `is_show` | `boolean` | `true` | 是否在小地图上显示 |
| `path` | `string?` | - | 资源路径，由加载系统自动设置，无需手动赋值 |

### 2.2 房间管理属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `room_path` | `string?` | - | **必填**。房间路径前缀，用于自动关联房间。如 `"huashan/"`。引擎通过 `getAreaByPath()` 匹配此前缀 |
| `first` | `string?` | - | **必填**。入口房间路径，如 `"huashan/zhenyue"`。用户点击进入区域时传送到此房间 |
| `map` | `MapEntry[]` | `[]` | 小地图数据数组。每个条目描述一个房间的坐标和出口 |
| `rooms` | `ROOM[]` | `[]` | 运行时自动填充的属于本区域的房间实例列表。无需手动设置 |
| `areas` | `AREA[]?` | - | 子区域列表（由 `extends` 机制设置，目前较少使用） |

#### MapEntry 结构

```typescript
interface MapEntry {
    n: string;                    // 小地图显示的房间名称
    id: string;                   // 房间路径（必须与 room_path + 文件名一致）
    p: [number, number];          // 坐标 [x, y]（见第5节坐标系统）
    exits?: string[];             // 可选。小地图上显示的出口方向箭头列表
}
```

### 2.3 副本（Instance）属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `is_copy` | `boolean` | `false` | **副本必须设为 `true`**。表示支持副本实例化，每次进入创建一份独立副本 |
| `is_multi` | `boolean` | `false` | 是否支持多人组队副本。设为 `true` 时显示"组队"难度选项 |
| `not_fb` | `boolean` | `false` | 是否为非一次性副本（持久副本）。设为 `true` 时副本房间不会随时间消失（如住房、帮会） |
| `expend` | `number` | `10` | 进入副本消耗的精力值 |
| `index` | `number` | `0` | 副本序号/层级。用于排序和难度标识（0-based） |
| `exp` | `number` | `1000` | 副本基础经验奖励 |
| `pot` | `number` | `1000` | 副本基础潜能奖励。若设为 -1 则会自动等于 exp 值 |
| `score` | `number?` | - | 副本满分数值。完成度 = 玩家得分 / score * 100% |
| `fb_index` | `number` | `1` | 副本难度系数，影响 `query_exp()` 返回值。计算公式：`1000 + fb_index * 100` |
| `recover_room` | `string?` | - | 复活房间路径。如果设置，玩家在此区域死亡后会在此房间复活；否则使用 ROOM 默认逻辑回武庙 |

### 2.4 掉落相关属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `drops` | `string[]?` | - | 区域掉落物品路径列表。这是最基本的掉落配置 |
| `drop_npcs0` | `string[]?` | - | 普通模式 NPC 路径列表。引擎会引用这些 NPC 的 `drop_list` 合并到普通掉落池 |
| `drop_npcs1` | `string[]?` | - | 困难模式 NPC 路径列表。用法同上，合并到困难掉落池 |
| `quick_drops` | `QuickDropEntry[]?` | - | **（动态属性）** 扫荡掉落配置。此属性不在 AREA 类中声明但被直接使用 |

#### QuickDropEntry 结构

```typescript
interface QuickDropEntry {
    obj: string | string[];       // 物品路径或物品路径数组
    min?: number;                 // 最少掉落数量（默认1）
    max?: number;                 // 最多掉落数量（默认1）
    odds?: number;                // 掉落概率分母（如 1000 = 1/1000 概率，省略 = 必定掉落）
}
```

### 2.5 门派/公共区域属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `family` | `string?` | - | 所属门派 ID，如 `"HUASHAN"`、`"SHAOLIN"`。需与 `server/core/skill/family.ts` 中定义的家族 ID 一致 |
| `is_public` | `boolean` | `false` | 是否为公共区域（所有人可访问，如扬州城、襄阳城）。设为 `true` 时对非本门弟子也可见 |

### 2.6 其他属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `is_lock` | `boolean?` | - | 是否锁定/暂未开放。设为 `true` 时玩家无法进入 |
| `is_diffi` | `boolean?` | - | 是否有困难模式。设为 `true` 时显示"困难"难度选项 |
| `ss_title` | `string?` | - | 首通称号。玩家首次 100% 完成此副本时获得的称号名称 |
| `count_key` | `string?` | - | 自定义完成次数计数的键名。默认为 `"fbc_0_{fb_index}"` |
| `start_room` | `string?` | - | 起始房间路径。限制玩家必须在此房间才能启动副本 |
| `no_cache` | `boolean?` | - | 禁用缓存。设为 `true` 时每次请求都会重新生成 JSON |
| `no_team` | `boolean?` | - | 禁止组队 |
| `jd_index` | `number?` | - | 进阶难度索引（禁地区域）。`>=0` 时表示这是一个禁地区域 |
| `unlock_index` | `number?` | - | 解锁所需前一个副本的索引。例如设为 3 表示需要完成 index=3 的副本才能解锁 |
| `sp` | `string \| Record<string, any>?` | - | 特殊数据。门派区域常用字符串描述门派特点；也可用于 dialog JSON 数据 |
| `skills` | `SKILL[]?` | - | 门派武功列表。运行时从 FAMILY 复制，无需手动设置 |
| `skills2` | `SKILL[]?` | - | 门派进阶武功列表 |
| `skills4` | `SKILL[]?` | - | 门派终极武功列表 |
| `actions` | `(string\|number)[][]` | `[]` | 区域级命令按钮 |

---

## 3. FAMILY_AREA 门派区域

`FAMILY_AREA` 继承自 `AREA`，额外提供：

- **`query_actions(me)`**: 自动生成练功、后勤等标准按钮
- **`notify_update()`**: 发送门派区域更新通知

门派区域需要从 `FAMILY_AREA` 而非 `AREA` 继承：

```typescript
import {FAMILY_AREA} from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    // ... 属性赋值
}
```

### 门派区域额外注意事项

1. `family` 属性值必须为大写，与 `FAMILIES` 注册表中的 key 一致
2. `is_area` 必须设为 `true`，否则不会出现在门派列表中
3. `index` 值决定了在大地图门派列表中的排序位置（见第6节）
4. 门派区域默认不是公共区域，只有本门弟子可见可进入

---

## 4. 房间文件 (ROOM) 编写

每个房间对应 `server/res/map/` 下的一个 .ts 文件。房间通过 `room_path` 前缀自动关联到所属 AREA。

### 4.1 最小化房间文件

```typescript
// server/res/map/huashan/lianwu.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";                          // 房间名称
    desc = "这里是华山派的练武场...";           // 房间描述文本
    exits = {                                  // 出口映射
        south: "huashan/yunv",                 // {方向: 目标房间路径}
        north: "huashan/keting",
    };
}
```

### 4.2 房间属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 房间名称，显示在客户端 |
| `desc` | `string` | 房间描述，支持 HTML 标签和 `<cmd>` 命令链接 |
| `exits` | `Record<string, string>` | 出口映射。key 为方向名，value 为目标房间路径 |
| `max_item_count` | `number` | 最大容纳物品/角色数（默认 50） |
| `no_fight` | `boolean?` | 是否禁止战斗 |
| `no_relive` | `boolean?` | 是否禁止复活 |
| `can_diaoyu` | `boolean?` | 是否可钓鱼 |
| `biwu_step` | `number?` | 比武擂台计时步数 |

### 4.3 房间回调

| 回调 | 签名 | 说明 |
|------|------|------|
| `on_enter(obj, dir?)` | `(obj: ITEM) => void` | 进入房间后回调 |
| `on_before_enter(obj)` | `(obj: ITEM) => void` | 进入房间前回调 |
| `on_leave(obj, dir)` | `(obj: ITEM, dir: string) => boolean\|void` | 离开房间前回调。返回 `false` 阻止离开 |
| `on_heart_beat(dt)` | `(dt: number) => void` | 房间每帧心跳回调 |
| `on_login(user)` | `(user: USER) => void` | 玩家登录后在此房间时回调 |
| `on_create()` | `() => void` | 房间创建时回调 |
| `on_set_difficulty(type)` | `(type: number) => void` | 副本设置难度时回调。可用于调整 NPC 强度 |

### 4.4 房间可用方法

在 `constructor()` 中可使用以下方法：

```typescript
constructor() {
    super();

    // 设置 NPC（自动克隆到房间）
    this.set_npc("yz/zhubanxian");                         // 单个 NPC
    this.set_npc(["yz/lm/xiaolm", 3]);                     // 3 个 NPC
    this.set_npc("npc1", ["npc2", 2], "npc3");             // 多个 NPC

    // 设置物品
    this.set_obj("obj/path", 5);                           // 5 个物品

    // 设置隐藏物品（需要 look 才能发现，可交互）
    this.set_item("tree", "大榕树", "枝叶茂盛的大榕树", [
        ["climb", "爬", climb_function]
    ]);

    // 添加房间命令按钮
    this.add_action("climb tree", "爬树");
}
```

### 4.5 出口方向命名约定

引擎支持的出口方向命名：

| 方向 | 说明 | 特殊后缀 |
|------|------|----------|
| `north` / `n` | 北 | `1d` = 下（向下走）、`u` = 上 |
| `south` / `s` | 南 | 例：`"n1d"` = 向北向下 |
| `east` / `e` | 东 | 例：`"e1d"` = 向东向下 |
| `west` / `w` | 西 | 例：`"sw"` = 西南 |
| `northup` / `nu` | 北向上 | |
| `southdown` / `sd` | 南向下 | |
| `enter` / `in` | 进入 | |
| `out` / `exit` | 外出 | |

### 4.6 房间描述中的命令链接

房间 `desc` 支持嵌入命令链接：

```typescript
desc = "这里有一棵<cmd cmd='look tree'>大榕树(tree)</cmd>，枝繁叶茂。";
```

---

## 5. 地图坐标系统

### 5.1 坐标系

```
          负 Y（北）
              ↑
              |
   负 X ←—— [0,0] ——→ 正 X（东）
              |
              ↓
          正 Y（南）
```

- `p: [x, y]` 中的 x 为横坐标（正=东，负=西）
- y 为纵坐标（负=北，正=南）
- 坐标值没有单位限制，相邻房间的坐标差通常为 1

### 5.2 MapEntry 详解

```typescript
map = [
    {n: "广场", id: "huashan/guangchang", p: [0, 0], exits: ["n", "s", "e", "w"]},
    //  ↑ 地图上显示的名字  ↑ 房间路径  ↑ 坐标   ↑ 小地图上显示的出口箭头
];
```

- `n`: 小地图上显示的房间名（可以重复，如多个"密林"）
- `id`: 房间路径，必须与 `room_path + 文件名（不含扩展名）` 一致
- `p`: 坐标数组 `[x, y]`
- `exits`（可选）: 出口方向数组。**只影响小地图上的箭头显示，不影响实际移动**。实际移动靠 ROOM 文件中的 `exits` 映射

### 5.3 坐标设计指导

- 门派区域：通常以广场或大殿为 `[0, 0]`，向四周辐射
- 线性副本：沿一个方向排列，如 `[0,0]` → `[-1,0]` → `[-2,0]`
- 非连通房间：在地图上可以分开显示，即使实际没有出口连接
- `exits` 数组值应与 ROOM 文件中的 `exits` key 对应，否则箭头显示与实际情况可能不符

---

## 6. 文件注册与显示排序

### 6.1 注册表配置文件

区域在客户端的显示顺序和分类由 `server/res/cmd/dialog/jh.ts` 中的三个常量控制：

```typescript
// 门派/公共区域索引表 —— 在"门派"标签页显示
const AREAS: Record<string, number> = {
    yz: 0, wudang: 1, shaolin: 2, huashan: 3, emei: 4,
    xiaoyao: 5, gaibang: 6, shashou: 7, xiangyang: 8, wudao: 9
};

// 副本索引表 —— 在"副本"标签页显示
const FBS: Record<string, number | AREA> = {
    "lw": 0, "cuifu": 1, "lmw": 2, "lcy": 3,
    "by": 4, "zhuang": 5, "ao": 6, "tdh": 7
};

// 禁地索引表 —— 在"禁地"标签页显示
const JDS: Record<string, number> = {
    heiying: 0,
};
```

### 6.2 添加新区域的步骤

**新增门派/公共区域：**

1. 在 `map/` 下创建区域文件
2. 文件继承 `FAMILY_AREA`（门派区域）或 `AREA`（公共区域），设置 `is_area = true`
3. 在 `AREAS` 注册表中添加一条 `"区域id": 序号`
4. 序号决定了在客户端列表中的排序位置

**新增副本区域：**

1. 在 `fb1/` 下创建区域文件
2. 文件继承 `AREA`，设置 `is_copy = true`
3. 在 `FBS` 注册表中添加一条 `"区域id": 序号`
4. 序号决定了副本解锁顺序和 `fb_index` 值

**新增禁地区域：**

1. 在 `map/` 或 `fb1/` 下创建区域文件
2. 设置 `jd_index` 属性（>= 0），或通过 `JDS` 注册表自动分配
3. 在 `JDS` 注册表中添加一条

### 6.3 判断逻辑总结

`getAllMaps()` 遍历 `WORLD.AREAS` 时：

1. 如果在 `AREAS` 表中存在 → 归类为门派/公共区域
2. 否则如果在 `FBS` 表中存在 → 归类为副本
3. 否则如果在 `JDS` 表中存在 → 归类为禁地

---

## 7. 副本（Instance/Dungeon）系统

### 7.1 副本工作原理

1. 玩家从客户端点击"进入副本"
2. 引擎调用 `cr` 命令（`server/res/cmd/action/cr.ts`）
3. 检查 `is_unlock()`、精力值、队伍状态等前置条件
4. 从基础房间调用 `create_copy2(me, diffType)`，按 `AREA.query_owner(me)` 为玩家/队伍创建一组独立的副本房间
5. 每份副本房间由 `copy_rooms` 映射管理（`ownerId → ROOM`）
6. 副本房间在 `is_copy_room = true` 且房间名附加"(副本区域)"标记
7. 玩家通过 `cr`（完成副本）命令结算奖励并清理副本

### 7.2 副本关键配置

```typescript
export default class extends AREA {
    id = "mydungeon";
    name = "我的副本";
    desc = "副本描述";
    first = "mydungeon/entry";       // 入口房间路径
    is_copy = true;                   // 启用副本机制
    expend = 10;                      // 每次进入消耗10精力
    exp = 2000;                       // 基础经验
    pot = 2000;                       // 基础潜能
    score = 100;                      // 满分为100
    index = 3;                        // 副本层级（影响解锁顺序）
    fb_index = 4;                     // 难度系数（影响经验倍数）
    is_multi = true;                  // 支持组队
    is_diffi = true;                  // 有困难模式
    ss_title = "首通称号";            // 首次100%完成获得的称号
    room_path = "mydungeon/";         // 房间路径前缀
}
```

### 7.3 难度模式

副本有三种难度模式：

| 难度 | 标识 | 触发条件 | 说明 |
|------|------|----------|------|
| 普通 | `diff = 0` | 单人进入 | 基础难度 |
| 困难 | `diff = 1` | 单人进入，需 `is_diffi = true` | 更高奖励 |
| 组队 | `diff = 2` | 组队进入，需 `is_multi = true` | 多人协作 |

### 7.4 解锁机制

- **顺序解锁**（默认）：玩家完成 index=n 的副本后自动解锁 index=n+1
- **指定解锁**：设置 `unlock_index` 属性，指定需要先完成的副本 index
- **禁地解锁**：设置 `jd_index`，通过 `user.isenable_area()` 和 `query_bool('fb2', jd_index)` 检查

### 7.5 非一次性副本（持久副本）

某些副本需要持久存在（如玩家住房、帮会驻地），设置 `not_fb = true`：

```typescript
export default class extends AREA {
    id = "home";
    name = "住房";
    is_copy = true;
    not_fb = true;          // 持久副本，不会随完成而销毁
    room_path = "home/";
    map = [
        {n: "卧室", id: "home/danjian", p: [0, 0]},
        {n: "院子", id: "home/yuanzi", p: [0, 1]},
    ];

    // 自定义所有者查询
    query_owner(me) {
        return me.id;       // 每个玩家拥有独立的住房副本
    }
}
```

持久副本的 `query_owner()` 方法必须被覆写，返回副本所有者的唯一标识。引擎根据此标识创建和查找独立副本实例。

### 7.6 临时数据（temp）操作规范

> **强制约束**：所有临时数据**必须**通过 temp 操作接口（`query_temp` / `set_temp` / `add_temp` / `remove_temp`）进行读写，**禁止**直接访问 `obj.temp["key"]` 或 `obj.temp.key`。临时数据**必须**储存于 `temp` 中。

#### 通用操作接口（ITEM 体系：USER / CHARACTER / NPC / OBJ 等）

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取临时值。**必须提供默认值**，避免 `undefined`。若值已过期则自动返回默认值。 |
| `set_temp` | `(name: string, value: number\|string, time?: number) => void` | 写入临时值。`time` 为有效期（**毫秒**），省略则永久有效。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加数值型临时值，返回累加后的值。 |
| `remove_temp` | `(name: string) => void` | 删除临时值及其过期时间记录。 |

#### 副本入口共享接口（ROOM，需要 `me` 参数定位 owner）

ROOM 的普通 temp 方法继承自 ITEM。需要从任意副本房间访问入口克隆上的共享状态时，应使用 `fb_*` 专用接口；它们通过 `AREA.first` 定位入口克隆，从副本克隆调用时优先沿用当前房间 owner，从基础房间调用时使用 `AREA.query_owner(me)`：

| 方法 | 签名 | 说明 |
|------|------|------|
| `fb_query_temp` | `(name: string, me: USER, def?: unknown) => unknown` | 按 AREA owner 查询入口共享临时数据 |
| `fb_set_temp` | `(name: string, value: unknown, me: USER, time?: number) => void` | 按 AREA owner 设置入口共享临时数据 |
| `fb_add_temp` | `(name: string, value: number, me: USER, time?: number) => number` | 按 AREA owner 累加入口共享临时数据 |

```typescript
// ✅ 正确：通过副本入口房间操作按玩家隔离的 temp
const entryRoom = WORLD.getRoom(area.first);
entryRoom?.fb_set_temp("boss_killed", true, me, 3600000);
const val = entryRoom?.fb_query_temp("boss_killed", me, false);
entryRoom?.fb_add_temp("monster_count", 1, me);

// ✅ 正确：玩家自身的 temp 操作
me.set_temp("xy_bm", 1, 3600000);   // 报名标记，1小时有效
const bm = me.query_temp("xy_bm", 0);  // 查询，默认0

// ❌ 错误：直接访问 temp 对象
me.temp["xy_bm"] = 1;          // 禁止！
const bm = me.temp["xy_bm"];    // 禁止！
```

#### 核心约束

1. **禁止直接访问 `temp` 对象**：`obj.temp["key"]` 或 `obj.temp.key` 是**不允许**的，必须使用上述四个方法。直接访问会绕过过期检查机制，且不符合序列化规范。
2. **`query_temp` 必须提供默认值**：防止 key 不存在时返回 `undefined` 导致 NaN 或运行时错误。例如 `me.query_temp("count", 0)` 而非 `me.query_temp("count")`。
3. **时间单位为毫秒**：`set_temp` / `add_temp` 的 `time` 参数单位是**毫秒**（不是秒）。例如 1 小时 = `3600000`。
4. **过期机制**：当值以 `{v, e}` 格式存储（带过期时间）且 `Date.now() > e` 时，`query_temp` 自动返回默认值并将该键置为 `null`。
5. **`remove_temp` 删除键**：同时删除临时值及其过期时间记录。

---

## 8. 掉落系统

### 8.1 基础掉落（drops）

最简单的掉落配置，列出一系列物品路径：

```typescript
drops = [
    "res/pimao1",
    "eq/lv0/cloth",
    "eq/lv0/dao",
    "book/book#dodge",
];
```

这些物品作为副本结算奖励或在 `query_drops()` 中被引用。

### 8.2 NPC 掉落合并（drop_npcs0 / drop_npcs1）

引用 NPC 模版的 `drop_list`，将其掉落合并到区域掉落池：

```typescript
// 普通模式中加入这些 NPC 的掉落
drop_npcs0 = ["npc/bandit", "npc/wolf"];

// 困难模式中加入这些 NPC 的掉落
drop_npcs1 = ["npc/bandit_elite", "npc/wolf_king"];
```

NPC 的 `drop_list` 在 NPC 定义文件中配置。

### 8.3 扫荡掉落（quick_drops）

专用于"扫荡"功能的掉落配置。扫荡时跳过战斗直接获得奖励：

```typescript
quick_drops = [
    {
        obj: "money/silver",       // 必定掉落1-10银子
        min: 1,
        max: 10
    },
    {
        obj: ["eq/lv0/cloth", "eq/lv0/dao"],  // 必定掉落其中之一
    },
    {
        obj: ["eq/lv2/rare_sword"],            // 稀有掉落
        odds: 1000                              // 1/1000 概率
    },
];
```

**quick_drops 字段说明：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `obj` | `string \| string[]` | 物品路径（或数组）。数组时随机选择其一 |
| `min` | `number?` | 最小掉落数量（默认 1） |
| `max` | `number?` | 最大掉落数量（默认 1） |
| `odds` | `number?` | 概率分母。如 1000 = 1/1000。省略则必定掉落 |

### 8.4 掉落查询方法

| 方法 | 说明 |
|------|------|
| `query_drops(isdiff?)` | 查询掉落列表。`isdiff=true` 返回困难模式列表 |
| `query_diff_drops()` | 查询困难模式掉落 |
| `query_drop_items()` | 查询掉落物品列表 |

---

## 9. 生命周期与回调钩子

### 9.1 区域级回调

| 回调 | 签名 | 触发时机 | 说明 |
|------|------|----------|------|
| `on_login(user)` | `(user: USER) => void` | 玩家登录时位于此区域 | 可用于发送欢迎信息或恢复状态 |
| `on_enterd(me)` | `(me: CHARACTER) => void` | 角色首次进入此区域 | （框架已声明但暂未调用，预留） |
| `on_enter(me)` | `(me: CHARACTER) => boolean\|void` | 角色进入区域前 | 返回 `false` 阻止进入。可用于权限检查 |
| `on_leave(me)` | `(me: CHARACTER) => boolean\|void` | 角色离开区域前 | 返回 `false` 阻止离开 |
| `on_leaved(me)` | `(me: CHARACTER) => void` | 角色离开区域后 | 可用于清理状态 |
| `on_quick(me)` | `(me: CHARACTER) => boolean\|void` | 快速扫荡前 | 返回 `false` 阻止扫荡 |
| `on_quick_over(me)` | `(me: CHARACTER) => void` | 快速扫荡结束后 | 可用于发送额外提示 |
| `render_map(me)` | `(me: USER) => void` | 客户端请求地图渲染时 | 自定义客户端地图展示 |

### 9.2 区域方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `create(path)` | `(path: string) => void` | 创建时调用，注册到 WORLD.AREAS 并关联 FAMILY |
| `query_exp()` | `() => number` | 计算经验奖励 |
| `query_pot()` | `() => number` | 计算潜能奖励 |
| `query_desc()` | `() => string` | 获取区域描述 |
| `is_unlock(me)` | `(me: USER) => boolean` | 检查玩家是否已解锁此区域 |
| `is_record(diff)` | `(diff: number) => boolean` | 检查指定难度是否有通关记录 |
| `query_owner(me)` | `(me) => string` | 获取副本的所有者标识（队伍ID或个人ID） |
| `clear_copy(me)` | `(me: USER) => void` | 清除副本实例 |
| `notify_update()` | `() => void` | 通知客户端刷新区域数据 |
| `query_drops(isdiff?)` | `(isdiff?: boolean) => any[]` | 获取掉落列表 |
| `query_actions(me?)` | `(me?: USER) => (string\|number)[][]` | 获取区域操作按钮列表 |

### 9.3 回调使用示例

```typescript
// 限制进入（如襄阳城限制报名用户才能进入）
on_enter(me: CHARACTER) {
    if (!me.query_temp('xy_bm'))
        return me.notify_fail("需要报名才可进入。");
    return true;  // 或省略 return
}

// 阻止离开（如擂台区域禁止中途离开）
on_leave(me: CHARACTER) {
    if (me.is_in('yz/leitai/leitai'))
        return me.notify_fail('结束比武后才可离开擂台。');
    return true;
}

// 进入时自动创建副本入口
on_enter(me: CHARACTER) {
    const next_room = WORLD.getRoom("yz/hy/tongdao");
    if (!next_room) return;
    let copy_room = next_room.query_copy2(me);
    if (!copy_room) {
        copy_room = next_room.create_copy2(me);
    }
}

// 离开时清理副本
on_leave(me: CHARACTER) {
    this.clear_copy(me);
}
```

---

## 10. 完整示例：创建门派公共区域

以下演示创建一个完整的门派区域"昆仑派"。

### 步骤 1：编写区域文件

```typescript
// server/res/area/map/kunlun.ts
import {FAMILY_AREA} from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    id = "kunlun";
    name = "昆仑派";
    desc = "昆仑派远在西域，门派武功自成一派，以剑法轻功见长。门下弟子常年于雪山练武，体质极佳。";
    sp = "剑法精湛，轻功卓绝，气血充盈";
    first = "kunlun/guangchang";
    is_area = true;
    index = 10;               // 在门派列表中的排序位置
    room_path = "kunlun/";
    family = "KUNLUN";        // 需在 family.ts 中注册 "KUNLUN"
    map = [
        {n: "广场", id: "kunlun/guangchang", p: [0, 0], exits: ["n", "s", "e", "w"]},
        {n: "大殿", id: "kunlun/dadian", p: [0, -1], exits: ["s"]},
        {n: "练武场", id: "kunlun/lianwu", p: [1, 0], exits: ["w"]},
        {n: "兵器房", id: "kunlun/bingqi", p: [2, 0]},
        {n: "客房", id: "kunlun/kefang", p: [-1, 0]},
        {n: "后院", id: "kunlun/houyuan", p: [0, 1], exits: ["w", "n"]},
        {n: "厨房", id: "kunlun/chufang", p: [-1, 1]},
        {n: "雪径", id: "kunlun/xuejing", p: [0, 2], exits: ["n", "s"]},
        {n: "思过洞", id: "kunlun/siguo", p: [0, 3]},
    ];
}
```

### 步骤 2：编写房间文件

```typescript
// server/res/map/kunlun/guangchang.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "广场";
    desc = "这里是昆仑派的广场，地面铺着青石板，常年被积雪覆盖。";
    exits = {
        north: "kunlun/dadian",
        south: "kunlun/houyuan",
        east: "kunlun/lianwu",
        west: "kunlun/kefang",
    };
}
```

```typescript
// server/res/map/kunlun/dadian.ts
import {ROOM} from "../../../core/room/room.js";

export default class extends ROOM {
    name = "大殿";
    desc = "昆仑派大殿庄严肃穆，正中悬挂着「巍巍昆仑」的匾额。";
    exits = {south: "kunlun/guangchang"};

    constructor() {
        super();
        this.set_npc("kunlun/zhangmen");  // 放置掌门 NPC
    }
}
```

（其他房间文件按相同模式创建，确保 `exits` 中的路径都正确指向已有文件。）

### 步骤 3：注册区域

在 `server/res/cmd/dialog/jh.ts` 的 `AREAS` 常量中添加：

```typescript
const AREAS: Record<string, number> = {
    // ... 已有门派 ...
    kunlun: 10,  // 新增
};
```

### 步骤 4：注册门派

在 `server/core/skill/family.ts` 中添加家族定义（简要说明，完整门派配置不在本文档范围）：

```typescript
// 在 FAMILIES 中添加
FAMILIES["KUNLUN"] = new FAMILY({
    id: "KUNLUN",
    name: "昆仑派",
    // ... 其他家族属性
});
```

---

## 11. 完整示例：创建副本区域

以下演示创建一个完整副本"古墓秘境"。

### 步骤 1：编写副本区域文件

```typescript
// server/res/area/fb1/fb_gumu.ts
import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "gumu";
    name = "古墓秘境";
    desc = "终南山下的一处古墓遗迹，据说曾是某位前辈高人的隐居之所，其中机关重重，但也埋藏着不少武林秘籍。";
    score = 150;
    first = "gumu/rukou";
    is_show = true;
    is_copy = true;
    is_multi = true;
    is_diffi = true;
    expend = 15;
    index = 8;                  // 副本层级
    exp = 8000;
    pot = 6000;
    room_path = "gumu/";
    ss_title = "古墓传人";
    recover_room = "gumu/rukou";  // 死亡后在此房间复活
    map = [
        {n: "入口", id: "gumu/rukou", p: [0, 0], exits: ["e"]},
        {n: "甬道", id: "gumu/yongdao", p: [1, 0], exits: ["w", "e"]},
        {n: "墓道", id: "gumu/mudao", p: [2, 0], exits: ["w", "n", "s"]},
        {n: "左耳室", id: "gumu/zuoershi", p: [2, -1]},
        {n: "右耳室", id: "gumu/youershi", p: [2, 1]},
        {n: "主墓室", id: "gumu/zhumu", p: [3, 0], exits: ["w", "e"]},
        {n: "密室", id: "gumu/mishi", p: [4, 0]},
    ];
    drops = [
        "book/bc#gumujianfa",
        "book/bc#gumuxinfa",
        "eq/lv3/gumu_jian",
        "eq/lv3/gumu_yi",
        "money/gold",
    ];
    quick_drops = [
        {obj: "money/silver", min: 5, max: 20},
        {obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"]},
        {obj: ["book/bc#gumujianfa", "book/bc#gumuxinfa"], odds: 500},
        {obj: ["eq/lv3/gumu_jian", "eq/lv3/gumu_yi"], odds: 200},
    ];
}
```

### 步骤 2：编写房间文件

```typescript
// server/res/map/gumu/rukou.ts
import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "入口";
    desc = "古墓的入口处，光线昏暗，前方是一条长长的甬道。";
    exits = {east: "gumu/yongdao"};

    constructor() {
        super();
        this.set_npc(["gumu/shouwei", 2]);  // 入口守卫
    }
}
```

```typescript
// server/res/map/gumu/zhumu.ts
import {ROOM} from "../../../../core/room/room.js";
import type {CHARACTER} from "../../../../core/char/character.js";

export default class extends ROOM {
    name = "主墓室";
    desc = "古墓的主墓室，中央摆放着一具石棺。";
    exits = {west: "gumu/mudao", east: "gumu/mishi"};

    constructor() {
        super();
        this.set_npc("gumu/boss");  // BOSS NPC
    }

    // 击败 BOSS 后标记副本完成（示例）
    on_boss_defeated(me: CHARACTER): void {
        this.fb_set_temp("boss_killed", true, me);
    }
}
```

### 步骤 3：注册副本

在 `server/res/cmd/dialog/jh.ts` 的 `FBS` 常量中添加：

```typescript
const FBS: Record<string, number | AREA> = {
    // ... 已有副本 ...
    "gumu": 8,  // 新增
};
```

---

## 12. 完整示例：创建禁地区域

禁地区域（jd_index）是一种特殊的副本，通过 `jd_index` 而非 `FBS` 注册。

```typescript
// server/res/area/map/huanggong.ts
import {AREA} from "../../../core/room/area.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends AREA {
    id = "huanggong";
    name = "皇宫禁地";
    desc = "大内皇宫，戒备森严，高手如云。";
    is_copy = true;
    expend = 20;
    exp = 15000;
    pot = 12000;
    score = 200;
    first = "huanggong/gate";
    room_path = "huanggong/";
    ss_title = "大内高手";

    // 标记为禁地：不需要设置 jd_index 属性（由 JDS 注册表控制）
    // 但必须在 JDS 中注册才能显示在禁地标签页

    map = [
        {n: "宫门", id: "huanggong/gate", p: [0, 0], exits: ["n"]},
        {n: "甬道", id: "huanggong/path", p: [0, 1], exits: ["n", "s"]},
        {n: "太和殿", id: "huanggong/taihe", p: [0, 2]},
    ];
}
```

在 `jh.ts` 的 `JDS` 常量中注册：

```typescript
const JDS: Record<string, number> = {
    heiying: 0,
    huanggong: 1,  // 新增
};
```

禁地区域的解锁由 `user.isenable_area()` 方法控制，需要玩家拥有特定的 `fb2` 进度。

---

## 13. 区域自定义命令 (actions)

### 13.1 actions 属性

`actions` 是区域级的操作按钮列表，显示在客户端区域详情面板中：

```typescript
// 属性声明
actions: (string | number)[][] = [];

// 每个条目格式
[
    "command string",    // [0] 执行的命令或命令前缀
    "按钮名称",          // [1] 按钮显示文字
    "描述文本",          // [2] 按钮描述（支持颜色标签）
]
```

### 13.2 公共区域示例

```typescript
// 扬州城的 actions
actions = [
    ['goto home', '回家', '回到你在扬州城购买的房屋'],
    ['goto kuang', '矿山', '前往矿山挖矿'],
    ['goto bp', '帮派', '回到自己的帮派驻地'],
    ['pm list', '拍卖', '打开拍卖列表'],
];
```

### 13.3 覆写 query_actions 方法

对于需要动态生成按钮的区域（如襄阳城），可以覆写 `query_actions` 方法：

```typescript
query_actions(me: USER) {
    const actions: (string | number)[][] = [];
    const status = WORLD.DATA.query_temp("xy_status", 0) ?? 0;

    if (status === 0) {
        actions.push(["", 1, "目前无战事"]);   // 类型 1 表示纯文本提示
    } else if (status === 1) {
        actions.push(["systask xiangyang bm", "报名", "正在守城"]);
    }
    return actions;
}
```

**特殊按钮类型：**

- 当条目 `[1]` 为 `1`（数字）时，表示这是一个纯文本提示，不产生按钮
- 条目 `[2]` 支持颜色标签：`<red>`、`<hig>`（亮绿）、`<hir>`（亮红）、`<hiy>`（亮黄）、`<hic>`（亮青）、`<hio>`（亮橙）、`<mag>`（品红）等

### 13.4 FAMILY_AREA 默认 actions

门派区域自动包含标准按钮：

```typescript
['goto fam1', '练功', '回到门派师父所在位置学习武功']
['goto fam2', '后勤', '前往门派后勤管理位置']
```

如果门派有 `battle_family`（敌对门派），还会显示"进入战场"按钮。

---

## 14. 常见问题与调试技巧

### 14.1 区域未显示在客户端

- 确认已注册到 `jh.ts` 的 `AREAS`、`FBS` 或 `JDS` 常量
- 确认 `id` 与注册表中的 key 一致
- 确认文件在正确的目录（`map/` 或 `fb1/`）
- 门派区域确认 `is_area = true`
- 副本区域确认 `is_copy = true`
- 检查服务器日志是否有 `create ... error` 信息

### 14.2 房间无法进入（无此路径）

- 确认房间文件存在于 `server/res/map/` 下正确路径
- 确认 AREA 的 `room_path` 与房间文件路径前缀匹配（如 `"gumu/"` 匹配 `server/res/map/gumu/xxx.ts`）
- 确认 `exits` 中的目标路径拼写正确，且目标房间文件存在
- 路径区分大小写

### 14.3 小地图显示异常

- 确认 `map` 数组中的 `id` 与房间文件路径一致
- 确认 `exits` 数组中的方向与 ROOM 文件的 `exits` key 一致
- 坐标 `p` 不要过于离散（间隔过大会使地图变形）

### 14.4 副本无法进入

- 检查 `is_unlock()` 是否返回 `true`
- 检查 `is_lock` 是否为 `undefined`（非 `true`）
- 检查精力是否足够（`expend`）
- 检查队伍状态（单人副本不能有队伍，组队副本必须有队伍）
- 检查 `is_diffi` 设置（尝试困难模式时需要 `true`）
- 检查 `is_multi` 设置（尝试组队模式时需要 `true`）

### 14.5 掉落不生效

- 确认物品路径正确（可使用客户端 `look3` 命令测试）
- 扫荡掉落使用 `quick_drops`，普通掉落使用 `drops`
- NPC 掉落使用 `drop_npcs0`（普通）和 `drop_npcs1`（困难）

### 14.6 热更新

游戏支持运行时热更新区域和房间文件：

```bash
# 在服务器控制台执行
update area path/of/area_file
update map path/of/room_file
```

房间热更新后，现有副本房间不会被替换；新进入的副本会使用新的房间配置。

### 14.7 完整的房间文件模板

```typescript
import {ROOM} from "../../../core/room/room.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends ROOM {
    name = "房间名称";
    desc = "房间描述，可包含<cmd cmd='command'>链接文本</cmd>。";
    exits = {
        north: "area/room_north",
        south: "area/room_south",
    };

    constructor() {
        super();
        this.set_npc("npc/path");          // 放置 NPC
        this.set_npc(["npc/path", 3]);     // 放置3个 NPC
        this.set_obj("item/path", 1);      // 放置物品
    }

    // 进入房间回调
    on_enter(obj: ITEM) {
        // 自定义逻辑
    }

    // 离开房间前回调（返回 false 阻止离开）
    on_leave(obj: ITEM, dir: string) {
        // 自定义逻辑
    }
}
```

### 14.8 完整的副本区域文件模板

```typescript
import {AREA} from "../../../core/room/area.js";
import type {CHARACTER} from "../../../core/char/character.js";

export default class extends AREA {
    // === 标识 ===
    id = "myfb";
    name = "副本名称";
    desc = "副本描述";

    // === 入口与房间 ===
    first = "myfb/entry";
    room_path = "myfb/";
    map = [
        {n: "入口", id: "myfb/entry", p: [0, 0], exits: ["e"]},
        {n: "通道", id: "myfb/path1", p: [1, 0], exits: ["e"]},
        {n: "Boss房", id: "myfb/boss", p: [2, 0]},
    ];

    // === 副本机制 ===
    is_copy = true;
    is_multi = true;       // 支持组队
    is_diffi = true;       // 有困难模式
    expend = 10;
    index = 5;             // 副本层级
    exp = 5000;
    pot = 4000;
    score = 100;
    ss_title = "称号";

    // === 掉落 ===
    drops = ["item/path1", "item/path2"];
    quick_drops = [
        {obj: "money/silver", min: 1, max: 5},
        {obj: ["item/rare1", "item/rare2"], odds: 500},
    ];

    // === 回调（可选） ===
    on_enter(me: CHARACTER) {
        // 进入区域前的检查
        return true;
    }

    on_quick(me: CHARACTER) {
        // 扫荡前的检查，返回 false 阻止扫荡
        return true;
    }
}
```

---

## 附录：属性速查总表

| 属性 | 公共区域 | 门派区域 | 副本 | 持久副本 | 禁地 |
|------|---------|---------|------|---------|------|
| `extends` | `AREA` | `FAMILY_AREA` | `AREA` | `AREA` | `AREA` |
| `is_area` | `true` | `true` | 省略 | 省略 | 省略 |
| `is_copy` | 省略 | 省略 | `true` | `true` | `true` |
| `not_fb` | 省略 | 省略 | 省略 | `true` | 省略 |
| `family` | 省略 | 必填 | 省略 | 省略 | 省略 |
| `is_public` | 可选 | 可选 | 省略 | 省略 | 省略 |
| `is_diffi` | 省略 | 省略 | 可选 | 省略 | 省略 |
| `is_multi` | 省略 | 省略 | 可选 | 省略 | 省略 |
| `jd_index` | 可选 | 可选 | 可选 | 可选 | 必在JDS注册 |
| 注册位置 | `AREAS` | `AREAS` | `FBS` | `FBS` | `JDS` |
| 默认 `query_owner` | - | - | 队伍ID | 需覆写 | 队伍ID |
