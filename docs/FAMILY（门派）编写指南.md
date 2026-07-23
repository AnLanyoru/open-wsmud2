# FAMILY（门派）编写指南

> 本文档面向 **MUD 服务端 TypeScript 开发者**，完整讲解如何编写一个可正常加载、包含 NPC、技能、门派战系统的门派模块。  
> 阅读本文档后，读者应能独立完成一个门派资源文件的全部编写，并理解其与引擎其他子系统（区域 AREA、技能 SKILL、NPC）的联动关系。

---

## 目录

1. [概述](#1-概述)
2. [文件位置与加载机制](#2-文件位置与加载机制)
3. [FAMILY 基类详解](#3-family-基类详解)
4. [编写门派资源文件](#4-编写门派资源文件)
5. [NPC 配置](#5-npc-配置)
6. [技能配置](#6-技能配置)
7. [称谓系统](#7-称谓系统)
8. [称呼回调](#8-称呼回调)
9. [门派战系统](#9-门派战系统)
10. [区域关联](#10-区域关联)
11. [技能与门派的自动关联](#11-技能与门派的自动关联)
12. [完整门派文件示例](#12-完整门派文件示例)
13. [特殊 NPC 说明](#13-特殊-npc-说明)
14. [FAMILIES 全局注册表](#14-families-全局注册表)
15. [调试与热更新](#15-调试与热更新)
16. [常见问题](#16-常见问题)
17. [API 速查表](#17-api-速查表)

---

## 1. 概述

"门派"（FAMILY）是 MUD 中玩家所属势力的核心概念。每个门派管理着：

- 门派技能体系（普通技能、进阶技能、终极技能）
- 驻守 NPC（掌门、弟子、后勤管理员）
- 门派战系统（门派间 PvP）
- 称谓与晋升体系
- 师门任务系统

门派资源文件位于 `server/res/family/` 目录下，每个文件默认导出一个继承自 `FAMILY` 的类。引擎启动时会自动加载该目录下所有 `*.ts` 文件。

---

## 2. 文件位置与加载机制

### 2.1 目录路径

```
server/res/family/          # 门派资源目录
├── shaolin.ts              # 少林派
├── wudang.ts               # 武当派
├── huashan.ts              # 华山派
├── emei.ts                 # 峨眉派
├── gaibang.ts              # 丐帮
├── xiaoyao.ts              # 逍遥派
├── shashou.ts              # 杀手楼
├── liushan.ts              # 六扇门
├── monster.ts              # 怪物（特殊）
├── none.ts                 # 无门无派（特殊）
└── wulang.ts               # 无浪门
```

### 2.2 加载顺序

引擎在启动阶段遍历 `server/res/family/` 目录，依次加载每个 `.ts` 文件。加载顺序**不保证与文件名顺序一致**，因此：

- 不要依赖其他门派在构造阶段的初始化结果
- 可以在运行时通过 `FAMILIES[id]` 访问其他门派

### 2.3 基础导入

每个门派文件必须以以下结构开头：

```typescript
import {FAMILY} from "../../core/skill/family.js";
import type { SkillSet } from "../../core/skill/skill.js";
import type { NPC } from "../../core/char/npc.js";
import type { USER } from "../../core/char/user.js";

export default class extends FAMILY {
    // ... 门派定义
}
```

- `FAMILY` 是基类，必须从 `../../core/skill/family.js` 导入（**注意路径层级**：`res/family/` -> `core/skill/family.ts`）
- `SkillSet` 是技能集合类型，用于 `npc_skills`、`boss_skills` 等字段
- `NPC` 和 `USER` 类型用于回调方法签名

---

### 类型标注与 temp 操作

> **类型标注、temp 操作方法等通用约束详见 [全局开发约束.md](全局开发约束.md)。**

FAMILY 中需特别注意：`def_npcs` 标注 `string[][]`、`npc_skills`/`boss_skills` 标注 `SkillSet`；回调方法（`call`、`call_me`、`on_kill`、`on_battle` 等）标注参数与返回类型。

---

## 3. FAMILY 基类详解

### 3.1 类层次

```
BASE
 └── FAMILY    (server/core/skill/family.ts)
```

`FAMILY` 继承自 `BASE`，因此自动拥有以下能力：

- `this.random(num)` -- 返回 `[0, num)` 范围的随机整数
- `this.call_out(func, delay, ...args)` -- 延迟执行（自动绑定 `this`）
- `this.call_interval(func, delay, count, ...args)` -- 重复执行
- `this.set(pars)` -- 从对象字面量批量赋值
- `this.create_uid()` -- 生成 12 位唯一 ID
- `this.query_temp(name, def?)` / `this.set_temp(name, val, time?)` -- 临时数据管理

### 3.2 核心属性

#### 身份标识

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | `string` | **是** | 门派唯一标识，全大写英文（如 `"SHAOLIN"`、`"WUDANG"`） |
| `name` | `string` | **是** | 门派中文显示名称（如 `"少林派"`、`"武当派"`） |
| `top_name` | `string` | 推荐 | 首席弟子称号（如 `"少林派大师兄"`、`"峨眉大师姐"`） |
| `gender` | `number` | 否 | 门派默认性别：`1`=男性，`2`=女性，不设置则不限制 |
| `top_family` | `string` | 否 | 门派品类标识（如 `"佛门"`、`"道宗"`、`"剑门"`、`"墨门"`），用于客户端分类展示 |

#### NPC 配置

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `def_npcs` | `string[][]` | **是** | NPC 定义数组，每个元素为 `[npc路径, 房间路径]` |
| `boss_path` | `string` | 门派战必需 | 掌门 NPC 的资源路径 |
| `boss_guard` | `string[]` | 门派战必需 | 掌门护卫所在的房间路径列表 |
| `guard_rooms` | `string[]` | 否 | 额外守卫房间列表 |

#### 技能配置

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `npc_skills` | `SkillSet` | **是** | 普通 NPC 的技能配置 |
| `boss_skills` | `SkillSet` | 推荐 | 掌门 NPC 的技能配置（可使用进阶技能） |
| `boss_skills2` | `SkillSet` | 否 | 掌门 NPC 的高难度技能配置 |
| `eqs` | `any[]` | 否 | 门派 NPC 装备列表 |

#### 运行时状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `skills` | `SKILL[]` | 普通技能（由引擎自动填充） |
| `skills2` | `SKILL[]` | 进阶技能（有 source_skill 且非终极，由引擎自动填充） |
| `skills3` | `SKILL[]` | 终极进阶技能（有 source_skill 且 is_ultimate，由引擎自动填充） |
| `skills4` | `SKILL[]` | 终极技能（无 source_skill 且 is_ultimate，由引擎自动填充） |
| `skills0` | `SKILL[]` | 隐藏/知识技能（由引擎自动填充） |
| `boss` | `NPC` | 掌门 NPC 实例（引擎在 `init()` 中自动识别） |
| `first_npc` | `NPC` | 首席弟子 NPC 实例 |
| `area` | `AREA` | 门派区域实例（由引擎从 AREA 的 `family` 字段自动关联） |
| `battle_family` | `string \| null` | 当前交战中的门派 ID |
| `battle_score` | `number` | 门派战当前积分 |
| `battle_gift` | `number` | 门派战胜利加成百分比 |
| `can_battle` | `boolean` | 是否可参与门派战（默认 `false`） |
| `npcs` | `NPC[]` | 门派战期间生成的 NPC |
| `tops` | `Record<string, {name, score}>` | 门派功绩排行榜 |

### 3.3 关键字属性说明

以下属性由引擎自动管理，**不应**在资源文件中赋值：

- **`skills` / `skills2` / `skills3` / `skills4` / `skills0`** -- 由 `SKILL.update()` 遍历全局技能表，找到 `skill.family === this` 的项后自动归类填充
- **`boss`** -- 由 `init()` 方法遍历 `def_npcs`，识别路径匹配 `boss_path` 的第一个 NPC
- **`area`** -- 由 `AREA.create()` 方法根据 AREA 文件中的 `family` 字段自动设置
- **`titles`** -- 通过 `this.set_titles(...)` 在构造函数中设置
- **`npcs`** -- 仅在门派战中创建，平时为空数组

### 3.4 关键方法

#### 构造函数方法

```typescript
set_titles(...args: string[]): void
```

在构造函数中调用，设置门派称谓层级。参数从低到高排列，索引越小职位越高。

示例：`this.set_titles("掌门", "长老", "一代弟子", "二代弟子")`

#### 查询方法

```typescript
query_title(level: number): string                // 按索引查询称谓
query_skill(grade: number): SKILL | undefined     // 随机查询指定品级的技能；该品级无技能时返回 undefined
query_skills(grade: number): SKILL[]              // 查询指定品级的所有技能
add_gongji(me, count: number): void   // 增加门派贡献
send(str: string): void              // 向所有在线门派成员发送消息
send_channel(me, msg: string): void  // 发送门派频道消息
is_battle(fam: FAMILY): boolean      // 是否与指定门派交战
```

#### 生命周期方法（可覆盖）

| 方法 | 触发时机 | 默认行为 |
|------|----------|----------|
| `create(path)` | 门派文件加载时 | 注册到 `FAMILIES[this.id]` |
| `update(path)` | 热更新时 | 重新注册到 `FAMILIES[this.id]` |
| `init()` | 引擎完成资源加载后 | 遍历 `def_npcs` 放置 NPC，识别 boss |

**注意**：不要覆盖 `create`、`update`、`init` 方法，除非你明确了解其作用。如有额外初始化逻辑，在构造函数中完成。

#### 临时数据（temp）操作规范

> **强制约束**：所有临时数据**必须**通过 temp 操作接口（`query_temp` / `set_temp` / `add_temp` / `remove_temp`）进行读写，**禁止**直接访问 `obj.temp["key"]` 或 `obj.temp.key`。临时数据**必须**储存于 `temp` 中。

FAMILY 的 temp 方法借用自 `ITEM.prototype`，因此签名与 ITEM 体系一致：

| 方法 | 签名 | 说明 |
|------|------|------|
| `query_temp` | `<T>(name: string, def?: T) => T` | 读取临时值。**必须提供默认值**。过期自动返回默认值。 |
| `set_temp` | `(name: string, value: any, time?: number) => void` | 写入临时值。`time` 为有效期（**毫秒**），省略则永久有效。 |
| `add_temp` | `(name: string, value: number, time?: number) => number` | 累加数值型临时值，返回累加后的值。 |
| `remove_temp` | `(name: string) => void` | 删除临时值及其过期时间记录。 |

**核心约束：**

1. **禁止直接访问 `temp` 对象**：`fam.temp["battle"]` 或 `fam.temp.battle` 是**不允许**的。门派战中所有临时数据（战斗倒计时、增益标记等）必须通过上述四个方法操作。
2. **`query_temp` 必须提供默认值**：防止 key 不存在时返回 `undefined`。
3. **时间单位为毫秒**：`set_temp` / `add_temp` 的 `time` 参数是**毫秒**。门派战 30 分钟倒计时 = `1800000`。
4. **过期机制**：值以 `{v, e}` 格式存储且 `Date.now() > e` 时，`query_temp` 自动返回默认值。
5. **`remove_temp` 删除键**：同时删除临时值及其过期时间记录。
6. **FAMILY 的 temp 数据持久化**：FAMILY 的 `temp` 和 `tops`（排行榜）会通过 `FAMILY.SAVE()` / `FAMILY.LOAD()` 进行序列化和反序列化，跨服务器重启持久化。

---

## 4. 编写门派资源文件

### 4.1 完整文件结构

```typescript
import {FAMILY} from "../../core/skill/family.js";
import type { SkillSet } from "../../core/skill/skill.js";
import type { NPC } from "../../core/char/npc.js";
import type { USER } from "../../core/char/user.js";

export default class extends FAMILY {
    // ===== 1. 身份标识 =====
    id = "NEWFAM";
    name = "新门派";
    top_name = "新门派首席弟子";
    gender = 1;           // 可选
    top_family = "道宗";  // 可选

    // ===== 2. NPC 配置 =====
    can_battle = true;
    def_npcs = [
        ["newfam/zhangmen", "newfam/dating"],      // 掌门
        ["pub/dadizi#NEWFAM", "newfam/lianwu"],    // 首席弟子（自动匹配门派ID）
        ["pub/mpguanli#NEWFAM", "newfam/houtai"],  // 后勤管理员
        ["newfam/dizi1", "newfam/keting"],          // 普通弟子
    ];
    boss_path = "newfam/zhangmen";
    boss_guard = ["newfam/dating", "newfam/lianwu", "newfam/houtai"];

    // ===== 3. 技能配置 =====
    npc_skills: SkillSet = [
        ["dodge", 800],
        ["parry", 800],
        ["force", 800],
        ["unarmed", 800],
        ["newfam-xinfa", 800],
        ["newfam-neigong", 800, "force"],
        ["newfam-shenfa", 800, "dodge"],
        ["newfam-quanfa", 800, ["unarmed", "parry"]],
    ];

    // ===== 4. 构造函数 - 设置称谓 =====
    constructor() {
        super();
        this.set_titles(
            "新门派掌门",
            "新门派长老",
            "新门派第一代弟子",
            "新门派第二代弟子",
            "新门派第三代弟子"
        );
    }

    // ===== 5. 称呼回调 =====
    call(me: USER, isbad?: boolean): string {
        // ... 根据角色年龄/性别返回适当的称呼
    }

    call_me(me: USER, isbad?: boolean): string {
        // ... 根据角色年龄/性别返回适当的自称
    }

    // ===== 6. 可选回调 =====
    on_kill(npc: NPC, me: USER): void {
        // ... NPC 被击杀时的门派广播
    }

    on_battle?(enemy: FAMILY): void {
        // ... 门派战开启时的处理
    }
}
```

### 4.2 文件命名规范

- 文件名使用小写英文字母，与 `id` 对应：`shaolin.ts` -> `id = "SHAOLIN"`
- 文件必须放在 `server/res/family/` 目录下
- 必须使用 `export default class extends FAMILY` 导出

---

## 5. NPC 配置

### 5.1 def_npcs 详解

`def_npcs` 是 `string[][]` 类型，每个元素包含两个字符串：

```typescript
def_npcs = [
    ["npc_path", "room_path"],  // 将 npc_path 对应的 NPC 放置在 room_path 对应的房间
    ...
];
```

- **`npc_path`**：NPC 资源文件的路径（相对于 `server/res/npc/`，不含 `.ts` 后缀）。例如 `"shaolin/xuannan"` 对应 `server/res/npc/shaolin/xuannan.ts`
- **`room_path`**：房间文件的路径（相对于 `server/res/room/`，不含 `.ts` 后缀）。例如 `"shaolin/fangzhang"` 对应 `server/res/room/shaolin/fangzhang.ts`

**重要**：引擎调用 `init()` 时会遍历 `def_npcs`，对每个条目执行以下操作：

1. 通过 `WORLD.getRoom(item[1])` 获取房间
2. 通过 `_NPC.CLONE(item[0])` 克隆 NPC 实例
3. 将 NPC 放入房间（`rm.items.push(npc)`）
4. 设置 `npc.environment = rm`
5. 若 NPC 路径匹配 `boss_path`，则设 `this.boss = npc`
6. 绑定死亡回调 (`on_died`) 和复活回调 (`relive`)

当 `def_npcs` 为 `undefined` 时，`init()` 不会做任何事。

### 5.2 必含 NPC 类型

每个参与门派战的完整门派应在 `def_npcs` 中包含：

1. **掌门 NPC** -- 门派的核心 NPC，通常也是 `boss_path`
2. **首席弟子 NPC** -- 路径格式 `"pub/dadizi#FAMILYID"`，例如 `"pub/dadizi#SHAOLIN"`
3. **后勤管理 NPC** -- 路径格式 `"pub/mpguanli#FAMILYID"`，例如 `"pub/mpguanli#SHAOLIN"`
4. **普通 NPC** -- 各具特色的门派 NPC

### 5.3 `#` 参数模式

首席弟子和后勤管理员 NPC 使用特殊的参数传递模式：

```
pub/dadizi#SHAOLIN
pub/mpguanli#GAIBANG
```

**规则**：资源路径中 `#` 后的部分会在 NPC 的 `on_create(path, par)` 回调中传递。对于 `dadizi`：

```typescript
// server/res/npc/pub/dadizi.ts 第26行
on_create(path: string, par?: string) {
    if (!par) return;
    this.family = FAMILIES[par.slice(1)];  // par = "#SHAOLIN", par.slice(1) = "SHAOLIN"
    this.init_from(this.family);
}
```

因此，`#` 后的字符串必须与对应门派的 `id` 完全一致（大小写敏感）。

### 5.4 boss_path 与 boss 自动识别

当 `init()` 遍历 `def_npcs` 时，会检查每个 NPC 是否匹配 `boss_path`：

```typescript
if (npc.is(this.boss_path) && !this.boss) {
    this.boss = npc;
}
```

- `npc.is(path)` 方法判断 NPC 的资源路径是否等于指定路径
- 只有第一个匹配 `boss_path` 的 NPC 被设为 `boss`
- 如果需要 boss 具备特殊行为，应在 NPC 资源文件中实现

---

## 6. 技能配置

### 6.1 SkillSet 类型

```typescript
type SkillSet = [skill_name: string, level: number, enable_base?: string | string[]][];
```

每个条目是一个三元组：

| 元素 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `skill_name` | `string` | 是 | 技能 ID（如 `"yijinjing"`, `"taijijian2"`） |
| `level` | `number` | 是 | 技能等级（如 `800`, `5000`） |
| `enable_base` | `string \| string[]` | 否 | 装备到的基础技能（如 `"force"`, `["unarmed", "parry"]`） |

### 6.2 三种技能配置

#### npc_skills（必需）

普通 NPC 的技能配置。所有非掌门 NPC 都会使用这个技能配置。

```typescript
npc_skills: SkillSet = [
    // 基础技能（不需要 enable_base）
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],

    // 门派内功
    ["yijinjing", 800, "force"],     // 装备到 force 基础技能
    // 门派身法
    ["shaolinshenfa", 800, "dodge"], // 装备到 dodge 基础技能
    // 门派拳法
    ["jingangquan", 800, "parry"],   // 装备到 parry
    // 门派刀法（可装备到多个基础技能）
    ["ranmudao", 800, "blade"],
];
```

**命名约定**：

- 基础技能 ID：`"dodge"`, `"parry"`, `"force"`, `"unarmed"`, `"sword"`, `"blade"`, `"club"`, `"staff"`, `"whip"`, `"throwing"`, `"literate"`
- 门派技能命名：门派拼音缩写 + 技能名，如 `"yijinjing"`（易筋经）、`"taijijian"`（太极剑）
- 进阶技能命名：在普通技能后加数字，如 `"yijinjing2"`（易筋经进阶）、`"taijijian3"`（太极剑高阶）

#### boss_skills（推荐）

掌门 NPC 的技能配置。可与 `npc_skills` 不同，通常包含进阶技能。

```typescript
boss_skills: SkillSet = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["yijinjing2", 800, "force"],      // 使用进阶内功
    ["shaolinshenfa", 800, "dodge"],
    ["jingangquan2", 800, "parry"],    // 使用进阶拳法
    ["ranmudao", 800, "blade"],
];
```

#### boss_skills2（可选）

掌门的高难度版本技能配置，在更高难度的战斗中使用：

```typescript
boss_skills2: SkillSet = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["blade", 5000],
    ["yijinjing2", 5000, "force"],
    ["ranmudao3", 5000, ["blade", "parry"]],  // 装备到多个基础技能
    ["shaolinshenfa2", 5000, "dodge"],
    ["jingangquan2", 5000, "unarmed"],
];
```

### 6.3 enable_base 的作用

`enable_base` 是技能装备时的绑定关系，表示该技能能否替代指定的基础技能用于战斗。例如：

- `["yijinjing", 800, "force"]`：表示玩家/ NPC 可以装备"易筋经"作为内功，替代基础 `force` 技能
- `["xianglongzhang", 800, ["unarmed", "parry"]]`：表示可以同时作为空手技能和招架技能

如果省略 `enable_base`，该技能不会替代任何基础技能，通常用于无法"装备"的辅助技能（如 `"literate"` 读书识字）。

### 6.4 兼职基础技能

每个门派应至少配置这些基础技能，否则 NPC 的战斗属性会缺失：

```typescript
// 必须包含的基础技能
["dodge", 800],     // 轻功/闪避
["parry", 800],     // 招架
["force", 800],     // 内功
["unarmed", 800],   // 拳脚

// 根据门派特色选择
["sword", 800],     // 剑法
["blade", 800],     // 刀法
["club", 800],      // 棍法
["staff", 800],     // 杖法
["whip", 800],      // 鞭法
["throwing", 800],  // 暗器
["literate", 800],  // 读书识字（知识技能）
```

---

## 7. 称谓系统

### 7.1 门派称谓层级

通过 `this.set_titles(...)` 在构造函数中设置。参数从高到低排列（索引 0 为最高级别）：

```typescript
constructor() {
    super();
    this.set_titles(
        "少林掌门",            // titles[0] -- 最高
        "少林派第三十五代弟子", // titles[1]
        "少林派第三十六代弟子", // titles[2]
        "少林派第三十七代弟子", // titles[3]
        "少林派第三十八代弟子", // titles[4]
        "少林派第三十九代弟子", // titles[5]
        "少林派第四十代弟子",  // titles[6]
        "少林派第四十一代弟子"  // titles[7] -- 最低
    );
}
```

通过 `query_title(level)` 按索引访问。

### 7.2 师门任务称谓

引擎内置了一套独立的师门任务称谓系统，存储在 `server/core/skill/family.ts` 的全局常量中：

```typescript
const TITLES: string[] = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];
```

这些称谓与玩家的 `sm_level`（师门等级）关联，通过以下方法访问：

```typescript
query_task_title(me: USER): string  // 返回如 "武当入门弟子"
query_job_title(level: number): string  // 返回如 "入门弟子"
```

**注意**：`NONE` 门派（无门无派）覆盖了这些方法，使用自己定义的

```typescript
const TITLES = ['打杂', '弟子', '教习', '护法', '长老', '供奉'];
```

### 7.3 称谓与晋升

后勤管理 NPC (`mpguanli.ts`) 使用 `query_job_title()` 显示玩家当前称谓和下一级称谓。

晋升所需功绩和等级在 `mpguanli.ts` 中定义：

```typescript
const NEEDS_GJ = [500, 5000, 10000, 50000, 100000];     // 所需功绩
const NEEDS_LEVEL = [0, 3, 4, 5, 6];                     // 所需玩家等级
const NEEDS_LEVEL_DESC = [null, "宗师", "武圣", "武帝", "武神"];  // 等级描述
```

---

## 8. 称呼回调

### 8.1 call(me, isbad?)

当其他角色（NPC）称呼该门派玩家时调用。返回称呼字符串。

**参数**：

- `me: USER` -- 被称呼的玩家对象
- `isbad?: boolean` -- 是否使用恶意称呼（争吵、战斗时）

**典型实现**（按性别和年龄分段）：

```typescript
call(me: USER, isbad?: boolean): string {
    var age = me.query_age();
    if (me.gender == 2) {
        // 女性
        if (age < 18) return isbad ? "小贱人" : "小姑娘";
        else if (age < 50) return isbad ? "贱人" : "姑娘";
        else return isbad ? "死老太婆" : "婆婆";
    } else {
        // 男性
        if (age < 20) return isbad ? "小王八蛋" : "小兄弟";
        else if (age < 50) return isbad ? "臭贼" : "壮士";
        else return isbad ? "老匹夫" : "老爷子";
    }
}
```

**特殊示例**：

- 少林派：男性用"小师父"/"大师"/"死秃驴"/"老秃驴"，女性用"小师太"/"师太"/"小贼尼"/"贼尼"
- 武当派：男性用"道兄"/"道长"/"死牛鼻子"，女性用"小仙姑"/"仙姑"/"小妖女"/"妖女"
- 怪物派：返回"大仙"或"畜生"
- 六扇门和无浪门：使用通用模板

### 8.2 call_me(me, isbad?)

当玩家在门派中自称时调用。返回自称字符串。

**典型实现**：

```typescript
call_me(me: USER, isbad?: boolean): string {
    var age = me.query_age();
    if (me.gender == 2) {
        if (age < 30) return isbad ? "本姑娘" : "小女子";
        else return isbad ? "老娘" : "妾身";
    } else {
        if (age < 50) return isbad ? "大爷我" : "在下";
        else return isbad ? "老子" : "老头子";
    }
}
```

**特殊示例**：

- 少林派：男性用"贫僧"/"老衲"/"和尚我"/"老和尚我"，女性用"贫尼"/"老尼"
- 武当派：统一用"贫道"，男性恶意时用"本山人"
- 怪物派：返回空字符串

### 8.3 方法调用约定

这两个方法在游戏中被广泛调用（NPC 对话、战斗消息、系统提示），因此必须实现。即使最简单的门派也应提供基本实现。

---

## 9. 门派战系统

### 9.1 启用门派战

设置 `can_battle = true` 并配置以下属性：

```typescript
can_battle = true;          // 启用门派战
boss_path = "...";          // 掌门路径（必需）
boss_guard = [
    "room1",                // 掌门所在房间
    "room2",                // 护卫房间
    "room3",                // 护卫房间
];
```

### 9.2 触发条件

门派战在以下条件全部满足时自动触发：

1. 某门派 NPC 被其他门派玩家击杀
2. 击杀者和被杀者所属不同门派
3. 双方 `can_battle === true`
4. 双方当前都不在门派战中（`battle_family === null`）
5. 双方都有掌门 NPC（`boss` 不为空）
6. 双方都没有临时标记 `"battle"`

触发代码位于 `FAMILY.check_battle()` 方法。

### 9.3 战斗流程

```
NPC 被击杀
    ↓
check_battle() 检查触发条件
    ↓
on_kill() 回调（被击杀方掌门发送广播）
    ↓
on_battle() 回调（击杀方门派收到通知）
    ↓
begin_attack() 双方同时进入战斗
    ├── 设置 30 分钟倒计时
    ├── 创建门派副本房间
    ├── 创建守卫 NPC (create_guards)
    │   ├── 掌门副本（等级5）
    │   ├── 等级4护卫 × 2（在第一个护卫房间）
    │   └── 等级3护卫 × 2/房间（在每个 boss_guard 房间）
    └── 持续生成普通 NPC (create_npcs)
        └── 每 200 秒补充，上限 27 个
```

### 9.4 结束条件

| 结束类型 `suc_type` | 触发条件 | 胜利方 |
|---------------------|----------|--------|
| `"suc"` | 击杀对方掌门 | 主动方胜利，练功效率+50% 持续 1 小时 |
| `"die"` / `"fail"` | 本方掌门被击杀 | 对方胜利 |
| `"timeout"` | 30 分钟倒计时结束 | 积分高的一方胜利，练功效率+20% |

### 9.5 on_kill 回调

当门派 NPC 被其他门派玩家击杀时调用：

```typescript
on_kill(npc: NPC, me: USER): void {
    if (this.boss) {
        this.boss.do_command("chat",
            me.family.name + "门下弟子" + me.name +
            "击杀我派弟子" + npc.name + "，" +
            this.name + "众弟子听令，对" +
            me.family.name + "弟子格杀勿论！");
    }
}
```

- 参数 `npc`：被击杀的 NPC
- 参数 `me`：击杀者（玩家）
- 通过 `this.boss.do_command("chat", msg)` 让掌门发送全服广播
- 如果被击杀的是掌门（`npc === this.boss`），走特殊逻辑，首席弟子会说话

### 9.6 on_battle 回调

当门派战被对方向己方宣战时调用：

```typescript
on_battle?(enemy: FAMILY): void {
    if (this.boss) {
        this.boss.do_command("chat", "哼，我峨眉派还怕了你" + enemy.name + "不成？");
    }
}
```

- 参数 `enemy`：宣战方门派实例
- 是可选方法（使用 `?` 标记）
- 通常用于让掌门做出霸气回应

### 9.7 副本房间系统

门派战在独立的副本房间中进行，避免干扰正常区域：

- `area.rooms[0].create_copy(this.id, 0)` -- 创建门派区域所有房间的副本
- `get_room(rm)` -- 获取原始房间对应的副本
- `clear_room()` -- 战斗结束后清理副本

---

## 10. 区域关联

### 10.1 AREA.family 字段

门派物理区域通过 AREA 资源文件中的 `family` 字段与 FAMILY 实例关联。

**区域文件示例**（`server/res/area/map/shaolin.ts`）：

```typescript
import {FAMILY_AREA} from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    id = "shaolin";
    name = "少林派";
    desc = "...";
    first = "shaolin/guangchang";   // 入口房间
    is_area = true;
    index = 2;                      // 排序索引
    room_path = "shaolin/";         // 房间路径前缀
    family = "SHAOLIN";             // 关键字段 -- 必须与 FAMILY.id 一致
    map = [
        {n: "广场", id: "shaolin/guangchang", p: [0, 5]},
        // ... 其他房间定义
    ];
}
```

**关联建立过程**：

1. AREA 文件被加载时，`AREA.create()` 被调用
2. 若 `this.family` 不为空，执行 `FAMILIES[this.family].area = this`
3. 从此，`FAMILIES["SHAOLIN"].area` 指向 `shaolin` 区域

**文件清单**（已有门派区域，位于 `server/res/area/map/`）：

| 区域文件 | family 值 | 对应门派 |
|----------|-----------|----------|
| `shaolin.ts` | `"SHAOLIN"` | 少林派 |
| `wudang.ts` | `"WUDANG"` | 武当派 |
| `huashan.ts` | `"HUASHAN"` | 华山派 |
| `emei.ts` | `"EMEI"` | 峨眉派 |
| `gaibang.ts` | `"GAIBANG"` | 丐帮 |
| `shashou.ts` | `"SHASHOU"` | 杀手楼 |
| `xiaoyao.ts` | `"XIAOYAO"` | 逍遥派 |

### 10.2 FAMILY_AREA 基类

门派区域应继承 `FAMILY_AREA`（而非直接继承 `AREA`），因为前者提供了门派特有的操作界面：

```typescript
export class FAMILY_AREA extends AREA {
    query_actions(me: USER): string[][] {
        // 返回：练功(goto fam1)、后勤(goto fam2)、战场入口、请安等标准按钮
    }
}
```

该基类自动提供以下客户端按钮：

| 命令 | 按钮名 | 说明 |
|------|--------|------|
| `goto fam1 <family_id>` | 练功 | 回到门派师父处学习 |
| `goto fam2 <family_id>` | 后勤 | 前往后勤管理员处 |
| `goto fam3 <family_id>` | 进入战场 | 门派战中才出现 |
| `sx greet` | 请安 | 向首席弟子请安 |

### 10.3 房间路径规范

房间文件放在 `server/res/room/<area_id>/` 目录下：

```
server/res/room/
├── shaolin/       # 对应 area_id = "shaolin"
│   ├── guangchang.ts
│   ├── fangzhang.ts
│   └── ...
├── wudang/        # 对应 area_id = "wudang"
│   ├── guangchang.ts
│   └── ...
└── ...
```

房间路径格式为 `<area_id>/<room_name>`，区域文件的 `room_path` 前缀用于客户端映射。

---

## 11. 技能与门派的自动关联

### 11.1 关联机制

技能文件通过 `family` 字段与门派关联。此字段设置在技能资源文件中：

```typescript
// server/res/skill/shaolin/yijinjing.ts
export default class extends SKILL {
    id = "yijinjing";
    name = "易筋经";
    family = FAMILIES.SHAOLIN;  // 直接引用 FAMILIES 注册表
    // ...
}
```

### 11.2 自动分类

当技能加载时，`SKILL.update()` 方法根据技能属性自动将其归类到门派对应的数组：

| 条件 | 存入数组 |
|------|----------|
| 普通技能（无 `source_skill`，非 `is_ultimate`） | `fam.skills` |
| 进阶技能（有 `source_skill`，非 `is_ultimate`） | `fam.skills2` |
| 进阶终极技能（有 `source_skill` 且 `is_ultimate`） | `fam.skills3` |
| 终极技能（无 `source_skill` 且 `is_ultimate`） | `fam.skills4` |
| 知识技能或隐藏技能 | `fam.skills0` |

分类按品级（`grade`）升序排列。

### 11.3 未指定门派的技能

技能文件中的 `family` 字段可以为空（未设置）。此时技能会被归入 `FAMILIES.NONE` 门下：

```typescript
const fam = this.family || FAMILIES.NONE;
```

这意味着无门无派的玩家也能学到这些技能（如果满足其他条件）。

### 11.4 在 FAMILY 中查询技能

```typescript
// 随机获取一个 3 品技能；该品级没有技能时返回 undefined
const skill = FAMILIES.SHAOLIN.query_skill(3);
if (skill) {
    console.log(skill.name);
}

// 获取所有 5 品技能
const skills = FAMILIES.SHAOLIN.query_skills(5);
```

---

## 12. 完整门派文件示例

### 12.1 注释完整的示例

```typescript
/**
 * 新门派 - NEWFAM
 *
 * 本文件是创建门派的完整模板。将此文件保存为
 * server/res/family/newfam.ts 即可在游戏中添加一个新门派。
 *
 * 配套文件还需：
 * - server/res/area/map/newfam.ts（区域定义）
 * - server/res/room/newfam/*.ts（房间文件）
 * - server/res/npc/newfam/*.ts（NPC 文件）
 * - server/res/skill/newfam/*.ts（技能文件，设置 family = FAMILIES.NEWFAM）
 */

import {FAMILY} from "../../core/skill/family.js";
import type { SkillSet } from "../../core/skill/skill.js";
import type { NPC } from "../../core/char/npc.js";
import type { USER } from "../../core/char/user.js";

export default class extends FAMILY {
    // ==================== 身份标识 ====================

    /** 门派唯一标识，全局注册表键名，必须全大写 */
    id = "NEWFAM";

    /** 门派显示名称 */
    name = "新门派";

    /** 首席弟子称号 */
    top_name = "新门派大弟子";

    /** 默认性别（1=男，2=女，省略=无限制） */
    gender = 1;

    /** 门派品类（用于客户端分类） */
    top_family = "道宗";

    // ==================== NPC 配置 ====================

    /** 是否可参与门派战 */
    can_battle = true;

    /**
     * NPC 定义：["npc路径", "房间路径"]
     * - npc路径相对于 server/res/npc/，不含 .ts 后缀
     * - 房间路径相对于 server/res/room/，不含 .ts 后缀
     * - pub/dadizi#ID 和 pub/mpguanli#ID 是特殊 NPC，自动关联门派
     */
    def_npcs = [
        ["newfam/zhangmen", "newfam/dating"],           // 掌门
        ["pub/dadizi#NEWFAM", "newfam/lianwu"],         // 首席弟子
        ["pub/mpguanli#NEWFAM", "newfam/houtai"],       // 后勤管理
        ["newfam/dizi1", "newfam/keting"],               // 普通弟子甲
        ["newfam/dizi2", "newfam/xiuxishi"],             // 普通弟子乙
    ];

    /** 掌门 NPC 路径（用于自动识别 boss 实例） */
    boss_path = "newfam/zhangmen";

    /** 掌门护卫所在房间列表（门派战中使用） */
    boss_guard = ["newfam/dating", "newfam/lianwu", "newfam/houtai"];

    /** 额外守卫房间 */
    guard_rooms = ["newfam/keting", "newfam/xiuxishi"];

    // ==================== 技能配置 ====================

    /**
     * NPC 技能集合：["技能ID", 等级, "装备的基础技能 或 基础技能数组"]
     * 每个条目可以不带 enable_base（第三项省略）
     */
    npc_skills: SkillSet = [
        // 基础技能（必须配置）
        ["dodge", 800],
        ["parry", 800],
        ["force", 800],
        ["unarmed", 800],
        ["sword", 800],
        ["literate", 800],

        // 门派特色技能（带有 enable_base）
        ["newfam-xinfa", 800],                          // 门派心法（辅助技能，不装备）
        ["newfam-neigong", 800, "force"],               // 内功 → 装备到 force
        ["newfam-shenfa", 800, "dodge"],                // 身法 → 装备到 dodge
        ["newfam-jianfa", 800, "sword"],                // 剑法 → 装备到 sword
        ["newfam-quanfa", 800, ["unarmed", "parry"]],   // 拳法 → 装备到 unarmed 和 parry
    ];

    /** 掌门技能（可以使用进阶版本） */
    boss_skills: SkillSet = [
        ["dodge", 800],
        ["parry", 800],
        ["force", 800],
        ["unarmed", 800],
        ["sword", 800],
        ["newfam-neigong2", 800, "force"],              // 进阶内功
        ["newfam-shenfa", 800, "dodge"],
        ["newfam-jianfa2", 800, "sword"],               // 进阶剑法
        ["newfam-quanfa2", 800, ["unarmed", "parry"]],  // 进阶拳法
    ];

    /** 掌门高难度技能（boss_skills2 可选） */
    boss_skills2: SkillSet = [
        ["dodge", 5000],
        ["parry", 5000],
        ["force", 5000],
        ["unarmed", 5000],
        ["sword", 5000],
        ["newfam-neigong2", 5000, "force"],
        ["newfam-shenfa2", 5000, "dodge"],
        ["newfam-jianfa3", 5000, "sword"],
        ["newfam-quanfa2", 5000, ["unarmed", "parry"]],
    ];

    /** NPC 装备列表（可选） */
    eqs = [];

    // ==================== 构造函数 ====================

    constructor() {
        super();

        // 设置称谓层级（从高到低，索引0为最高）
        this.set_titles(
            "新门派掌门",        // titles[0]
            "新门派长老",        // titles[1]
            "新门派第一代弟子",  // titles[2]
            "新门派第二代弟子",  // titles[3]
            "新门派第三代弟子"   // titles[4]
        );
    }

    // ==================== 称呼回调 ====================

    /**
     * 称呼回调 — 他人对该门派玩家的称呼
     * @param me   被称呼的玩家
     * @param isbad 是否恶意称呼（战斗/争吵时）
     * @returns 称呼字符串
     */
    call(me: USER, isbad?: boolean): string {
        var age = me.query_age();
        if (me.gender == 2) {
            // 女性
            if (age < 18) return isbad ? "小贱人" : "小姑娘";
            else if (age < 50) return isbad ? "贱人" : "姑娘";
            else return isbad ? "死老太婆" : "婆婆";
        } else {
            // 男性
            if (age < 20) return isbad ? "小王八蛋" : "小兄弟";
            else if (age < 50) return isbad ? "臭贼" : "壮士";
            else return isbad ? "老匹夫" : "老爷子";
        }
    }

    /**
     * 自称回调 — 该门派玩家对自己的称呼
     * @param me   说话的玩家
     * @param isbad 是否恶意自称
     * @returns 自称字符串
     */
    call_me(me: USER, isbad?: boolean): string {
        var age = me.query_age();
        if (me.gender == 2) {
            if (age < 30) return isbad ? "本姑娘" : "小女子";
            else return isbad ? "老娘" : "妾身";
        } else {
            if (age < 50) return isbad ? "大爷我" : "在下";
            else return isbad ? "老子" : "老头子";
        }
    }

    // ==================== 可选回调 ====================

    /**
     * 击杀回调 — 本门 NPC 被其他门派玩家击杀时触发
     * @param npc 被击杀的 NPC
     * @param me  击杀者
     */
    on_kill(npc: NPC, me: USER): void {
        if (this.boss) {
            this.boss.do_command("chat",
                me.family.name + "门下弟子" + me.name +
                "击杀我派弟子" + npc.name + "，" +
                this.name + "众弟子听令，对" +
                me.family.name + "弟子格杀勿论！");
        }
    }

    /**
     * 门派战回调 — 被其他门派宣战时触发
     * @param enemy 宣战方门派实例
     */
    on_battle?(enemy: FAMILY): void {
        if (this.boss) {
            this.boss.do_command("chat", "哼！" + enemy.name + "欺人太甚！");
        }
    }

    // ==================== 可选覆盖 ====================

    /**
     * 覆盖 create_name 自定义 NPC 名字生成
     * 默认使用 UTIL.random_name(this.gender) 生成随机中文名
     */
    // create_name(npc?: NPC): string {
    //     // 示例：按辈分生成名字
    //     const gen = ["玄", "慧", "虚", "空"][npc?.family_level ?? 0];
    //     return gen + "××";
    // }
}
```

### 12.2 最小可行门派

不参与门派战的门派只需最低配置：

```typescript
import {FAMILY} from "../../core/skill/family.js";
import type { USER } from "../../core/char/user.js";

export default class extends FAMILY {
    id = "MINIMAL";
    name = "最小门派";

    def_npcs = [];  // 空数组或省略，没有 NPC

    call(me: USER, isbad?: boolean): string {
        return "朋友";
    }

    call_me(me: USER, isbad?: boolean): string {
        return "我";
    }
}
```

---

## 13. 特殊 NPC 说明

### 13.1 首席弟子（pub/dadizi#FAMILYID）

**文件**：`server/res/npc/pub/dadizi.ts`

**功能**：

- 玩家可以"请安"（`sx greet`）获取奖励
- 首席弟子体现门派中功绩最高的玩家
- 玩家的属性、技能、装备会复制到首席弟子 NPC 上

**参数模式**：

```typescript
// def_npcs 格式
["pub/dadizi#SHAOLIN", "shaolin/lianwu"]
```

**初始化过程**：

1. `on_create(path, par)` 解析 `par`（`#SHAOLIN`）获取 `FAMILIES.SHAOLIN`
2. 调用 `init_from(fam)`，从 `fam.npc_skills` 获取技能列表（所有技能设为 200 级）
3. 读取数据库中的首席玩家 ID
4. 调用 `fam.init_dadizi(npc, user)` 复制玩家属性

**注意**：EMEI 门派会额外设置 `this.gender = 2`。

### 13.2 后勤管理员（pub/mpguanli#FAMILYID）

**文件**：`server/res/npc/pub/mpguanli.ts`

**功能**：

- 玩家查询当前门派职位（`job_fam`）
- 玩家消耗功绩晋升职位（`job_up_ok`）
- 职位晋升影响师门任务奖励

**参数模式**：

```typescript
// def_npcs 格式
["pub/mpguanli#SHAOLIN", "shaolin/shanmen"]
```

**操作流程**：

1. 玩家输入 `job_fam`，管理员显示当前职位和晋升所需功绩
2. 如果功绩足够，显示"确定晋升"按钮
3. 玩家确认后，消耗功绩，提升 `sm_level`

**NONE 门派特殊处理**：名称改为"武馆后勤"。

### 13.3 门派战守卫（pub/menpai）

**文件**：`server/res/npc/pub/menpai.ts`

**功能**：门派战期间自动生成守卫 NPC。不通过 `def_npcs` 配置，而是由 `FAMILY.create_guards()` 和 `create_npcs()` 在战斗开始时动态创建。

**初始化**：`npc.init_from(fam, level)` 在运行时热补丁实现。

---

## 14. FAMILIES 全局注册表

### 14.1 定义位置

```typescript
// server/core/skill/family.ts 第782行
export const FAMILIES: Record<string, FAMILY> = {NONE: new FAMILY()};
```

默认包含 `NONE` 条目，代表"无门无派"。

### 14.2 注册机制

每个门派文件在 `create()` 方法中注册自身：

```typescript
create(path: string): void {
    FAMILIES[this.id] = this;
}
```

### 14.3 全局访问

注册后，可在任何位置通过 `FAMILIES` 访问所有门派：

```typescript
import {FAMILIES} from "../../core/skill/family.js";

// 按 ID 访问
const shaolin = FAMILIES.SHAOLIN;
const wudang = FAMILIES.WUDANG;

// 遍历所有门派
for (const id in FAMILIES) {
    const fam = FAMILIES[id];
    // ...
}

// 特殊门派
const none = FAMILIES.NONE;  // 无门无派
```

### 14.4 FAMILIES.NONE 详解

`NONE` 是一个特殊的 FAMILY 实例，代表"无门无派"状态。定义在 `server/res/family/none.ts`：

- `id = "NONE"`, `name = "无门无派"`
- 所有没有门派的角色属于此门派
- 覆盖了 `query_task_title` 和 `query_job_title`，使用自己的 TITLES 数组
- `top_name = "武馆大弟子"`

---

## 15. 调试与热更新

### 15.1 验证加载

门派加载成功后，可在游戏中通过以下方式验证：

- 检查 `FAMILIES["YOUR_ID"]` 是否有效
- 检查 `area` 属性是否正确关联（`FAMILIES["YOUR_ID"].area`）
- 检查 `boss` 属性是否正确识别

### 15.2 热更新

FAMILY 支持运行时热更新：

```typescript
update(path: string): void {
    FAMILIES[this.id] = this;  // 重新注册
}
```

触发热更新后，引擎会重新加载资源文件，调用 `update()` 替换注册表中的实例。

NPC 热更新方法：

```typescript
// 更新指定路径前缀的 NPC
FAMILIES.SHAOLIN.update_npc("shaolin/xuannan");

// 更新所有门派中匹配路径的 NPC
FAMILY.UPDATE_NPC("shaolin/xuannan");
```

### 15.3 数据持久化

FAMILY 支持排行榜和临时数据的持久化：

```typescript
// 序列化
const data = FAMILY.SAVE();  // JSON 字符串

// 反序列化
FAMILY.LOAD(data);  // 从 JSON 恢复
```

`SAVE()` 保存所有门派的 `tops`（排行榜）和 `temp`（临时数据）。`LOAD()` 恢复这些数据。

---

## 16. 常见问题

### 16.1 门派加载后没有 NPC

**检查项**：

1. `def_npcs` 是否已定义且非空
2. `def_npcs` 中的 NPC 路径是否有效（文件是否存在）
3. `def_npcs` 中的房间路径是否有效（文件是否存在）
4. 注意 `init()` 是引擎自动调用的，不要在构造函数中手动调用

### 16.2 门派战不触发

**检查项**：

1. `can_battle` 是否设为 `true`
2. `boss_path` 是否配置正确
3. `boss_guard` 是否配置了至少一个房间
4. 敌对门派也同样配置了 `can_battle = true`
5. 双方当前都没有正在进行的门派战

### 16.3 boss 没有被识别

**检查项**：

1. `boss_path` 的值是否与 `def_npcs` 中某个条目的 NPC 路径完全一致
2. boss NPC 文件是否存在且加载正常
3. 检查日志是否有 "房间不存在" 或 "npc 不存在" 的错误

### 16.4 首席弟子不工作

**检查项**：

1. `def_npcs` 中是否有 `pub/dadizi#FAMILYID` 条目
2. `#` 后的 ID 是否与门派的 `id` 完全一致（大小写敏感）
3. `top_name` 是否已设置

### 16.5 技能不生效

**检查项**：

1. `npc_skills` 中的技能 ID 是否对应存在的技能文件
2. 技能文件的 `family` 字段是否正确引用了 `FAMILIES.XXX`
3. 基础技能（dodge, force 等）是否包含在配置中

### 16.6 区域未关联

**检查项**：

1. AREA 文件中的 `family` 字段是否与 FAMILY 的 `id` 一致
2. AREA 文件是否继承了 `FAMILY_AREA` 基类
3. `FAMILIES["YOUR_ID"].area` 是否为 null

---

## 17. API 速查表

### 17.1 必需实现的字段

| 字段 | 说明 |
|------|------|
| `id` | 门派标识，全大写 |
| `name` | 门派名称 |
| `def_npcs` | NPC 配置数组 |
| `npc_skills` | NPC 技能配置 |
| `call()` | 称呼回调 |
| `call_me()` | 自称回调 |

### 17.2 推荐实现的字段

| 字段 | 说明 |
|------|------|
| `top_name` | 首席弟子称号 |
| `boss_path` | 掌门路径 |
| `boss_skills` | 掌门技能（不使用则与 NPC 相同） |
| `constructor()` + `set_titles()` | 设置称谓层级 |

### 17.3 门派战相关字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `can_battle` | `boolean` | 启用门派战 |
| `boss_path` | `string` | 掌门路径 |
| `boss_guard` | `string[]` | 护卫房间 |
| `guard_rooms` | `string[]` | 额外守卫房间 |
| `on_kill()` | 方法 | 击杀回调 |
| `on_battle?()` | 方法 | 宣战回调 |

### 17.4 方法速查

| 方法 | 签名 | 说明 |
|------|------|------|
| `set_titles` | `(...titles: string[]): void` | 设置称谓层级 |
| `query_title` | `(level: number): string` | 查询称谓 |
| `query_skill` | `(grade: number): SKILL \| undefined` | 随机查询技能；目标品级无技能时返回 `undefined` |
| `query_skills` | `(grade: number): SKILL[]` | 查询所有该品级技能 |
| `add_gongji` | `(me, count: number): void` | 增加功绩 |
| `send` | `(str: string): void` | 门派广播 |
| `send_channel` | `(me, msg: string): void` | 频道消息 |
| `is_battle` | `(fam: FAMILY): boolean` | 是否交战中 |
| `add_score` | `(me, sc: number): void` | 增加门派战积分 |
| `query_task_title` | `(me): string` | 师门任务称谓 |
| `query_job_title` | `(level: number): string` | 师门职位称谓 |
| `init` | `(): void` | 初始化 NPC（引擎调用） |
| `create` | `(path: string): void` | 注册到 FAMILIES |
| `update` | `(path: string): void` | 热更新注册 |

### 17.5 全局函数速查

| 函数 | 签名 | 说明 |
|------|------|------|
| `FAMILIES[id]` | `Record<string, FAMILY>` | 按 ID 获取门派 |
| `FAMILY.SAVE()` | `(): string` | 序列化所有门派数据 |
| `FAMILY.LOAD(str)` | `(str: string): void` | 反序列化恢复数据 |
| `FAMILY.UPDATE_NPC(path)` | `(path: string): void` | 热更新所有门派的 NPC |

### 17.6 配套文件清单

创建一个完整门派需要以下文件：

```
server/res/
├── family/
│   └── newfam.ts              # 门派定义（本文档）
├── area/map/
│   └── newfam.ts              # 区域定义（设置 family = "NEWFAM"）
├── room/
│   └── newfam/                # 房间文件目录
│       ├── dating.ts          # 大厅
│       ├── lianwu.ts          # 练武场
│       ├── keting.ts          # 客厅
│       └── ...                # 更多房间
├── npc/
│   └── newfam/                # NPC 文件目录
│       ├── zhangmen.ts        # 掌门
│       ├── dizi1.ts           # 弟子一
│       └── dizi2.ts           # 弟子二
└── skill/
    └── newfam/                # 技能文件目录
        ├── xinfa.ts           # 心法（设置 family = FAMILIES.NEWFAM）
        ├── neigong.ts         # 内功
        ├── shenfa.ts          # 身法
        ├── jianfa.ts          # 剑法
        └── quanfa.ts          # 拳法
```

---

## 总览

编写一个门派 = 完成以下步骤：

1. **创建门派定义文件** `server/res/family/xxx.ts` -- 实现本文档描述的所有必需字段和方法
2. **创建区域文件** `server/res/area/map/xxx.ts` -- 继承 `FAMILY_AREA`，设置 `family` 字段
3. **创建房间文件** `server/res/room/xxx/*.ts` -- 物理地图
4. **创建 NPC 文件** `server/res/npc/xxx/*.ts` -- 各具特色的 NPC
5. **创建技能文件** `server/res/skill/xxx/*.ts` -- 设置 `family` 字段关联到门派
6. **验证加载** -- 启动服务端检查 `FAMILIES["XXX"]` 是否正确

按照本文档的每一步，即可创建一个功能完整、且与引擎其他子系统正确联动的门派。
