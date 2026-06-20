# NPC（游戏内人物）编写指南

## 目录

1. [概述](#1-概述)
2. [NPC 文件位置与命名规范](#2-npc-文件位置与命名规范)
3. [NPC 类的继承体系](#3-npc-类的继承体系)
4. [完整属性参考](#4-完整属性参考)
5. [完整方法参考](#5-完整方法参考)
6. [回调函数参考](#6-回调函数参考)
7. [在房间中放置 NPC](#7-在房间中放置-npc)
8. [NPC 的生命周期](#8-npc-的生命周期)
9. [分步教程：NPC 类型与完整示例](#9-分步教程npc-类型与完整示例)
    - [9.1 基础 NPC（最简单结构）](#91-基础-npc最简单结构)
    - [9.2 简单战斗 NPC](#92-简单战斗-npc)
    - [9.3 高难度战斗 NPC（BOSS 级）](#93-高难度战斗-npcboss-级)
    - [9.4 商店 NPC 商人](#94-商店-npc-商人)
    - [9.5 闲聊 NPC](#95-闲聊-npc)
    - [9.6 对话/问答 NPC](#96-对话问答-npc)
    - [9.7 门派师傅 NPC（拜师/学艺）](#97-门派师傅-npc拜师学艺)
    - [9.8 任务 NPC（含回调交互）](#98-任务-npc含回调交互)
    - [9.9 服务 NPC（多步交互）](#99-服务-npc多步交互)
    - [9.10 训练用 NPC（木头人）](#910-训练用-npc木头人)
10. [通用属性属性映射 (prop)](#10-通用属性属性映射-prop)
11. [技能系统详解](#11-技能系统详解)
12. [掉落系统详解](#12-掉落系统详解)
13. [装备配置详解](#13-装备配置详解)
14. [消息颜色标记参考](#14-消息颜色标记参考)
15. [常见陷阱与注意事项](#15-常见陷阱与注意事项)
16. [热更新与调试](#16-热更新与调试)

---

## 1. 概述

NPC（Non-Player Character，非玩家角色）是 MUD 游戏世界中的核心交互对象。NPC 可以是：

- **商店老板**（铁匠、药店老板）—— 出售物品给玩家
- **杂役/服务 NPC**（店小二、衙役）—— 提供服务交互
- **战斗 NPC**（官兵、家将、山贼）—— 可被玩家击杀以获得经验和掉落
- **BOSS**（洪七公、岳不群）—— 高难度挑战目标
- **门派师傅**（岳不群、灭绝师太）—— 传授武艺、收徒
- **任务 NPC** —— 配合任务系统，推进剧情
- **闲聊 NPC** —— 提供随机对话，丰富世界氛围

每个 NPC 都是一个 TypeScript 类文件，放在 `server/res/npc/` 目录下。引擎在启动时自动发现并加载这些文件，将其注册到全局 NPC 模板缓存 `WORLD.NPC_STROE` 中。

---

## 2. NPC 文件位置与命名规范

### 2.1 文件路径格式

```
server/res/npc/{区域缩写}/{npc名称}.ts
```

### 2.2 区域缩写对照表

| 缩写 | 区域 |
|------|------|
| `bj` | 北京 |
| `cd` | 成都 |
| `emei` | 峨眉山 |
| `huashan` | 华山 |
| `yz` | 扬州 |
| `pub` | 公共（所有区域通用） |
| `wudang` | 武当 |
| `shaolin` | 少林 |
| `gaibang` | 丐帮 |
| `shashou` | 杀手楼 |
| `xiaoyao` | 逍遥 |
| `liushan` | 六扇门 |
| `follower` | 随从（可招募伙伴） |
| `new` | 新手村/测试用 |
| `guanwai` | 关外 |

### 2.3 文件内容基本骨架

```typescript
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    // 属性声明（class fields）
    name = "NPC名称";
    desc = "NPC描述文本";
    // ... 其他属性

    constructor() {
        super();
        // 在此调用设置方法（skill_map, set_objects, set_drop, set_goods 等）
        // 以及 add_action 注册自定义命令
    }

    // 可选的回调方法
    on_enter(me) {
        // 玩家进入房间时触发
    }
}
```

> **重要**：必须使用 `export default class extends NPC` 格式，引擎通过 `mod.default` 获取类引用。

### 2.4 导入路径计算

NPC 文件通常使用相对路径导入基类。路径深度取决于 NPC 文件在 `server/res/npc/` 子目录中的层级：

```
server/res/npc/pub/xiaoer.ts      →  import {NPC} from "../../../core/char/npc.js"
server/res/npc/bj/ao/jiading.ts   →  import {NPC} from "../../../../core/char/npc.js"
```

公式：从 `server/res/npc/` 的下一层开始，每多一层子目录就多一个 `../`。

---

## 3. NPC 类的继承体系

```
BASE (server/core/base.ts)
  └── ITEM (server/core/item.ts)
       └── CHARACTER (server/core/char/character.ts)
            ├── NPC (server/core/char/npc.ts)        ← NPC 使用此类
            ├── MONSTER (server/core/char/monster.ts) ← 怪物/野兽使用
            ├── FOLLOWER (server/core/char/follower.ts) ← 随从使用
            └── USER (server/core/char/user.ts)      ← 玩家使用
```

NPC 类继承自 CHARACTER，CHARACTER 继承自 ITEM，ITEM 继承自 BASE。因此 NPC 拥有 BASE 的所有工具方法（`random`、`call_out`、`call_interval`）、ITEM 的所有物品操作方法（`add_obj`、`remove_obj`、`find_obj`）以及 CHARACTER 的所有战斗/技能方法。

---

## 4. 完整属性参考

所有属性直接在 class body 中声明赋值（TypeScript class fields）。引擎在模板注册时读取这些值。

### 4.1 基础标识属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | （必填） | NPC 显示名称，如 "店小二"、"官兵" |
| `desc` | `string` | （必填） | NPC 描述，玩家执行 look 时显示 |
| `title` | `string` | `undefined` | NPC 称号，如 "神秘商人"、"知府千金"。显示为 "称号 名称" |
| `gender` | `number` | `1` | 性别：1=男，2=女，3=无性 |
| `age` | `number` | `20` | 年龄，影响 look 时的描述（精力充沛/成熟稳练） |
| `per` | `number` | `20` | 容貌，影响 look 时的描述（容貌描述数组按 per/2 索引） |
| `color_name` | `string` | `""` | 带颜色的名称缓存，一般无需手动设置 |

### 4.2 角色属性（六项基本属性）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `str` | `number` | `20` | 臂力，影响物理攻击力 |
| `con` | `number` | `20` | 根骨，影响气血上限 |
| `dex` | `number` | `20` | 身法，影响闪避和攻速 |
| `int` | `number` | `20` | 悟性，影响学习效率 |
| `kar` | `number` | `20` | 福缘（运气） |
| `per` | `number` | `20` | 容貌（与上方的 per 是同一属性） |

### 4.3 战斗属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hp` | `number` | `100` | 当前气血值 |
| `max_hp` | `number` | `100` | 最大气血值 |
| `mp` | `number` | `100` | 当前内力值 |
| `max_mp` | `number` | `100` | 最大内力值 |
| `limit_mp` | `number` | `0` | 内力上限（由内功技能加成） |
| `level` | `number` | `0` | NPC 等级：0=普通百姓、1=武士、2=武师、3=宗师、4=武圣、5=武帝、6=武神 |
| `exp` | `number` | `0` | 经验值（通常 NPC 不需要设置） |
| `pot` | `number` | `0` | 潜能值（通常 NPC 不需要设置） |
| `score` | `number` | `0` | 击杀奖励积分（副本分数） |

> 注意：NPC 的战斗属性主要通过 `prop` 和技能系统计算。设置 `hp`/`max_hp`/`mp`/`max_mp` 作为基础值即可，实际战斗中通过 `recount()` 重新计算。

### 4.4 NPC 特定属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `auto_pfm` | `boolean` | `true` | 是否自动释放绝招 |
| `family` | `FAMILY` | `FAMILIES.NONE` | 所属门派，影响门派称谓和门派技能 |
| `family_level` | `number` | `0` | 门派内部地位等级 |
| `no_fight` | `boolean` | `false` | 是否禁止战斗。为 true 时玩家无法 fight/kill 此 NPC |
| `no_refresh` | `boolean` | `false` | 是否禁止死后重生。为 true 时 NPC 死亡后不会在房间刷新 |
| `chat_msg` | `string[]` | `undefined` | 闲聊消息列表 |
| `chat_chance` | `number` | `0` | 闲聊触发概率百分比（0-100），当前版本未主动使用 |
| `sell_list` | `OBJ[]` | `undefined` | 出售物品列表（通过 `set_goods()` 设置） |
| `die_room` | `ROOM` | `undefined` | 死亡时所在房间，重生时使用（自动设置） |
| `master` | `string` | `undefined` | 主人玩家 ID，用于随从/任务 NPC |
| `userid` | `string` | `undefined` | 关联玩家 ID（首席弟子 NPC 绑定玩家） |
| `question` | `Record<string, Function>` | `undefined` | 询问对话映射（通过 `set_ask()` 设置） |
| `drop_list` | `any[]` | `undefined` | 掉落表（通过 `set_drop()` 设置） |
| `prop` | `Record<string, number>` | `undefined` | 属性加成映射，用于提升战斗能力 |

### 4.5 运行时动态属性（由任务/战斗系统注入）

这些属性不需要手动设置，但了解它们有助于理解系统行为：

| 属性 | 类型 | 说明 |
|------|------|------|
| `diff_level` | `number` | 难度等级（BOSS/襄阳守城动态设置） |
| `pfm_rate` | `number` | 自动绝招释放概率（0-1），1=每回合必放 |
| `is_dasong` | `boolean` | 襄阳守城：是否大宋守军 |
| `is_menggubing` | `boolean` | 襄阳守城：是否蒙古兵 |
| `gate_index` | `number` | 襄阳守城：所属城门索引 |
| `boss_index` | `number` | BOSS 任务：BOSS 等级索引 |
| `event_id` | `string` | BOSS 任务：关联活动事件 ID |
| `drops_count` | `number` | 掉落计数器 |
| `top_index` | `number` | 高手榜排名索引（比武系统动态设置） |
| `no_alloc` | `boolean` | 掉落分配：是否禁止队伍分配 |

---

## 5. 完整方法参考

### 5.1 构造函数方法与设置方法

这些方法在 `constructor()` 中调用，用于配置 NPC 的各项能力。

#### `this.skill_map(...skills)`

批量设置 NPC 武功技能。

```typescript
this.skill_map(
    ["skill_id", level],                    // 基本技能：技能ID，等级
    ["skill_id", level, "base_skill"],      // 特殊技能：技能ID，等级，挂载到的基本技能
    ["skill_id", level, ["base1", "base2"]] // 特殊技能：同时挂载到多个基本技能
);
```

参数说明：
- `skill_id`：技能 ID（与技能资源文件对应）
- `level`：技能等级
- `base_skill`：该特殊技能挂载到的基本技能类型，可以是字符串或字符串数组

示例：
```typescript
this.skill_map(
    // 基本技能
    ["force", 500],       // 内功 500 级
    ["dodge", 500],       // 轻功 500 级
    ["parry", 500],       // 招架 500 级
    ["sword", 500],       // 剑法 500 级
    ["unarmed", 500],     // 拳脚 500 级
    // 特殊技能 - 挂载到对应基本技能上
    ["zixiashengong", 500, "force"],      // 紫霞神功 500 级（挂载到内功）
    ["huashanjianfa", 500],               // 华山剑法 500 级（已经是剑法类型）
    ["feiyanhuixiang", 500, "dodge"],     // 飞燕回翔 500 级（挂载到轻功）
    ["poyuquan", 500, ["unarmed", "parry"]] // 破玉拳同时挂载到拳脚和招架
);
```

#### `this.set_objects(...equipment)`

设置 NPC 的初始装备和随身物品。

```typescript
this.set_objects(
    ["obj_path", equip_slot, is_equip],  // 参数3: 1=装备在身上, 0或省略=放入背包
    ...
);
```

参数说明：
- `obj_path`：物品路径（如 `"eq/lv0/jian"`）
- `equip_slot`：装备槽位（存放物品的槽位索引，对装备来说通常为 1）
- `is_equip`：1 表示装备在身上（会加入 `equipment` 数组），0 或省略表示放入背包（`items` 数组）

注意：`set_objects` 的第二个参数是"sub_type"（存储类型/子类型），对于装备来说传入 1 表示"要穿在身上"。第三个参数才是控制是否放入装备栏的标志。

示例：
```typescript
this.set_objects(
    ["eq/lv0/cloth", 1, 1],   // 衣服，装备在身上
    ["eq/lv0/jian", 0, 1],    // 剑，装备在武器位
    ["food/baiji", 0, 0]      // 烧鸡，放在背包里（不装备）
);
```

> 注意：第三个参数为 1 时，物品会放入 `equipment` 数组（按 eq_type 索引）；为 0 时放入 `items` 数组（背包）。

#### `this.set_drop(...drops)`

设置 NPC 的掉落物品表。

```typescript
this.set_drop(
    {obj: "money/silver", min: 5, max: 10},    // 掉落 5-10 个银两
    {obj: ["eq/lv0/jian", "eq/lv0/dao"], odds: 6000},  // 60% 概率随机掉一把剑或刀
    {obj: ["book/book#sword"], odds: 2000},    // 20% 概率掉一本剑法书
    {obj: "sp/bj/wu", odds: 1000}              // 10% 概率掉一个特殊物品
);
```

每个掉落条目支持的字段：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `obj` | `string \| string[]` | 必填 | 物品路径。数组表示随机从中选一个 |
| `odds` | `number` | `10000` | 掉落概率（万分比）。10000=百分之百，5000=百分之五十，1000=百分之十 |
| `min` | `number` | `1` | 最少掉落数量 |
| `max` | `number` | `1` | 最大掉落数量 |
| `fall_obj` | `string` | `undefined` | odds 未命中时掉落的替代物品 |

#### `this.set_goods(...items)`

设置 NPC 出售给玩家的物品（NPC 变为商人）。

```typescript
this.set_goods(
    "eq/lv0/jian",        // 出售铁剑
    "eq/lv0/dao",         // 出售铁刀
    "food/food#0",        // 出售食物
    "food/drink#0"        // 出售饮料
);
```

每个物品路径会被实例化为 `OBJ` 对象，`count` 被设为 `-1`（表示无限库存）。设置后，玩家可以使用 `list` 命令查看商品，使用 `buy` 命令购买。

#### `this.set_chat_msg(items, chance?)`

设置 NPC 的闲聊消息。

```typescript
this.set_chat_msg([
    "钱眼开骄傲的说道：本银号已经有上百年的历史，分店遍布天下各地。",
    "钱眼开说道：昨天我亲自看到一个杀手帮的人来取钱。",
    "钱眼开笑着说道：在本店存钱无利息，存物不收手续费。"
]);
```

参数：
- `items`：闲聊消息字符串数组
- `chance`：（可选）触发概率百分比，当前版本未使用

NPC 的心跳循环中，非战斗状态下随机触发闲聊消息。

#### `this.set_ask(name, func)`

设置 NPC 的询问/回答对话。玩家可以输入 `ask <npc> about <topic>` 来触发。

```typescript
this.set_ask("师傅", function(me) {
    me.notify("铁匠说道：我的师傅早已仙逝，不提也罢。");
});
this.set_ask("生意", function(me) {
    me.notify("铁匠说道：最近生意不好做啊，很少有客人来光顾。");
});
```

参数：
- `name`：询问话题关键词（玩家输入 `ask <npc> about <name>`）
- `func`：回调函数，参数 `me` 为发起询问的玩家角色

设置后，NPC 的交互菜单会自动增加"询问[name]"按钮。

#### `this.add_action(cmd, name, func)`

为 NPC 添加自定义交互命令按钮。

```typescript
this.add_action("zhudian", "住店", function(me) {
    // 处理住店逻辑
    me.notify("店小二说道：客官请进。");
});
```

参数：
- `cmd`：命令字符串（玩家输入的命令前缀）
- `name`：按钮显示的文本，传入 `null` 可以隐藏按钮但仍注册命令
- `func`：回调函数，`this` 绑定为 NPC 对象，第一个参数 `me` 为交互玩家

设置后，NPC 的交互菜单会自动增加一个按钮，点击后执行 `cmd <npc_id>`。

### 5.2 继承自 CHARACTER 的重要方法

#### `this.add_action(cmd, name, func)`

（从 ITEM 继承）添加自定义命令。已在上面说明。

#### `this.random(num)`

（从 BASE 继承）生成 `[0, num)` 范围内的随机整数。

```typescript
this.random(20) + 10;  // 生成 10-29 的随机数
```

通常在属性声明中使用：

```typescript
per = this.random(20) + 10;  // 每次实例化时随机容貌
```

#### `this.call_out(func, delay, arg1?, arg2?)`

（从 BASE 继承）延迟执行，`this` 绑定为当前对象。

```typescript
// 3秒后调用 this.sayHello()
this.call_out(this.sayHello, 3000);
```

#### `this.moveto(room, leave_msg?, enter_msg?, dir?)`

移动 NPC 到指定房间。

```typescript
this.moveto("kezhan/fang1", this.name + "向客店二楼走去。");
```

#### `this.notify(msg)`

向 NPC 自身发送消息（如果是玩家对象则会在客户端显示）。对 NPC 本身调用无效果。

#### `this.send_room(msg, target?, excludeSelf?)`

向 NPC 所在房间的所有玩家广播消息。`$N` = NPC 自身，`$n` = target。

```typescript
this.send_room("$N说道：欢迎光临！");
```

#### `this.send_message(msg, include_me?)`

向房间内所有玩家发送消息。

#### `this.is_fighting()`

判断 NPC 是否在战斗中。

#### `this.is_living()`

判断 NPC 是否存活（hp > 0）。

#### `this.find_obj(oid)`

按 ID 查找物品。

#### `this.each_item(func, parent?)`

遍历子物品。

```typescript
// 遍历房间内所有物品
this.each_item(item => {
    if (item.is_character && item !== this) {
        // 对同房间的每个角色做操作
    }
}, this.environment);
```

#### `this.query_skill(skill_id, default?)`

查询某技能等级（含属性加成）。

#### `this.query_temp(key, default?)`

查询临时数据。

```typescript
const kd = me.query_temp("kezhan");
```

#### `this.set_temp(key, value, duration?)`

设置临时数据（可带过期时间，单位毫秒）。

```typescript
me.set_temp("kezhan", 1, 1000 * 3600 * 24);  // 24小时有效
```

---

## 6. 回调函数参考

回调函数可以直接在 class 中定义为方法（method）。引擎在特定时机自动调用这些方法。

### 6.1 生命周期回调

#### `on_enter(me: CHARACTER)`

当有角色进入 NPC 所在房间时触发。

```typescript
on_enter(me: CHARACTER) {
    var str = "店小二笑咪咪地说道：这位" + me.call() + "，请进请进。";
    me.notify(str);
}
```

#### `on_leave(obj: CHARACTER, dir: string)`

当有角色离开 NPC 所在房间时触发。返回 `false` 可阻止离开。

```typescript
on_leave(me: CHARACTER, dir: string) {
    // 角色离开时的处理
}
```

#### `on_heart_beat(dt: number)`

每帧心跳循环调用。NPC 在非战斗状态下自动回复 hp/mp 和触发闲聊之后调用此回调。

```typescript
on_heart_beat(dt: number) {
    // 自定义心跳逻辑
}
```

### 6.2 死亡回调

#### `on_die(killer?: CHARACTER): boolean | void`

NPC 死亡前调用。返回 `false` 可阻止死亡（此时需要手动把 hp 置为 1）。

```typescript
on_die(killer) {
    // 死亡前的处理
    killer.set_temp("quest/complete", 1);
}

// 覆写 die 阻止死亡（木头人）
die() {
    this.clear_combat_prop();
    this.add_hp(this.max_hp);
    this.send_room('$N身上破损的木头剥落，再次神采奕奕。\n');
    return false;
}
```

#### `on_died(killer: CHARACTER, corpse: CORPSE)`

NPC 死亡后调用。此时尸体已生成，状态已清除。

```typescript
on_died(killer, corpse) {
    // 死亡后的逻辑，如发送公告
}
```

#### `on_kill(killer: CHARACTER)`

当 BOSS/任务 NPC 被击杀时触发（由 world/ 资源文件设置）。

```typescript
on_kill(me: CHARACTER) {
    this.each_item(item => {
        if (item !== this && item.path == this.path && item instanceof CHARACTER) {
            this.send_room("$N喊道：兄弟们并肩子上！");
            item.do_kill(me);
        }
    }, this.environment);
}
```

### 6.3 交互回调

#### `on_master(me: CHARACTER): CHARACTER | boolean | void`

玩家执行 `bai`（拜师）命令时触发。返回 `CHARACTER` 代表指定师傅，返回 `false` 拒绝拜师，返回 `void`/`true` 允许拜师（默认师傅为自己）。

```typescript
on_master(me) {
    if (me.query_skill("huashanxinfa", 0) < 100)
        return me.notify_fail("岳不群说道：你的华山心法掌握程度还不够。");
    if (me.query_skill("huashanjianfa", 0) < 100)
        return me.notify_fail("岳不群说道：你的华山剑法掌握程度还不够。");
    return true;
}
```

#### `on_checkskill(me: CHARACTER): boolean | void`

玩家查看 NPC 可学技能时（`cha` 命令）触发。返回 `false` 阻止查看/学习。

```typescript
on_checkskill(me) {
    if (!me.query_temp("wg_sr")) {
        me.send_room("武馆教习瞄了$N一眼：100两白银，先交钱再学功夫。");
        return me.notify_fail('{type:"cmds",items:{cmd:"give ' + this.id + ' 10000 money",name:"交报名费"}}');
    }
    return true;
}
```

#### `on_teach(me: CHARACTER, skill: string): boolean`

玩家请求学习技能时触发。返回 `false` 阻止学习。

```typescript
on_teach(me, sk) {
    if (!this.is(me.query_temp("master")))
        return me.notify_fail(this.name + "对你说道：请教？这怎么敢当！");
}
```

#### `do_teach(me: CHARACTER, skill, level): boolean`

玩家执行 `xue` 命令学习时触发（教师角色执行时调用）。

#### `on_accept(me: CHARACTER, obj: string, count: number): boolean | void`

玩家 `give`（给予）物品给 NPC 时触发。`obj` 为物品 ID（"money" 代表金钱），`count` 为数量。返回 `true` 表示接受（物品会从玩家身上移除），`false` 或 `void` 表示拒绝。

```typescript
on_accept(me, obj, count) {
    if (obj !== "money") return;
    if (count < 1000) return me.notify_fail("小二面无表情的说道：住店每天10两白银。");
    if (count === 1000) {
        me.set_temp("kezhan", 1, 1000 * 3600 * 24);
        me.send_message("小二一哈腰，说道：多谢您老，客官请楼上歇息。");
        me.moveto("kezhan/fang1", me.name + "向客店二楼走去。");
        return true;
    }
    return false;
}
```

#### `on_sell(me: CHARACTER, obj?, count?): OBJ[]`

玩家查看 NPC 出售列表时触发。返回物品数组。

#### `on_makelove(me): void`

玩家对 NPC 执行双修命令时触发。

#### `on_master_enter(me): void`

主人（master）进入 NPC 所在房间时触发。

### 6.4 战斗相关回调

#### `on_pfm(me: CHARACTER, target: CHARACTER): void`

NPC 自动释放绝招前触发。可在此修改绝招选择逻辑。

#### `on_fight_over(target: CHARACTER, win: boolean): void`

战斗结束时触发。`win` 表示 NPC 是否获胜。

#### `on_damage(attacker: CHARACTER, damage: number): void`

NPC 受到伤害时触发（实际扣血之前）。

### 6.5 对象生命周期回调

#### `on_create(path: string, par?: string): void`

对象创建后触发（资源文件加载/更新时实例化对象时）。在 `create()` 方法末尾调用。

#### `on_clone(): void`

对象克隆后触发（NPC 从模板复制到实际场景时）。在 `clone()` 方法末尾调用。此时对象已完成初始化（满血满蓝、技能已设置、装备已佩戴）。

---

## 7. 在房间中放置 NPC

NPC 定义完成后，需要在房间文件中放置该 NPC 的实例。

### 7.1 使用 `set_npc()` 方法

在房间的构造函数中调用 `set_npc()`：

```typescript
import {ROOM} from "../../core/room/room.js";

export default class extends ROOM {
    name = "有间客栈";
    
    constructor() {
        super();
        this.set_npc("pub/xiaoer");        // 放置 1 个店小二
        this.set_npc(["pub/bing", 2]);     // 放置 2 个官兵
        this.set_npc("pub/xiaoer", ["pub/bing", 2]);  // 混合写法
    }
}
```

参数格式：
- 字符串：`"区域/npc名称"` —— 放置 1 个 NPC
- 数组：`["区域/npc名称", 数量]` —— 放置指定数量的 NPC

### 7.2 NPC 路径映射规则

`set_npc` 中的路径对应 NPC 文件的相对路径（不含 `.ts` 扩展名）：

- `set_npc("pub/xiaoer")` → 加载 `server/res/npc/pub/xiaoer.ts`
- `set_npc("bj/ao/wu")` → 加载 `server/res/npc/bj/ao/wu.ts`
- `set_npc("huashan/yuebuqun")` → 加载 `server/res/npc/huashan/yuebuqun.ts`

### 7.3 带参数 NPC 路径

某些 NPC 支持通过 `#` 参数进行变体：

```typescript
this.set_npc("pub/mpguanli#NONE");     // 无门派的门派管理员
this.set_npc("pub/mpguanli#HUASHAN");  // 华山派的门派管理员
```

参数 `#` 后的字符串会在 NPC 基类的 `create()` 方法中被处理，追加到 `path` 后面。

### 7.4 NPC 复制（深度克隆）

当房间调用 `set_npc()` 时，引擎执行以下步骤：

1. `_NPC.CLONE(obj_path)` 被调用
2. `CHARACTER.GET_BASE(path)` 从 `WORLD.NPC_STROE` 获取 NPC 模板（缓存中不存在时触发懒加载）
3. `Object.create(base)` 创建原型继承实例
4. `clone()` 方法被调用，深度复制 `temp`、`prop`、`skills`、`equipment`、`items`
5. 生成新的唯一 ID
6. 调用 `init()` 初始化技能和装备
7. 调用 `recount()` 重新计算战斗属性
8. `hp` 和 `mp` 被置为满值
9. 设置 `environment = this`（房间引用）
10. `on_clone()` 回调被调用

---

## 8. NPC 的生命周期

### 8.1 启动加载

```
服务器启动
  → loadResource() 遍历 server/res/npc/ 目录
  → 对每个 .js 文件调用 BASE.PRELOAD(fkey, filepath)
  → 动态 import() 加载模块，将构造函数存入 BASE.ITEMS
  → 再次遍历，对每个文件调用 BASE.CREATE(__PATH.NPC, fname)
  → 实例化 NPC 类（调用 constructor → NPC.create()）
  → NPC.create() 调用 CHARACTER.create()
  → WORLD.NPC_STROE.set(this.path, this) 注册模板
```

所以 NPC 的 `constructor()` 在**启动时**被调用一次（模板实例化），而不是每次放置时都被调用。

### 8.2 运行时克隆

```
房间初始化/任务创建
  → NPC.CLONE(path) 或 NPC.CREATE(path, room)
  → CHARACTER.GET_BASE(path) 从 NPC_STROE 获取模板
  → Object.create(base) 创建克隆
  → clone() 深度复制属性、技能、装备
  → init() 初始化 → recount() 计算数值
  → hp = max_hp, mp = max_mp
  → 放入房间
```

### 8.3 死亡与重生

```
NPC 死亡
  → die(killer) 被调用
  → on_die(killer) 回调（返回 false 可阻止死亡）
  → hp = 0, 清除战斗状态
  → 发送死亡消息
  → 创建尸体（CORPSE）
  → 设置 die_room = 当前房间
  → NPC 从房间物品列表移除
  → 触发 WORLD.auto_get（自动拾取）
  → 如果是副本且有 score，增加分数
  → 非副本且 no_refresh=false 且没有 master 且非 shadow 房间：
    设置重生定时器（有 master 60 秒，无 master 300 秒）
  → on_died(killer, corpse) 回调

重生
  → relive() 被调用
  → 获取 die_room 的最新实例
  → 检查房间是否已有同名 NPC，有则跳过
  → NPC.CLONE(this.path) 创建新实例
  → 放入房间
  → dispose() 销毁旧对象
```

### 8.4 心跳

NPC 每帧会调用 `heart_beat(dt)`：
- **非战斗状态**：回复 hp（每次增加 max_hp/2），回复 mp（每次增加 max_mp/2），随机触发闲聊，调用 `on_heart_beat(dt)` 回调
- **战斗状态**：如果 hp <= 0 且没有敌人，重置为存活状态

---

## 9. 分步教程：NPC 类型与完整示例

### 9.1 基础 NPC（最简单结构）

适用场景：不需要交互或战斗的装饰性 NPC。

```typescript
// server/res/npc/pub/guaiweng.ts
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "怪翁";
    desc = "一位白发苍苍的怪老头，正在那里独自垂钓。";
    title = "钓鱼老翁";
    gender = 1;
    age = 78;
    per = this.random(20) + 5;
    hp = 100;
    max_hp = 100;
    mp = 100;
    max_mp = 100;
    no_fight = true;  // 不可战斗
}
```

### 9.2 简单战斗 NPC

适用场景：玩家可以击杀以获得经验和掉落的普通敌人。

```typescript
// server/res/npc/bj/ao/jiading.ts
import {NPC} from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "家将";
    desc = "鳌拜府上的家将，看上去有两下子。";
    gender = 1;
    age = 25;
    per = 15;
    mp = 500;
    max_mp = 500;
    hp = 500;
    max_hp = 500;
    score = 10;  // 击杀获得 10 点副本分数

    constructor() {
        super();
        // 武功配置
        this.skill_map(
            ["club", 150],           // 棍法 150 级
            ["dodge", 150],          // 轻功 150 级
            ["sword", 150],          // 剑法 150 级
            ["parry", 150],          // 招架 150 级
            ["juemengun", 150, ["club", "dodge"]]  // 绝门棍（同时挂载到棍法和轻功）
        );
        // 装备配置
        this.set_objects(
            ["eq/lv1/guanfu", 1, 1],  // 官服
            ["eq/lv0/tiegun", 1, 1]   // 铁棍
        );
        // 掉落配置
        this.set_drop(
            {obj: "money/coin", min: 10, max: 30},  // 必掉 10-30 文钱
            {obj: ["eq/lv0/cloth", "eq/lv0/tiegun", "eq/lv0/shoes"], odds: 3000},  // 30% 掉一件
            {obj: ["book/bc#juemengun"], odds: 3000}  // 30% 掉绝门棍秘籍
        );
    }
}
```

### 9.3 高难度战斗 NPC（BOSS 级）

适用场景：需要组队挑战的强敌。

```typescript
// server/res/npc/gaibang/hongqigong.ts
import {NPC} from "../../../core/char/npc.js";
import {FAMILIES} from "../../../core/skill/family.js";

export default class extends NPC {
    name = "洪七公";
    desc = "他就是传说中的九指神丐，丐帮前任帮主洪七公。";
    title = "九指神丐";
    gender = 1;
    age = 65;
    per = 31;
    max_mp = 1000000;
    max_hp = 1000000;
    str = 30;
    con = 30;
    dex = 30;
    int = 30;
    family = FAMILIES.GAIBANG;
    family_level = 1;
    score = 1000;
    // BOSS 特殊标记
    pfm_rate = 1;  // 每回合必放绝招
    diff_level = 5; // BOSS 难度等级

    constructor() {
        super();
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["blade", 800],
            ["staff", 800],
            ["literate", 800],
            ["hunyuangong", 800, "force"],     // 混元功
            ["dagoubangfa", 800, "staff"],     // 打狗棒法
            ["xianglongshizhang", 800, ["unarmed", "blade"]],  // 降龙十八掌
            ["shexingtui", 800, ["dodge", "unarmed"]]
        );
        this.set_objects(
            ["eq/lv0/cloth", 1, 1]
        );
        // BOSS 级别的属性加成
        this.prop = {
            gj: 8000,
            fy: 3000,
            mz: 5000,
            ds: 4000,
            bj: 30
        };
    }
}
```

### 9.4 商店 NPC 商人

适用场景：可购买物品的商店 NPC。

```typescript
// server/res/npc/yz/ping.ts
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "平一指";
    desc = "他就是江湖上人人敬重的神医平一指。";
    title = "神医";
    gender = 1;
    age = 45;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    no_fight = true;  // 不可战斗

    constructor() {
        super();
        // 出售物品（设置后自动出现"购买"按钮）
        this.set_goods(
            "drug/jinchuang",     // 金疮药
            "drug/huisheng",      // 回生丹
            "drug/manggu",        // 盲骨
            "drug/shiquan",       // 十全大补丸
            "drug/xuanyuan"       // 轩辕丹
        );
    }

    on_accept(me, obj, count) {
        // 接受物品的逻辑（如收购药材）
        if (obj === "drug/cao") {
            me.notify("平一指点一点头说道：这药草成色不错。");
            return true;
        }
    }

    on_enter(me) {
        me.notify("平一指向你点头致意：这位" + me.call() + "，看病还是买药？");
    }
}
```

### 9.5 闲聊 NPC

适用场景：放置在世界中增加氛围的 NPC。

```typescript
// server/res/npc/pub/qian.ts
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "钱眼开";
    desc = "他就是钱庄的老板钱眼开，人称铁公鸡。";
    title = "钱庄老板";
    gender = 1;
    age = 34;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    no_fight = true;

    constructor() {
        super();
        // 随机闲聊消息
        this.set_chat_msg([
            "钱眼开骄傲的说道：本银号已经有上百年的历史，分店遍布天下各地。",
            "钱眼开说道：昨天我亲自看到一个杀手帮的人来取钱。",
            "钱眼开笑着说道：杀手帮重出江湖对本银号来说，真是求之不得呀！",
            "钱眼开笑着说道：在本店存钱无利息，存物不收手续费，客官你看着办吧。"
        ]);
    }
}
```

### 9.6 对话/问答 NPC

适用场景：可以询问信息的 NPC。

```typescript
// server/res/npc/yz/zhu.ts
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "朱先生";
    desc = "一位饱读诗书的老先生，是这座书院的主人。";
    title = "书院先生";
    gender = 1;
    age = 65;
    per = 28;
    hp = 200;
    max_hp = 200;
    mp = 200;
    max_mp = 200;
    no_fight = true;

    constructor() {
        super();
        // 设置询问对话
        this.set_ask("学问", function(me) {
            me.notify("朱先生摸著胡子说道：学问之道，贵在持之以恒。");
        });
        this.set_ask("科举", function(me) {
            me.notify("朱先生叹道：如今世道，科举也是难啊。");
        });
        this.set_ask("读书", function(me) {
            me.notify("朱先生说道：读书百遍，其义自见。");
        });
    }

    on_enter(me) {
        var msg = "";
        switch (this.random(3)) {
            case 0:
                msg = "朱先生微笑道：这位" + me.call() + "，可是来求学的？";
                break;
            case 1:
                msg = "朱先生点点头说道：学而时习之，不亦说乎。";
                break;
            case 2:
                msg = "朱先生放下手中的书卷，看向了你。";
                break;
        }
        me.notify(msg);
    }
}
```

### 9.7 门派师傅 NPC（拜师/学艺）

适用场景：玩家可以拜师学习技能的门派 NPC。

```typescript
// server/res/npc/huashan/yuebuqun.ts
import {NPC} from "../../../core/char/npc.js";
import {FAMILIES} from "../../../core/skill/family.js";

export default class extends NPC {
    name = "岳不群";
    desc = "他就是华山派的现任掌门人，江湖上人称「君子剑」的岳不群。";
    title = "华山派掌门 君子剑";
    gender = 1;
    age = 40;
    per = 33;
    max_mp = 827400;
    max_hp = 891500;
    str = 27;
    con = 27;
    dex = 27;
    int = 27;
    family = FAMILIES.HUASHAN;
    family_level = 1;

    constructor() {
        super();
        // 装备配置
        this.set_objects(
            ["eq/lv0/cloth", 1, 1],
            ["eq/lv0/jian", 1, 1]
        );
        // 技能配置
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["literate", 500],
            ["zixiashengong", 500, "force"],      // 紫霞神功
            ["huashanjianfa", 500],                // 华山剑法
            ["huashanxinfa", 500],                 // 华山心法
            ["feiyanhuixiang", 500, "dodge"],      // 飞燕回翔
            ["huashanquanfa", 500],                // 华山拳法
            ["poyuquan", 500, ["unarmed", "parry"]] // 破玉拳
        );
        // 属性加成
        this.prop = {
            gj: 4000,
            mz: 4000,
            ds: 4000
        };
    }

    // 检查是否可学习（必须是自己徒弟）
    on_teach(me, sk) {
        if (!this.is(me.query_temp("master")))
            return me.notify_fail(this.name + "对你说道：请教？这怎么敢当！");
    }

    // 拜师条件检查
    on_master(me) {
        if (me.query_skill("huashanxinfa", 0) < 100)
            return me.notify_fail("岳不群说道：你的华山心法掌握程度还不够，需要多加练习。");
        if (me.query_skill("huashanjianfa", 0) < 100)
            return me.notify_fail("岳不群说道：你的华山剑法掌握程度还不够，还需多加努力。");
        return true;
    }
}
```

关键点：
- 设置 `family = FAMILIES.HUASHAN` 关联门派
- `on_master()` 回调控制拜师条件（技能等级要求）
- `on_teach()` 回调控制学习权限（只教自己徒弟）
- 必须手动设置所有技能等级，引擎不会根据角色经验自动计算

### 9.8 任务 NPC（含回调交互）

适用场景：配合任务系统，玩家击杀后推进任务进度。

```typescript
// server/res/npc/bj/ao/wu.ts
import {NPC} from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "吴之荣";
    desc = "他原是归安县的知县，因贪赃枉法，百姓恨之切齿。";
    gender = 1;
    age = 44;
    per = 12;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    score = 10;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1]);
        this.skill_map(
            ["dodge", 100],
            ["parry", 100],
            ["force", 100],
            ["unarmed", 100]
        );
        this.set_drop(
            {obj: "money/silver", min: 10, max: 15},
            {obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"], odds: 8000},
            {obj: ["sp/bj/wu"], odds: 1000}
        );
    }

    // 被击杀时设置任务标记
    on_die(killer) {
        killer.set_temp("fb/ao/wu", 1);
    }
}
```

### 9.9 服务 NPC（多步交互）

适用场景：需要多步对话交互的服务类 NPC。

```typescript
// server/res/npc/yz/yayi.ts — 户口登记 NPC（简化版）
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "赵铁笔";
    desc = "他是负责户口登记的，需要离婚、解除师徒关系可以来找他。";
    title = "户口登记";
    gender = 1;
    age = 35;
    per = this.random(20) + 10;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;
    no_fight = true;

    constructor() {
        super();
        this.set_objects(["eq/lv1/guanfu", 1, 1]);
        // 注册自定义命令按钮
        this.add_action("divorce", "离婚", this.on_divorce);
        this.add_action("unteacher", "解除师徒", this.on_unteacher);
    }

    on_divorce(me, par) {
        me.notify("赵铁笔说道：离婚需要双方同意，请带你的配偶一起来。");
    }

    on_unteacher(me, par) {
        me.notify("赵铁笔说道：解除师徒关系需要缴纳手续费。");
    }

    on_accept(me, obj, count) {
        if (obj !== "money") return false;
        if (count === 10000000) {  // 1000 两黄金
            me.notify("赵铁笔说道：你的师徒关系已经解除了。");
            // 执行解除逻辑...
            return true;
        }
        me.notify_fail("赵铁笔说道：费用不够。");
        return false;
    }
}
```

### 9.10 训练用 NPC（木头人）

适用场景：玩家测试伤害/练习武功的 NPC。

```typescript
// server/res/npc/pub/muren.ts
import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "木头人";
    desc = "这是一个木头做的假人，用来测试伤害的。";
    gender = 1;
    age = 10;
    per = 43;
    mp = 60;
    max_mp = 60;
    hp = 99999999;      // 极高的血量
    max_hp = 99999999;
    str = 1;
    con = 1;
    dex = 1;
    int = 1;
    no_fight = false;   // 可攻击（默认）

    // 覆写 die() 方法，防止死亡
    die() {
        this.clear_combat_prop();
        this.add_hp(this.max_hp);
        this.send_room('$N身上破损的木头剥落，再次神采奕奕，精气十足。\n');
        return false;  // 返回 false 阻止默认死亡处理
    }
}
```

---

## 10. 通用属性属性映射 (prop)

`prop` 是 NPC 的属性加成映射，在 `recount()` 时被计算。常用于给战斗 NPC 增加额外属性。

```typescript
prop = {
    gj: 4000,      // 攻击力 +4000
    fy: 2000,      // 防御力 +2000
    mz: 3000,      // 命中 +3000
    ds: 2000,      // 闪避 +2000
    zj: 1500,      // 招架 +1500
    bj: 20,        // 暴击率 +20%
    gjsd: 500,     // 攻击速度 +500
    hp_per: 50,    // 气血百分比 +50%
    mp_per: 50,    // 内力百分比 +50%
    gj_per: 20,    // 攻击力百分比 +20%
};
```

### 完整的 prop 键名列表

| 键 | 类型 | 说明 |
|----|------|------|
| `str` | 臂力 | 基础属性 |
| `con` | 根骨 | 基础属性 |
| `dex` | 身法 | 基础属性 |
| `int` | 悟性 | 基础属性 |
| `per` | 容貌 | 基础属性 |
| `kar` | 福缘 | 基础属性 |
| `hp` | 气血 | 当前气血 |
| `max_hp` | 最大气血 | 最大气血 |
| `mp` | 内力 | 当前内力 |
| `max_mp` | 最大内力 | 最大内力 |
| `gj` | 攻击力 | 物理攻击 |
| `fy` | 防御力 | 物理防御 |
| `mz` | 命中 | 命中率 |
| `ds` | 躲闪 | 闪避率 |
| `zj` | 招架 | 招架率 |
| `bj` | 暴击 | 暴击率百分比 |
| `gjsd` | 攻击速度 | 攻击间隔（毫秒） |
| `hp_per` | 气血百分比 | 血量百分比加成 |
| `mp_per` | 内力百分比 | 内力百分比加成 |
| `gj_per` | 攻击百分比 | 攻击百分比加成 |
| `fy_per` | 防御百分比 | 防御百分比加成 |
| `mz_per` | 命中百分比 | 命中百分比加成 |
| `ds_per` | 躲闪百分比 | 躲闪百分比加成 |
| `zj_per` | 招架百分比 | 招架百分比加成 |
| `bj_per` | 暴击百分比 | 暴击百分比加成 |
| `exp_per` | 经验百分比 | 经验获取加成 |
| `diff_sh_per` | 免伤百分比 | 伤害减免 |
| `diff_fy_per` | 破防百分比 | 忽视防御 |
| `add_sh_per` | 最终伤害 | 最终伤害百分比 |
| `add_bjsh_per` | 暴击伤害 | 暴击伤害百分比 |
| `auto_hp` | 自动回血 | 每秒自动回血 |
| `auto_mp` | 自动回内 | 每秒自动回内 |

---

## 11. 技能系统详解

### 11.1 基本技能类型

MUD 的基本技能类型（武器类型）：

| 技能 ID | 类型 | 说明 |
|---------|------|------|
| `force` | 内功 | 提供内力上限和内力护体 |
| `dodge` | 轻功 | 提供闪避能力 |
| `parry` | 招架 | 提供招架能力 |
| `unarmed` | 拳脚 | 空手攻击技能 |
| `sword` | 剑法 | 剑类武器技能 |
| `blade` | 刀法 | 刀类武器技能 |
| `staff` | 杖法 | 杖类武器技能 |
| `club` | 棍法 | 棍类武器技能 |
| `whip` | 鞭法 | 鞭类武器技能 |
| `throwing` | 暗器 | 暗器类技能 |
| `bite` | 撕咬 | 怪物专用攻击技能 |
| `literate` | 读书 | 辅助技能（非战斗） |

### 11.2 skill_map 格式详解

```typescript
// 格式 1：基本技能
["skill_id", level]

// 格式 2：特殊技能挂载到一个基本技能
["skill_id", level, "base_skill"]

// 格式 3：特殊技能挂载到多个基本技能
["skill_id", level, ["base_1", "base_2"]]
```

**格式 1（基本技能）**：
```typescript
["force", 500]  // 内功 500 级，自动挂载到 force 槽位
```

**格式 2（特殊技能）**：
```typescript
["zixiashengong", 500, "force"]  // 紫霞神功 500 级，挂载到 force
```

第三个参数指定此特殊技能挂载到哪个基本技能槽位。挂载后，战斗时使用对应的基本技能（如 force）会使用此特殊技能的属性和绝招。

**格式 3（多槽位挂载）**：
```typescript
["poyuquan", 500, ["unarmed", "parry"]]
```

破玉拳同时挂载到拳脚和招架，意味着空手战斗时用它攻击，招架时也用它格挡。

### 11.3 技能等级与战斗力的关系

- **基本技能**等级影响对应战斗属性的计算（如 `dodge` 等级影响 `ds` 值）
- **特殊技能**等级在 `enable`（挂载）后替代对应的基本技能
- 技能等级通过 `recount()` 方法计算战斗属性
- NPC 的等级（`level` 字段：0-6）影响展示效果，不直接影响战斗力

### 11.4 关于基本技能的特殊技能

特殊技能（如紫霞神功、华山剑法）必须挂载到一个基本技能槽位才能生效。一个 NPC 必须有基本技能才能正常战斗，特殊技能提供更强的属性和绝招。

```typescript
// 正确的写法：基本技能 + 特殊技能
this.skill_map(
    ["force", 500],                    // 基本内功
    ["dodge", 500],                    // 基本轻功
    ["zixiashengong", 500, "force"],   // 特殊内功挂载到 force
    ["feiyanhuixiang", 500, "dodge"]   // 特殊轻功挂载到 dodge
);
```

---

## 12. 掉落系统详解

### 12.1 set_drop 格式

```typescript
this.set_drop(
    entry1,
    entry2,
    ...
);
```

### 12.2 掉落条目配置

每个掉落条目是一个对象，支持以下字段：

#### 基本格式
```typescript
{
    obj: "item/path",     // 物品路径
    odds: 5000,           // 掉落概率，万分比（可选，默认 10000=必掉）
    min: 1,               // 最小数量（可选，默认 1）
    max: 3                // 最大数量（可选，默认 1）
}
```

#### 随机选择格式（从数组中选择一个）
```typescript
{
    obj: ["eq/lv0/jian", "eq/lv0/dao", "eq/lv0/cloth"],  // 随机掉落其中一件
    odds: 6000            // 60% 概率触发此条目
}
```

#### 带保底的格式
```typescript
{
    obj: "sp/boss/rare_item",
    odds: 2000,            // 20% 概率掉落稀有物品
    fall_obj: "money/gold" // 如果未命中，至少给一个金币
}
```

### 12.3 物品路径示例

| 路径 | 说明 |
|------|------|
| `money/coin` | 铜钱 |
| `money/silver` | 白银 |
| `money/gold` | 黄金 |
| `eq/lv0/jian` | 铁剑 |
| `eq/lv0/dao` | 铁刀 |
| `eq/lv0/cloth` | 布衣 |
| `eq/lv0/shoes` | 布鞋 |
| `eq/lv1/guanfu` | 官服 |
| `eq/lv1/junfu` | 军服 |
| `book/book#sword` | 剑法秘籍 |
| `book/bc#skill_id` | 某技能秘籍 |
| `drug/jinchuang` | 金疮药 |
| `sp/bj/wu` | 特殊任务物品 |

### 12.4 掉落判定流程

```
NPC 死亡
  → query_drop() 被调用
  → 遍历 drop_list 中的每个条目
  → 对每个条目：random(10000) < odds 则命中
  → 命中的条目：按路径创建 OBJ，数量在 [min, max] 间随机
  → 如有 fall_obj 且 odds 未命中，则掉落 fall_obj
  → 所有生成的物品放入尸体
```

---

## 13. 装备配置详解

### 13.1 set_objects 格式

```typescript
this.set_objects(
    ["item_path", sub_type, is_equip],
    ...
);
```

- `item_path`：物品路径
- `sub_type`：子类型/槽位索引。装备时穿在哪一栏
- `is_equip`：1=装备在身上（加入 equipment 数组），0 或省略=放入背包

### 13.2 装备槽位 (EQUIP_TYPE) 对照表

| 索引 | 类型 | 说明 |
|------|------|------|
| 0 | `WEAPON` | 武器 |
| 1 | `CLOTH` | 衣服/护甲 |
| 2 | `SHOES` | 鞋子 |
| 3 | `HEAD` | 头部/头盔 |
| 4 | `CAPE` | 披风 |
| 5 | `RING` | 戒指 |
| 6 | `NECKLACE` | 项链 |
| 7 | `JEWELS` | 饰品 |
| 8 | `WRIST` | 护腕 |
| 9 | `WAIST` | 腰带 |
| 10 | `THROWING` | 暗器 |

### 13.3 装备示例

```typescript
// 穿官服、拿铁棍
this.set_objects(
    ["eq/lv1/guanfu", 1, 1],  // 槽位1=衣服
    ["eq/lv0/tiegun", 1, 1]   // 槽位0=武器（但这里写 1，实际的 eq_type 由物品自身定义）
);
```

> 注意：`set_objects` 的第二个参数是 `sub_type`，不是 `EQUIP_TYPE`。第三个参数为 1 表示物品需要被佩戴（`equip` 状态），此时物品会按自身的 `eq_type` 放入 `equipment` 数组对应位置。

---

## 14. 消息颜色标记参考

在消息文本中使用颜色标记：

| 标记 | 颜色 | 示例 |
|------|------|------|
| `<red>` | 红色 | `<red>警告！</red>` |
| `<hir>` | 亮红色 | `<hir>危险！</hir>` |
| `<hig>` | 亮绿色 | `<hig>你获得了经验。</hig>` |
| `<hiy>` | 亮黄色 | `<hiy>发现宝物！</hiy>` |
| `<hiz>` | 亮青色 | `<hiz>特殊效果</hiz>` |
| `<hio>` | 亮橙色 | `<hio>稀有物品</hio>` |
| `<wht>` | 白色 | `<wht>普通物品</wht>` |
| `<yel>` | 黄色 | `<yel>注意</yel>` |
| `<cyn>` | 青色 | `<cyn>提示信息</cyn>` |
| `<mag>` | 紫色/洋红 | `<mag>神秘力量</mag>` |
| `<blu>` | 蓝色 | `<blu>水系效果</blu>` |
| `<grn>` | 绿色 | `<grn>自然之力</grn>` |

文本中的 `$N` 会被替换为 NPC 自己的名称，`$n` 被替换为目标角色的名称，`$P` 被替换为对方的所有格。

---

## 15. 常见陷阱与注意事项

### 15.1 `constructor` 中必须调用 `super()`

```typescript
constructor() {
    super();  // 必须调用
    // 然后设置方法
}
```

### 15.2 class fields 中的 `this.random()` 在模板实例化时执行

```typescript
per = this.random(20) + 10;
```

这行代码在**服务器启动时**执行一次（模板实例化），而不是在每次 NPC 放置到房间时执行。所有放置在房间的克隆体共享相同的随机值。

如果需要每次放置时都随机，应该在 `on_clone()` 中设置：

```typescript
// 在 class fields 中声明但不要赋值
per = 0;

// 在 on_clone 中动态生成
on_clone() {
    this.per = this.random(20) + 10;
}
```

### 15.3 `name` 和 `desc` 是必填字段

虽然 TypeScript 声明为 `string!`（非空断言），但在运行时**必须**赋值，否则会导致显示异常。

### 15.4 `skill_map` 中技能 ID 必须存在

`skill_map` 中的每个 `skill_id` 必须在技能资源文件中有对应的定义。如果技能不存在，控制台会输出警告 `技能 ID: xxx 不存在`，但不会中断 NPC 加载。

### 15.5 注意装备的 `is_equip` 参数

`set_objects` 的第三个参数为 1 时物品才会装备到身上。如果只设置 0，物品放入背包但不生效（不会增加战斗属性）。

```typescript
// 正确：装备武器
this.set_objects(["eq/lv0/dao", 0, 1]);
// 错误：物品只在背包里，不提供属性
this.set_objects(["eq/lv0/dao", 0, 0]);
```

### 15.6 NPC 的 `no_fight` 影响交互菜单

当 `no_fight = true` 时，玩家交互菜单中的"比试"和"击杀"按钮会自动隐藏。

### 15.7 `on_master` 与 `on_checkskill` 配合使用

如果定义了 `on_master` 回调，交互菜单会自动添加"拜师"按钮。如果同时定义了 `on_checkskill` 或 `on_master`，还会添加"学习"按钮。

### 15.8 `set_goods` 和 `set_drop` 使用不同的物品路径格式

- `set_goods` 使用裸路径字符串：`"eq/lv0/jian"`
- `set_drop` 使用 `{obj: "path"}` 对象格式
- 两者路径规则相同，但 `set_drop` 支持随机选择数组和概率

### 15.9 不要在 class fields 中声明 `path`

`path` 属性由引擎自动设置（在 `create()` 中），手动设置会被覆盖。

### 15.10 不要忘记导出的类必须是 `default export`

```typescript
export default class extends NPC {  // 正确
}

export class MyNPC extends NPC {    // 错误！引擎只读 mod.default
}
```

---

## 16. 热更新与调试

### 16.1 查看 NPC 加载状态

服务器启动时，控制台会输出：

```
preload server/res/npc/ ... 42      // 预加载了 42 个 NPC 文件
...
server/res/npc/ ... 42               // 创建了 42 个 NPC 模板
```

### 16.2 热更新 NPC 文件

当 NPC 文件修改后，无需重启服务器。使用管理员命令：

```
# 更新单个 NPC
update npc/pub/xiaoer

# 或者简化写法（如果 NPC 在当前房间）
update npc pub/xiaoer
```

热更新流程：
1. `BASE.UPDATE(__PATH.NPC, "pub/xiaoer")` 重新动态导入编译后的 JS 文件（带 `?update=时间戳` 缓存破坏）
2. 新构造函数替换 `BASE.ITEMS` 中的旧构造函数
3. `BASE.CREATE(__PATH.NPC, "pub/xiaoer")` 实例化新模板
4. `NPC.create()` → `CHARACTER.create()` → `WORLD.NPC_STROE.set(this.path, this)` 更新缓存
5. 如果管理员在 NPC 所在的房间，旧 NPC 被销毁，`NPC.CREATE(path, room)` 创建新实例

### 16.3 使用 `update` 命令重新放置 NPC

```update
# 先更新 NPC 模板，再强制刷新当前房间的副本
update npc/pub/xiaoer   # 更新模板
# 然后离开再进入房间，或让管理员重载房间来刷新 NPC
```

### 16.4 调试技巧

#### 使用 `on_clone()` 验证实例化

```typescript
on_clone() {
    console.log("NPC " + this.name + " 已克隆到 " + this.environment?.path);
}
```

#### 使用 `on_heart_beat()` 调试心跳

```typescript
on_heart_beat(dt) {
    console.log(this.name + " 心跳: hp=" + this.hp + "/" + this.max_hp);
}
```

#### 在 NPC 中添加调试命令

```typescript
constructor() {
    super();
    this.add_action("debug", "调试", function(me) {
        me.notify("NPC调试信息：");
        me.notify("  HP: " + this.hp + "/" + this.max_hp);
        me.notify("  ＞B: " + this.gj + "/防:" + this.fy);
        me.notify("  技能数: " + (this.skills ? this.skills.size : 0));
    });
}
```

### 16.5 使用 `WORLD.NPC_STROE` 检查已加载的 NPC

在服务器控制台或通过 `eval` 命令（需管理员权限）：

```typescript
// 查看所有已加载的 NPC 路径
Array.from(WORLD.NPC_STROE.keys()).forEach(k => console.log(k));

// 查看特定 NPC 模板
const npc = WORLD.NPC_STROE.get("pub/xiaoer");
console.log(npc.name, npc.path);
```

### 16.6 注意事项

- **编译**：NPC 文件是 TypeScript，修改后需要先编译成 JS 才能热更新。或者使用 ts-node 直接运行。
- **缓存**：Node.js 的模块缓存可能影响热更新。引擎使用 `?update=时间戳` 参数强制重新加载。
- **数据丢失**：热更新只会影响新创建的 NPC 实例。已经在房间中的旧 NPC 实例不会自动刷新——它们仍然是旧模板的 `Object.create` 实例。
