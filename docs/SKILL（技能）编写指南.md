# SKILL（技能）编写指南

> 本文档面向需要在游戏服务端中添加或修改技能（SKILL）的开发者。  
> 阅读本文档前，请确保你对 TypeScript 的 `class`、`extends`、`import/export` 语法有基本了解。  
> **读完本文档，你应当能自主编写一个带绝招（perform）且能正常加载运转的完整技能。**

---

## 目录

1. [概述](#1-概述)
2. [文件路径与组织规范](#2-文件路径与组织规范)
3. [技能基类 SKILL 速览](#3-技能基类-skill-速览)
4. [技能类型 SKILL_TYPES](#4-技能类型-skill_types)
5. [标准导入模板](#5-标准导入模板)
6. [基础技能（BASE）编写](#6-基础技能base编写)
   - 6.1 基本内功 (force)
   - 6.2 基本剑法 (sword) — 带绝招
   - 6.3 基本刀法 (blade)
   - 6.4 基本招架 (parry) — 动作描述
   - 6.5 基本轻功 (dodge)
   - 6.6 基本拳脚 (unarmed)
   - 6.7 基本棍法 / 杖法 / 鞭法 / 暗器
7. [特殊技能（SKILL）编写](#7-特殊技能skill编写)
   - 7.1 基础模板
   - 7.2 属性字段详解
   - 7.3 query_prop — 基础属性加成
   - 7.4 query_enable_prop — 装备属性加成
   - 7.5 learn_condition — 学习条件
   - 7.6 can_enables — 可装备类型
8. [内功技能（Force）](#8-内功技能force)
9. [轻功技能（Dodge）](#9-轻功技能dodge)
10. [知识技能（KNOWLEDGE）](#10-知识技能knowledge)
11. [战斗动作描述（$占位符系统）](#11-战斗动作描述占位符系统)
12. [绝招（PERFORM）编写](#12-绝招perform编写)
    - 12.1 基础结构
    - 12.2 单次攻击型绝招
    - 12.3 多段攻击型绝招（循环）
    - 12.4 先读消息型（msgs + call_interval）
    - 12.5 Buff 型绝招（add_status）
    - 12.6 Debuff 型绝招（附加忙乱状态）
    - 12.7 带回调的绝招（on_parry）
    - 12.8 特殊用途绝招（非伤害）
    - 12.9 出招时间与冷却减免覆盖
13. [战斗回调 hook 详解](#13-战斗回调-hook-详解)
    - 13.1 攻击阶段回调
    - 13.2 防御阶段回调
    - 13.3 特殊回调
14. [do_attack 参数详解](#14-do_attack-参数详解)
15. [add_status 状态系统](#15-add_status-状态系统)
16. [临时数据（temp）操作规范](#16-临时数据temp操作规范)
17. [PropMap 属性大全](#17-propmap-属性大全)
18. [完整示例：华山剑法](#18-完整示例华山剑法)
19. [完整示例：丐帮降龙十八掌](#19-完整示例丐帮降龙十八掌)
20. [完整示例：自创门派技能](#20-完整示例自创门派技能)
21. [常见问题与调试](#21-常见问题与调试)

---

## 1. 概述

游戏中的技能系统分为三个层次：

| 层次 | 说明 | 举例 |
|------|------|------|
| **基础技能 (BASE)** | 所有特殊技能的根基。玩家必须先学会基础技能，才能学习对应的特殊技能。`type = SKILL_TYPES.BASE` | 基本内功、基本剑法、基本轻功 |
| **特殊技能 (SKILL)** | 门派或公共的武功招式，可以装备到基础技能上提供属性加成和绝招。`type = SKILL_TYPES.SKILL` | 独孤九剑、降龙十八掌、紫霞神功 |
| **知识技能 (KNOWLEDGE)** | 非战斗技能，提供生活或辅助功能。`type = SKILL_TYPES.KNOWLEDGE` | 读书写字、炼药术 |

所有技能文件都放在 `server/res/skill/` 目录下，按类别组织子目录。

---

## 2. 文件路径与组织规范

```
server/res/skill/
├── base/                    # 基础技能（系统内置，共11个）
│   ├── force.ts             # 基本内功
│   ├── dodge.ts             # 基本轻功
│   ├── parry.ts             # 基本招架
│   ├── sword.ts             # 基本剑法
│   ├── blade.ts             # 基本刀法
│   ├── club.ts              # 基本棍法
│   ├── staff.ts             # 基本杖法
│   ├── whip.ts              # 基本鞭法
│   ├── unarmed.ts           # 基本拳脚
│   ├── throwing.ts          # 基本暗器
│   └── bite.ts              # 噬咬（怪物专用）
├── huashan/                 # 华山派技能
│   ├── dugujiujian.ts       # 独孤九剑
│   ├── huashanjianfa.ts     # 华山剑法
│   ├── zixiashengong.ts     # 紫霞神功
│   ├── feiyanhuixiang.ts    # 飞燕回翔
│   ├── huashanquanfa.ts     # 华山拳法
│   ├── huashanxinfa.ts      # 华山心法
│   ├── poyuquan.ts          # 破玉拳
│   ├── kuangfengkuaijian.ts # 狂风快剑
│   └── ...
├── gaibang/                 # 丐帮技能
│   ├── dagoubang.ts         # 打狗棒法
│   ├── xianglongzhang.ts    # 降龙十八掌
│   ├── huntianqigong.ts     # 混天气功
│   ├── gaibangxinfa.ts      # 丐帮心法
│   ├── xiaoyaoyou.ts        # 逍遥游
│   └── jiaohuabangfa.ts     # 叫花棒法
├── knowage/                 # 知识技能
│   ├── literate.ts          # 读书写字
│   └── lianyao.ts           # 炼药术
├── wudang/                  # 武当派
├── shaolin/                 # 少林派
├── emei/                    # 峨眉派
├── ...                      # 其他门派
```

**命名规范：**
- 文件名使用小写英文字母 + 下划线（如 `huashanjianfa.ts`、`feiyanhuixiang.ts`）
- 技能 ID（`id` 字段）与文件名保持一致，不含扩展名
- 每个文件 `export default class extends SKILL`（匿名类）

---

## 3. 技能基类 SKILL 速览

`SKILL` 继承自 `BASE`，定义在 `server/core/skill/skill.ts`。

**核心字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 技能唯一标识，与文件名一致 |
| `name` | `string` | 技能显示名称 |
| `type` | `number` | `SKILL_TYPES.BASE(0)` / `SKILL_TYPES.SKILL(1)` / `SKILL_TYPES.KNOWLEDGE(2)` |
| `grade` | `number` | 品级 0-6（0=基本，1=普通，2=高级，3=稀有，4=绝世，5=神功，6=无上） |
| `score` | `number` | 技能评分 |
| `desc` | `string` | 技能描述文本 |
| `can_enables` | `string[]` | 可装备的基础技能类型列表 |
| `family?` | `FAMILY` | 所属门派 |
| `learn_condition?` | `LearnCondition` | 学习条件 |
| `source_skill?` | `string` | 进阶来源技能 ID |
| `is_ultimate?` | `boolean` | 是否为终极技能 |
| `is_hidden?` | `boolean` | 是否从列表隐藏 |
| `is_custom?` | `boolean` | 是否为自创武功 |
| `lianxi_level?` | `number` | 可练习的最低等级 |
| `force_rad?` | `number` | 内功转气血比例（内功专用） |
| `attack_actions` | `string[]` | 攻击动作描述数组 |
| `dodge_actions` | `string[]` | 闪避动作描述数组 |
| `parry_actions` | `string[]` | 招架动作描述数组 |
| `weapon_vs_weapon_actions` | `string[]` | 武器对武器招架描述 |
| `weapon_vs_unarmed_actions` | `string[]` | 武器对空手招架描述 |
| `unarmed_vs_weapon_actions` | `string[]` | 空手对武器招架描述 |
| `pfm_set` | `PerformData` | 绝招字典（原始定义） |
| `pfm` | `Record<string, PERFORM>` | 绝招字典（运行时实例） |

**核心方法：**

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `query_prop(lv, me?)` | `PropMap \| undefined` | 技能基础属性加成 |
| `query_enable_prop(lv, me?)` | `EnablePropMap \| undefined` | 装备到基础技能时的属性加成 |
| `on_enable?(me, type)` | `boolean \| void` | 激活技能时回调，返回 `false` 阻止 |
| `on_disenable(me, type)` | `void` | 取消激活时回调 |
| `on_learn(me)` | `boolean \| void` | 学习前回调，返回 `false` 阻止 |
| `on_practice?(me)` | `boolean \| void` | 练习前回调，返回 `false` 阻止 |
| `do_practice?(me, lv)` | `boolean \| void` | 每次练习提升时回调 |
| `set_default(type)` | `void` | 设置为某基础类型的默认技能 |

---

## 4. 技能类型 SKILL_TYPES

```typescript
import { SKILL_TYPES } from "../../../core/const.js";

SKILL_TYPES.BASE      // = 0  基础技能（基本内功、基本剑法...）
SKILL_TYPES.SKILL     // = 1  特殊技能（独孤九剑、紫霞神功...）
SKILL_TYPES.KNOWLEDGE // = 2  知识技能（读书写字、炼药术...）
```

- **BASE** 类型必须调用 `this.set_default(this.id)` 注册为默认技能
- **SKILL** 类型需要设置 `can_enables` 指明其可装备的基础技能类型
- **KNOWLEDGE** 类型不需要 `can_enables`，也不需要战斗相关字段

---

## 5. 标准导入模板

```typescript
// 核心导入
import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";

// 如果技能归属门派
import {FAMILIES} from "../../../core/skill/family.js";

// 类型导入（只用于类型标注，编译时被擦除）
import type { PropMap } from "../../../types/props.js";
import type {PerformData, EnablePropMap, LearnCondition } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";
```

**路径计算规则：**
- 从 `server/res/skill/{category}/{name}.ts` 到 `server/core/`:
  - 一级目录：`../../../core/...`
  - 二级目录（如 `huashan/`）：`../../core/...`
  - 如果以后调整路径，按实际层级调整 `../` 数量

**注意：** 路径中的扩展名 `.js` 不可省略，即使源文件是 `.ts`。

### 5.1 类型标注与 temp 操作

> **类型标注、temp 操作方法等通用约束详见 [全局开发约束.md](全局开发约束.md)。**

SKILL 中需特别注意：`learn_condition` 标注 `LearnCondition`、`pfm_set` 标注 `PerformData`；`query_prop`/`query_enable_prop` 覆写方法标注参数和返回类型；`pfm_set` 回调函数标注参数类型。

---

## 6. 基础技能（BASE）编写

基础技能是系统的基石，每个基础技能都必须调用 `this.set_default(this.id)` 来注册为全局默认。

### 6.1 基本内功 (force)

**文件位置：** `server/res/skill/base/force.ts`

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "基本内功";
    id = "force";
    grade = 0;
    type = SKILL_TYPES.BASE;
    desc = "内功的基础功法，坚持锻炼会增强体质。每10级增加1点后天根骨，增加内力上限";

    query_prop(lv: number): PropMap {
        return {
            con: Math.floor(lv / 10),
            limit_mp: 100 + lv * 5,
            desc: "唯一：将你内力的10%转化为气血"
        };
    }

    constructor() {
        super();
        this.set_default(this.id);
    }
}
```

**要点：**
- `grade = 0` 是所有基础技能的固定品级
- `type = SKILL_TYPES.BASE` 标记为基础技能
- `constructor` 中必须调用 `this.set_default(this.id)`
- `query_prop` 返回该技能提供的固定属性加成，不依赖是否装备
- 内功专用字段 `force_rad`（气血转化比例）在特殊内功上设置，基础内功不需要

### 6.2 基本剑法 (sword) — 带绝招

**文件位置：** `server/res/skill/base/sword.ts`

```typescript
import {PERFORM, SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "sword";
    name = "基本剑法";
    grade = 0;
    type = SKILL_TYPES.BASE;
    attack_actions = [
        "$N用$W往$n的$l刺去",
        "$N用$W往$n的$l砍去",
        "$N挥动$W,斩向$n的$l"
    ];
    desc = "剑法类技能的基础功法，磨练你的技巧，坚持锻炼会增加你自身的命中";

    query_prop(lv: number, me: CHARACTER): PropMap {
        return {mz: lv};
    }

    constructor() {
        super();
        this.set_default(this.id);
        // 基础技能也可以有绝招
        this.set_pfm_data("lian", {
            name: "连击",
            distime: 5,
            mp: 5,
            weapon_type: WEAPON_TYPE.SWORD,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var msg = "<hig>$N加快速度，手中的$W快速向$n刺去</hig>";
                me.send_room(msg, target);
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz
                });
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return "快速对敌人攻击两次";
            }
        });
    }
}
```

**要点：**
- `attack_actions` 是数组，每个元素是一个带 `$` 占位符的描述模板，战斗中随机选取
### 6.3 基本刀法 (blade)

```typescript
import {PERFORM, SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "blade";
    name = "基本刀法";
    type = SKILL_TYPES.BASE;
    grade = 0;
    desc = "刀法类武功的基础功法，坚持锻炼会使你的技巧熟练，增加自身的命中";
    attack_actions = [
        "$N用$W往$n的$l刺去",
        "$N用$W往$n的$l砍去",
        "$N挥动$W,斩向$n的$l"
    ];

    constructor() {
        super();
        this.set_default(this.id);
        this.set_pfm_data("zhan", {
            name: "斩击",
            distime: 5000,
            mp: 5,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var msg = "<hic>$N看$n露出破绽，挥动$W斩向$n的$l</hic>";
                var gj = 10 + lv;
                me.do_attack({
                    target: target,
                    gj: me.gj + gj,
                    mz: me.mz,
                    attack_msg: msg
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var gj = 10 + lv;
                return "强力的一击，对敌人造成基本攻击附加" + gj + "的伤害。";
            }
        });
    }

    query_prop(lv: number, me: CHARACTER): PropMap {
        return {mz: lv};
    }
}
```

### 6.4 基本招架 (parry)

招架技能不设 `attack_actions`，而是提供多组招架动作：

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "parry";
    name = "基本招架";
    grade = 0;
    type = SKILL_TYPES.BASE;
    weapon_vs_weapon_actions = [
        "只听见「锵」一声，被$p用手中$i格开了。",
        "结果「当」地一声被$p挡开了。",
        "但是被$n用手中$i架开。",
        "但是$n身子一侧，用手中$i格开。"
    ];
    parry_actions = [
        "但是被$p格开了。",
        "结果被$p挡开了。"
    ];
    unarmed_vs_weapon_actions = [
        "但是被$p轻轻一推，$w失了准头，和$p的$l偏了几寸。",
        "$p往$N的手腕轻轻一按，结果$w偏向一边。"
    ];
    desc = "招架类技能的基础功法，坚持锻炼会提高你的招架能力";

    query_prop(lv: number): PropMap {
        return {zj: lv};
    }

    constructor() {
        super();
        this.set_default(this.id);
    }
}
```

### 6.5 基本轻功 (dodge)

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "dodge";
    name = "基本轻功";
    grade = 0;
    desc = "轻功的基础功法，坚持锻炼会身轻如燕。每10级增加1点后天身法";
    type = SKILL_TYPES.BASE;
    dodge_actions = [
        "但是和$p$l偏了几寸。",
        "但是被$p机灵地躲开了。",
        "但是$n身子一侧，闪了开去。",
        "但是被$p及时避开。",
        "但是$n已有准备，不慌不忙的躲开。"
    ];

    query_prop(lv: number): PropMap {
        return {dex: Math.floor(lv / 10)};
    }

    constructor() {
        super();
        this.set_default(this.id);
    }
}
```

### 6.6 基本拳脚 (unarmed)

```typescript
import {PERFORM, SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "unarmed";
    name = "基本拳脚";
    type = SKILL_TYPES.BASE;
    grade = 0;
    desc = "拳脚类武功的基础功法，坚持锻炼必成大器。每10级会增加1点后天臂力";
    attack_actions = [
        "$N挥拳攻击$n的$l",
        "$N往$n的$l一抓",
        "$N往$n的$l狠狠地踢了一脚",
        "$N提起拳头往$n的$l捶去",
        "$N对准$n的$l用力挥出一拳"
    ];

    query_prop(lv: number): PropMap {
        return {str: Math.floor(lv / 10)};
    }

    constructor() {
        super();
        this.set_default(this.id);
        this.set_pfm_data("zhong", {
            name: "重击",
            distime: 5000,
            mp: 5,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var msg = "<hig>$N看准时机，双拳蓄力对准$n的$l用力砸去</hig>";
                var gj = 10 + lv;
                me.do_attack({
                    target: target,
                    gj: me.gj + gj,
                    mz: me.mz,
                    attack_msg: msg,
                    no_weapon: true
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var gj = 10 + lv;
                return "强力的一击，对敌人造成基本攻击附加" + gj + "的伤害。";
            }
        });
    }
}
```

### 6.7 其他基础技能简写

**基本棍法 (club)：** `query_prop` 返回 `{zj: lv}`，`attack_actions` 用"捅""敲""扫"等动词  
**基本杖法 (staff)：** 类似棍法  
**基本鞭法 (whip)：** `query_prop` 返回 `{mz: lv}`，`attack_actions` 用"抽""甩""扫"等动词  
**基本暗器 (throwing)：** `query_prop` 返回 `{mz: lv}`，`attack_actions` 用 `$T`（暗器名）而不是 `$W`（武器名）

**构造器模式统一为：**
```typescript
constructor() {
    super();
    this.set_default(this.id);
}
```

---

## 7. 特殊技能（SKILL）编写

特殊技能是游戏的主体，每个特殊技能至少需要：
1. 一个唯一的 `id`
2. 正确的 `grade`（品级）
3. `can_enables` 指明可以装备到哪些基础技能上
4. 可选 `family` 指定归属门派
5. 可选 `learn_condition` 设置学习条件
6. 可选 `query_enable_prop` 提供装备后的属性加成
7. 可选 `pfm_set` 定义绝招

### 7.1 基础模板

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "我的剑法";           // 显示名称
    id = "wojianfa";             // 技能 ID，必须全局唯一
    grade = 2;                   // 品级 0-6
    family = FAMILIES.HUASHAN;   // 所属门派（可选，不设则为公共技能）
    desc = "这是一套自创的剑法。";  // 技能描述

    // 攻击动作描述（战斗中随机选一个）
    attack_actions = [
        "$N手中$W一抖，剑光如练，直刺$n的$l",
        "$N身形一转，$W斜斜斩向$n的$l",
        "$N大喝一声，$W带着破空之声劈向$n的$l"
    ];

    // 闪避动作描述（可选）
    dodge_actions = [
        "但是$n轻盈地一闪，躲过了$N的攻击。"
    ];

    // 可装备到哪些基础技能
    can_enables = ["sword"];

    // 学习条件
    learn_condition: LearnCondition = {
        max_mp: 5000,
        skill: {
            sword: 200,     // 需要基本剑法 200 级
            force: 100      // 需要基本内功 100 级
        }
    };

    constructor() {
        super();
    }
}
```

### 7.2 属性字段详解

**grade 品级对照表：**

| 值 | 名称 | 颜色 | 说明 |
|----|------|------|------|
| 0 | 基本技能 | 白色 | 仅基础技能使用 |
| 1 | 普通技能 | 亮绿 | 入门级武功，如华山剑法 |
| 2 | 高级技能 | 亮青 | 进阶武功 |
| 3 | 稀有武技 | 亮黄 | 门派核心武功，如打狗棒法、紫霞神功 |
| 4 | 绝世武功 | 亮紫 | 顶级武功，如独孤九剑、降龙十八掌 |
| 5 | 绝世神功 | 亮橙 | 终极神功 |
| 6 | 无上神武 | 红色 | 终极中的终极 |

**family 门派归属：**

```typescript
import {FAMILIES} from "../../../core/skill/family.js";

// 可用门派常量：
FAMILIES.HUASHAN     // 华山派
FAMILIES.GAIBANG     // 丐帮
FAMILIES.WUDANG      // 武当派
FAMILIES.SHAOLIN     // 少林派
FAMILIES.EMEI        // 峨眉派
FAMILIES.MINGJIAO    // 明教
FAMILIES.GULEI       // 古墓派
// ... 还有其他门派，请查看 family.ts

// 不设定 family 或设为 FAMILIES.NONE 则为公共技能
```

**进阶相关字段：**

```typescript
// 进阶来源技能——表示本技能是由其他技能进阶而来
source_skill = "huashanjianfa";

// 是否为终极进阶（不可再进阶）
is_ultimate = true;

// 是否从列表中隐藏
is_hidden = false;

// 是否自创武功
is_custom = false;

// 可练习的最低等级（低于此等级无法 practice）
lianxi_level = 100;
```

### 7.3 query_prop — 基础属性加成

`query_prop(lv, me?)` 返回技能始终提供的属性加成，**不论是否装备**。

该方法接收技能等级 `lv`（必选）和角色对象 `me`（可选），返回 `PropMap` 类型。

```typescript
query_prop(lv: number, me?: CHARACTER): PropMap {
    return {
        // 每 10 级加 1 点后天臂力
        str: Math.floor(lv / 10),
        // 每级加 100 点内力上限
        limit_mp: lv * 100,
        // 最终伤害百分比加成
        add_sh_per: 5 + parseInt(lv / 300),
        // 注意：desc 字段仅用于显示说明，不产生实际效果
        desc: "唯一：将你内力的60%转化为气血"
    };
}
```

完整可用的 `PropMap` 字段见[第16章](#16-propmap-属性大全)。

### 7.4 query_enable_prop — 装备属性加成

`query_enable_prop(lv, me?)` 返回**当技能装备到特定基础技能类型时**的额外属性加成。

返回类型为 `EnablePropMap`，键是基础技能类型名（`sword`, `blade`, `force`, `dodge`, `parry`, `unarmed`, `club`, `staff`, `whip`, `throwing`），值是该类型下获得的属性加成。

```typescript
query_enable_prop(lv: number): EnablePropMap {
    return {
        // 装备到剑法时
        sword: {
            gj: lv * 2 + 10,      // 攻击力
            mz: lv + 10,           // 命中
            gjsd: 200,             // 攻击速度（固定值）
            bj_per: parseInt(lv / 500) + 2,  // 暴击率%
        },
        // 装备到招架时
        parry: {
            zj: lv * 2 + 10,      // 招架
            fy: lv,                // 防御
            desc: "招架敌人招式后立刻反击敌人"  // 仅用于显示
        }
    };
}
```

**常见属性键：**

| 键 | 说明 | 类型 |
|----|------|------|
| `gj` | 攻击力（固定值） | number |
| `fy` | 防御力（固定值） | number |
| `mz` | 命中（固定值） | number |
| `ds` | 躲闪（固定值） | number |
| `zj` | 招架（固定值） | number |
| `gjsd` | 攻击速度（固定值） | number |
| `bj_per` | 暴击率百分比 | number |
| `add_sh_per` | 最终伤害百分比加成 | number |
| `diff_sh_per` | 伤害减免百分比 | number |
| `str` / `con` / `dex` / `int` | 后天属性 | number |
| `limit_mp` | 内力上限 | number |
| `hp_per` | 气血百分比加成 | number |
| `mp_per` | 内力百分比加成 | number |
| `gj_per` | 攻击百分比加成 | number |
| `fy_per` | 防御百分比加成 | number |
| `desc` | 描述文本（仅展示） | string |

### 7.5 learn_condition — 学习条件

`learn_condition` 用于控制玩家学习该技能的门槛。支持以下字段：

```typescript
learn_condition: LearnCondition = {
    // ---- 前置技能等级要求 ----
    skill: {
        sword: 400,        // 需要基本剑法 400 级
        force: 200,        // 需要基本内功 200 级
        "huashanjianfa": 100  // 需要华山剑法 100 级
    },

    // ---- 先天属性要求（不含装备加成） ----
    str1: 30,     // 先天臂力 >= 30
    con1: 25,     // 先天根骨 >= 25
    dex1: 30,     // 先天身法 >= 30
    int1: 25,     // 先天悟性 >= 25

    // ---- 总属性要求（含装备加成） ----
    str: 50,      // 总臂力 >= 50
    con: 40,      // 总根骨 >= 40
    dex: 50,      // 总身法 >= 50
    int: 40,      // 总悟性 >= 40

    // ---- 性别限制 ----
    gender: 1,    // 1=男性, 2=女性, 3=无性

    // ---- 其他条件 ----
    max_mp: 10000,    // 内力上限 >= 10000

    // ---- 纯文本描述（不做实际检查，仅显示） ----
    desc: "需要完成独孤九剑解谜任务"
};
```

### 7.6 can_enables — 可装备类型

`can_enables` 数组决定该技能可以装备到哪些基础技能上。玩家通过 `enable` 命令将技能装备到这些类型后，才能获得 `query_enable_prop` 中的属性加成。

```typescript
// 剑法 + 招架双装备
can_enables = ["sword", "parry"];

// 仅内功
can_enables = ["force"];

// 仅轻功
can_enables = ["dodge"];

// 拳脚 + 招架
can_enables = ["unarmed", "parry"];

// 棍法
can_enables = ["club"];
```

**可选值列表：** `"sword"`, `"blade"`, `"staff"`, `"club"`, `"whip"`, `"unarmed"`, `"throwing"`, `"force"`, `"dodge"`, `"parry"`

---

## 8. 内功技能（Force）

内功技能的特殊之处：
- `can_enables = ["force"]`
- 设置 `force_rad` 控制气血转化比例
- 提供 `limit_mp` 增加内力上限
- 可以被装备为默认内功

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "紫霞神功";
    id = "zixiashengong";
    grade = 3;
    force_rad = 0.6;       // 60% 内力转化为气血
    family = FAMILIES.HUASHAN;
    desc = "华山派的内功心法，气宗的立派根本，以修炼时身上紫气环绕而得名";
    can_enables = ["force"];
    learn_condition: LearnCondition = {
        max_mp: 300,
        skill: { force: 300 }
    };

    pfm_set: PerformData = {
        xi: {
            name: "紫气东来",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 0,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var gj = 10 + parseInt(lv / 100);
                var time = 20000 + lv * 10;
                var mz = lv + 30;
                me.send_room("<mag>$N微一凝神，运起紫霞神功，周身紫气萦绕。</mag>", target);
                me.add_status({
                    id: "force",
                    name: "紫气东来",
                    desc: "使用紫霞神功提升战力，增加你的伤害",
                    duration: time,
                    prop: {
                        add_sh_per: gj,
                        mz: mz
                    },
                    finish_msg: "$N的紫霞神功运行完毕，将内力收回丹田。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var gj = 10 + parseInt(lv / 100);
                var mz = lv + 30;
                var time = 20000 + lv * 10;
                return "使用紫霞神功提升战力，增加你的伤害" + gj + "%，命中增加" + mz + "，持续" + (time / 1000) + "秒";
            }
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: parseInt(lv * 1.3) + 10,
                mz: parseInt(lv * 1.2) + 10,
                limit_mp: lv * 100,
                desc: "唯一：将你内力的60%转化为气血"
            }
        };
    }
}
```

---

## 9. 轻功技能（Dodge）

轻功技能装备到 `"dodge"` 上，提供 `ds`（躲闪）加成和 `dodge_actions`。

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "飞燕回翔";
    id = "feiyanhuixiang";
    grade = 1;
    family = FAMILIES.HUASHAN;
    can_enables = ["dodge"];
    dodge_actions = [
        "但是$n身形飘忽，轻轻一纵，一招「乳燕投林」，举重若轻的避开这一击。",
        "$n身随意转，一式「雪花飞舞」，倏地往一旁飘开数尺，避过了这一招。",
        "可是$n侧身一让，使出「柳絮轻飘」，$N这一招扑了个空。",
        "却见$n足不点地，一招「腾云驾雾」，身形滴溜溜一转，往旁闪开数尺，躲了开去。",
        "$n左脚一点右脚背，身形往上一拔，一招「一鹤冲天」，轻轻巧巧地避开了这一招。"
    ];
    desc = "华山派轻功身法，招式如飞燕般灵动不可捉摸。";
    learn_condition: LearnCondition = {
        max_mp: 500,
        skill: { dodge: 60 }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv + 5
            }
        };
    }
}
```

---

## 10. 知识技能（KNOWLEDGE）

知识技能不参与战斗，通常提供生活技能加成。不需要 `can_enables`、`attack_actions` 等战斗字段。

```typescript
import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    id = "literate";
    name = "读书写字";
    grade = 0;
    type = SKILL_TYPES.KNOWLEDGE;
    desc = "书中自有黄金屋，书中自有颜如玉，多读书会提高自己的悟性，减少技能的学习时间";

    query_prop(lv: number, me: CHARACTER): PropMap {
        let grade = 0;
        if (me && me.is_player) {
            grade = this.query_grade(me);
        }
        return {int: parseInt(lv / (10 - grade))};
    }

    // slots 是进阶槽位系统（可选）
    slots = [
        {
            prop: "fenjie",
            name: "机关术",
            value: (lv: number) => Math.pow(lv, 1 / 3),
            count: 1,
            format: (val: number) => {
                return "机关术：基础悟性提升，分解装备获得额外" + val + "玄晶";
            }
        }
    ];
}
```

**要点：**
- 必须设置 `type = SKILL_TYPES.KNOWLEDGE`
- 无需 `can_enables`
- 可以使用 `slots` 定义进阶属性槽位

---

## 11. 战斗动作描述（$占位符系统）

在 `attack_actions`、`dodge_actions`、`parry_actions`、`weapon_vs_weapon_actions`、`weapon_vs_unarmed_actions`、`unarmed_vs_weapon_actions` 中可以使用以下占位符：

| 占位符 | 说明 | 适用场景 |
|--------|------|----------|
| `$N` | 攻击者（主动方）名称 | 所有动作 |
| `$n` | 目标（被动方）名称 | 所有动作 |
| `$P` | 攻击者（主动方）的宾格（他/她） | 所有动作 |
| `$p` | 目标（被动方）的宾格（他/她） | 所有动作 |
| `$W` | 攻击者的武器名 | 攻击动作 |
| `$w` | 目标的武器名 | 招架动作 |
| `$T` | 攻击者的暗器名 | 暗器动作 |
| `$l` | 攻击部位（如"胸口""左腿"等） | 攻击动作 |
| `$i` | 防御者的武器名（招架时） | 招架动作 |
| `$I` | 防御者的武器名（招架时） | 招架动作 |

**示例：**
```typescript
attack_actions = [
    "$N用$W往$n的$l刺去",      // → "张三用长剑往李四的胸口刺去"
    "$N挥动$W,斩向$n的$l",
];
dodge_actions = [
    "但是$n身子一侧，闪了开去。",   // → "但是李四身子一侧，闪了开去。"
];
parry_actions = [
    "结果「当」地一声被$p挡开了。", // → "结果「当」地一声被他挡开了。"
];
```

**颜色标签：** 可以使用 `<HIC>`、`<HIR>`、`<HIY>`、`<HIG>`、`<HIB>`、`<HIM>`、`<HIW>`、`<CYN>`、`<RED>`、`<YEL>`、`<GRN>`、`<BLU>`、`<MAG>`、`<WHT>`、`<cyn>`、`<red>`、`<yel>`、`<grn>`、`<blu>`、`<mag>`、`<wht>`、`<hiz>`、`<hio>` 等颜色标签包裹文本。

---

## 12. 绝招（PERFORM）编写

### 12.1 基础结构

绝招定义在 `pfm_set: PerformData` 字段中，每个绝招是一个 `PERFORM` 的 partial 对象，必须通过 `PERFORM.fromPlain()` 转换。

```typescript
pfm_set: PerformData = {
    绝招key: {
        name: "绝招名称",           // 显示名称（必填）
        mp: 20,                     // 内力消耗基础值（必填）
        distime: 10000,             // 冷却时间，毫秒（必填）
        release_time: 0,            // 出招时间，毫秒（0=瞬间）
        enable_skill: "sword",      // 哪个基础技能类型启用此绝招（必填）
        use_type: 1,                // 使用类型（可选）
        no_auto: false,             // 禁止自动释放
        allow_busy: false,          // 允许在忙乱时使用
        allow_faint: false,         // 允许在昏迷时使用
        allow_safe: false,          // 允许在安全区使用
        no_check: false,            // 跳过条件检查
        check: function(me: CHARACTER, lv: number, base_type?: string): boolean { ... },  // 自定义使用条件
        use_condition: "需要手持长剑",  // 条件描述（不满足时显示）

        // === 核心回调（必填）===
        use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
            // 绝招逻辑
            me.do_attack({ ... });
            me.end_attack(target);
        },

        // === 描述回调（建议实现）===
        query_desc: function(me: CHARACTER, lv: number): string {
            return "绝招的详细描述文本";
        },

        // === 冷却/出招减免覆盖 ===
        distime_key: "xxx",              // 冷却时间减免key
        distime_per_key: "xxx",          // 冷却时间百分比减免key
        releasetime_key: "xxx",          // 出招时间减免key
        releasetime_per_key: "xxx",      // 出招时间百分比减免key
        expend_mp_per_key: "xxx",        // 内力消耗百分比减免key
    }
};
```

**注意事项：**
- `pfm_set` 中定义的 `use` 函数中，`this` 指向该 `PERFORM` 实例（不是 SKILL 实例）
- 每个绝招必须有 `enable_skill` 字段，指明哪个基础技能类型触发此绝招
- `use` 函数的签名：`(me: CHARACTER, target: CHARACTER, lv: number, sktype: string) => void | boolean`

### 12.2 单次攻击型绝招

最简单的绝招——做一次攻击，然后结束攻击序列。

```typescript
zhan: {
    name: "斩击",
    distime: 5000,
    mp: 5,
    enable_skill: "sword",
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var gj = 10 + lv;
        me.do_attack({
            target: target,
            gj: me.gj + gj,         // 在基础攻击力上附加伤害
            mz: me.mz,
            attack_msg: "<hic>$N看准破绽，挥动$W斩向$n的$l</hic>"
        });
        me.end_attack(target);
    },
    query_desc: function (me: CHARACTER, lv: number): string {
        var gj = 10 + lv;
        return "强力一击，附加" + gj + "点伤害。";
    }
}
```

**关键模式：**
1. 计算伤害加成
2. 调用 `me.do_attack({...})` 执行攻击
3. 调用 `me.end_attack(target)` 结束攻击序列

### 12.3 多段攻击型绝招（循环）

循环多次调用 `do_attack`，然后一次性 `end_attack`。

```typescript
wu: {
    name: "天下无狗",
    distime: 20000,
    enable_skill: "club",
    mp: 20,
    attack_msgs: [
        "<hiw>$N使出一招「棒打双犬」...</hiw>",
        "<hiw>$N手中$w左右晃动...</hiw>",
    ],
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var count = 3 + parseInt(lv / 100);
        if (count > 10) count = 10;
        me.send_room("<hiw>$N手中青光一闪...</hiw>\n", target);
        for (var i = 0; i < count; i++) {
            me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz,
                attack_msg: this.attack_msgs!.random()  // 随机选一个消息
            });
        }
        me.end_attack(target);
    },
    query_desc: function (me: CHARACTER, lv: number): string {
        var count = 3 + parseInt(lv / 100);
        if (count > 10) count = 10;
        return "快速攻击" + count + "次";
    }
}
```

### 12.4 先读消息型（msgs + call_interval）

使用 `msgs` 数组配合 `call_interval` 实现一系列带有各自消息的攻击。

```typescript
shiba: {
    name: "十八掌",
    distime: 30000,
    enable_skill: "unarmed",
    mp: 30,
    msgs: [
        "<hig>-----亢龙有悔-----</hig>\n$N双掌平平提到胸前...",
        "<hig>-----飞龙在天-----</hig>\n$N突然身形飞起...",
        // ... 更多招式消息
    ],
    query_releasetime: function (me: CHARACTER, lv: number) {
        lv = lv || me.query_skill("xianglongzhang", 0);
        var t = 12000 - lv * 2;
        if (t <= 8000) return 8000;
        return t;
    },
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        me.send_room("<hiy>$N凝神聚气...</hiy>\n");
        me.is_rash = 12000 - lv * 2;
        if (me.is_rash < 8000) me.is_rash = 8000;
        var time = parseInt(me.is_rash / 18);
        var gj = me.gj;
        lv = 105 + parseInt(lv / 500);
        if (lv > 109) lv = 109;
        var $this = this;

        me.call_interval(
            function (i) {
                let now_target = me.query_enemy();
                if (!now_target) {
                    me.is_rash = 0;
                    return false;
                }
                if (me.do_attack({
                    target: now_target,
                    gj: gj,
                    mz: me.mz,
                    attack_msg: $this.msgs![i],
                    no_weapon: true
                })) {
                    gj = gj * lv / 100;  // 掌力递增
                }
                me.end_attack(now_target);
                if (!me.enemy?.length) {
                    me.is_rash = 0;
                    return false;
                }
                if (i >= 17) me.is_rash = 0;
            },
            time,   // 每次攻击的间隔
            18      // 总次数
        );
    },
    query_desc: function (me: CHARACTER, lv: number) {
        // ...
        return time + "秒内将十八掌全部打出，掌力会越来越凶猛...";
    }
}
```

**要点：**
- `me.call_interval(func, interval, count, endFunc?)` 是 BASE 类提供的工具方法，按指定间隔重复调用
- `call_interval` 的第一个参数接收当前次数索引 `i`（从0开始）
- 返回 `false` 可提前终止
- 可在 `me.is_rash` 设置为非0值使在连击过程中无法闪避

### 12.5 Buff 型绝招（add_status）

给自身增加增益状态的绝招。

```typescript
wu: {
    name: "无招",
    distime: 20000,
    enable_skill: "sword",
    mp: 20,
    release_time: 0,
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var time = lv * 10 + 5000;
        if (time > 15000) time = 15000;
        me.send_room("<him>$N凝神聚气，挥洒手中兵器，进入无招无我，剑心通明境界！\n</him>", target);
        me.add_status({
            id: "weapon",
            name: "无招",
            duration: time,
            prop: {
                gjsd_per: 100,    // 攻速+100%
                gj: lv,
                mz: lv
            }
        });
        me.set_temp("weapon", 1, time);
        me.reauto_attack();
    },
    query_desc: function (me: CHARACTER, lv: number): string {
        var time = lv * 10 + 5000;
        if (time > 15000) time = 15000;
        return "独孤九剑之无招胜有招，" + (time / 1000) + "秒内...出招速度加快到极限...";
    }
}
```

**要点：**
- `me.add_status({id, name, duration, prop, ...})` 添加状态
- `me.set_temp("key", value, duration?)` 设置临时标记
- `me.reauto_attack()` 重新触发自动攻击（因为攻速等属性改变了）

### 12.6 Debuff 型绝招（附加忙乱状态）

给目标附加负面状态的绝招。

```typescript
poqi: {
    name: "破气诀",
    distime: 30000,
    enable_skill: "sword",
    mp: 20,
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var sh = me.do_attack({
            target: target,
            attack_msg: "<hib>$N施出独孤九剑「破气式」...</hib>",
            miss_msg: "<CYN>可$n深知$N这招的厉害...</CYN>",
            no_parry: true,              // 无法招架
            damage_msg: "<hir>$n被$N一剑划过气门...</hir>"
        });
        if (sh) {   // 命中（造成了伤害）才触发后续效果
            target.add_mp(-lv * 10);     // 减少目标内力
            var time = 3000 + lv * 5;
            if (time > 10000) time = 10000;
            target.add_status({
                id: "busy",
                is_busy: true,           // 忙乱类型
                name: "忙乱",
                downside: true,          // 负面状态（受抗性影响）
                desc: "你处于忙乱状态，无法攻击，招架",
                duration: time
            }, me);     // 第二个参数是来源者（用于计算加深/减免）
        }
        me.end_attack(target);
    },
    query_desc: function (me: CHARACTER, lv: number): string {
        // ...
    }
}
```

**忙乱状态说明：**
- `is_busy: true` — 忙乱状态下无法攻击和招架
- `downside: true` — 标记为负面状态
- 第二个参数 `from` 是来源者，系统会根据来源者的 `busy` / `busy_per` 和目标的 `diff_busy` / `diff_busy_per` 计算实际持续时间

### 12.7 带回调的绝招（on_parry）

在 `do_attack` 的参数中设置事件回调。

```typescript
qi: {
    name: "降龙",
    distime: 30000,
    enable_skill: "unarmed",
    mp: 30,
    release_time: 0,
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var time = 2000 + lv * 5;
        if (time > 8000) time = 8000;
        var is_parried = false;
        var sh = me.do_attack({
            target: target,
            gj: me.gj,
            mz: me.mz,
            no_weapon: true,
            attack_msg: "<hiy>$N大喝一声，双掌齐出...</hiy>",
            damage_msg: "<hir>只听砰的一声...</hir>",
            on_parry: function (t, ispa) {
                is_parried = ispa;
                if (ispa) {
                    // 如果被招架，修改伤害消息
                    this.damage_msg = "<hir>$n慌乱中匆忙招架，后续掌力却如怒潮狂涌而至...</hir>";
                }
                return false;
            },
            miss_msg: "<hic>$n大惊之下...</hic>"
        });
        if (sh && !is_parried) {
            target.add_status({
                id: "unarmed",
                duration: time,
                name: "降龙",
                downside: true,
                is_rash: true,       // 鲁莽状态（无法躲闪）
                desc: "你无法躲闪"
            }, me);
        }
        me.end_attack(target);
    }
}
```

### 12.8 特殊用途绝招（非伤害）

不是所有绝招都需要造成伤害。

```typescript
pojian: {
    name: "破字诀",
    distime: 10000,
    enable_skill: "parry",
    mp: 20,
    use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
        var weap = target.query_weapon();
        if (!weap || weap.weapon_type === WEAPON_TYPE.NONE)
            return me.notify("对方没有兵刃，你不用担心。");
        me.send_room("<HIC>$N举剑画弧...</HIC>", target);
        if (lv * 2 + me.random(me.mz) > target.ds) {
            me.send_room("<hir>$n手腕一麻，手中$i脱手而出！\n</hir>", target);
            target.unequip(weap, true, 12000);   // 卸下对方武器12秒
        } else {
            me.send_room("<cyn>可是$n看破了$N的剑路...</cyn>", target);
        }
    },
    query_desc: function (me: CHARACTER, lv: number): string {
        return "独孤九剑之破字诀，卸下对方兵刃。";
    }
}
```

**要点：**
- `me.notify("消息")` 给使用者发送消息
- `me.send_room("消息", target)` 给房间所有人发送消息，第二个参数是目标（会生成不同视角）
- `target.unequip(weap, true, 12000)` 强制卸下武器 12 秒
- 此绝招没有调用 `do_attack`，因为它是非伤害型

### 12.9 出招时间与冷却减免覆盖

```typescript
somePfm: {
    name: "特殊绝招",
    distime: 20000,                // 基础冷却 20 秒
    release_time: 5000,            // 出招时间 5 秒
    mp: 30,                        // 基础内力消耗

    // 可以用自定义函数覆盖冷却/出招计算
    query_releasetime: function (me: CHARACTER, lv: number): number {
        // 自定义出招时间计算
        lv = lv || me.query_skill("my_skill", 0);
        var t = 5000 - lv * 2;
        if (t <= 2000) return 2000;
        return t;
    },

    // 映射到属性的减免 key
    // 如果 me.query_prop("xxx_reduce") 返回数值，则冷却时间减少该数值
    distime_key: "xxx_reduce",
    // 百分比减免：冷却时间减少 me.query_prop("xxx_per")%
    distime_per_key: "xxx_per",
    // 出招时间减免
    releasetime_key: "xxx_releasetime",
    // 出招时间百分比减免
    releasetime_per_key: "xxx_releasetime_per",
    // 内力消耗百分比减免
    expend_mp_per_key: "xxx_expend_per",
}
```

如果定义了 `query_releasetime` 方法，它会完全覆盖默认的出招时间计算逻辑，此时 `release_time` 字段不会被使用。

### 12.10 按位置限制绝招（check + base_type）

当一个技能有多个 `can_enables`（如 `["sword", "unarmed", "force"]`），某些绝招可能只应在部分位置生效。框架提供了两种方式：

#### 方式一：`enable_skill` 白名单（单位置）

`enable_skill` 指定绝招**只能**在哪个基础技能类型下使用。比如技能可装备为 `["force", "parry"]`，但某个绝招只在内功位置生效：

```typescript
pfm_0: {
    name: "鲲字诀",
    enable_skill: "force",   // 只能在 force 位置使用，parry 位置不可用
    // ...
}
```

**效果：** 战斗面板中其他位置不显示该绝招；手动使用会提示"需要装备为XX才可以使用"；自动绝招也会跳过。

**局限：** `enable_skill` 是单值，只能选**一个**位置。无法表达"sword 和 unarmed 可用，force 不可用"。

#### 方式二：`check` 回调黑白名单（多位置）

`check` 回调接收第三个参数 `base_type`，可以按位置做任意判断：

```typescript
wuwo: {
    name: "无我",
    // 允许 sword 和 unarmed，禁止 force
    check: (_me: CHARACTER, _lv: number, base_type?: string) => base_type !== 'force',
    // ...
}
```

**`check` 在不同场景的行为：**

| 场景 | `check` 返回 `false` | `check` 返回 `true` |
|------|---------------------|--------------------|
| 战斗面板 (`on_skillchanged`) | **不显示该绝招** | 正常显示 |
| 手动使用 (`perform force.wuwo`) | 静默拦截，无法使用 | 正常执行 |
| 自动绝招 (`add_auto_pfm`) | 不加入自动队列 | 正常加入 |
| `cha` 查看技能 | 显示为红色不可用（不传 `base_type`，无法按位置判断） | 显示为青色可用 |

**注意：** `cha` 命令展示技能详情时不传 `base_type`，因此 `check` 在 `cha` 中无法做位置判断。位置隐藏只在战斗面板和实际使用时生效。

**完整示例（小无相功的无我绝招）：**

```typescript
wuwo: {
    name: "无我",
    distime: 20000,
    mp: 40,
    no_copy: true,
    allow_busy: true,
    release_time: 4000,
    // force 位置不显示、不可用，sword/unarmed 正常
    check: (_me: CHARACTER, _lv: number, base_type?: string) => base_type !== 'force',
    use(me: CHARACTER, target: CHARACTER, lv: number, sk: string): void | boolean {
        // sk 是当前启用位置（"sword" / "unarmed" / "force"）
        // check 已拦截 force，此处 sk 只会是 sword 或 unarmed
        // ...
    },
}
```

---

## 13. 战斗回调 hook 详解

SKILL 支持丰富的战斗生命周期回调。这些回调定义在技能类上（不是绝招上），通过覆写方法来实现。

### 13.1 攻击阶段回调

```typescript
// 战斗开始 — 进入战斗时触发
on_beginfight(me: CHARACTER, target: CHARACTER): void {
    me.send_room("<him>$N摆开架势，准备战斗。</him>", target);
}

// 每轮攻击前 — do_attack 开头时触发
on_before_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
    // 可以在 par 中修改攻击参数
}

// 每轮攻击时 — 伤害计算阶段触发，返回值为附加伤害
on_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
    return 50;  // 本次攻击附加 50 点伤害
}

// 每轮攻击结束 — do_attack 末尾触发
on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar, sh: number): void {
    // sh 是本次造成的总伤害
}

// 整轮攻击序列结束 — end_attack 中触发
on_end_attack(me: CHARACTER, target: CHARACTER): void {
    // 可以用来做一些清理工作
}

// 内功攻击 — 在 do_attack 中额外调用，返回值为附加的内功伤害
do_force_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
    return Math.floor(me.mp / 10);  // 消耗内力附加伤害
}
```

### 13.2 防御阶段回调

```typescript
// 受到伤害前 — 返回值为减免后的伤害
on_damage(me: CHARACTER, sh: number, from: CHARACTER): number {
    return Math.floor(sh * 0.8);  // 减免 20% 伤害
}

// 闪避时触发
on_dodge(target: CHARACTER, me: CHARACTER, par: DoAttackPar): void {
    me.send_room("<CYN>$n身法灵动，轻松闪避了$N的攻击。</CYN>", target);
}

// 闪避结束后触发
on_dodge_over(target: CHARACTER, me: CHARACTER, par: DoAttackPar): void {
}

// 招架时触发
on_parry(target: CHARACTER, me: CHARACTER, par: DoAttackPar): void {
    // 在这里可以修改 par 的判定结果
}

// 招架结束后触发
on_parry_over(target: CHARACTER, me: CHARACTER, par: DoAttackPar): void {
    // 常用于招架反击
    if (par.is_parried) {
        // 招架成功，执行反击
        me.do_attack({
            target: target,
            attack_msg: "<hir>$N趁势反击...</hir>"
        });
        me.end_attack(target);
    }
}

// 内功招架 — 减免内功伤害
on_force_parry(target: CHARACTER, me: CHARACTER, sh: number, par: DoAttackPar): number {
    return Math.floor(sh * 0.5);  // 减免 50% 内功伤害
}

// 绝招招架 — 用绝招来招架对方的绝招
on_parry_pfm(target: CHARACTER, me: CHARACTER, pfm: PERFORM, level: number, sk?: string): boolean {
    return true;  // 返回 true 表示招架成功
}
```

### 13.3 特殊回调

```typescript
// 敌人死亡时触发
on_enemy_die(me: CHARACTER, target: CHARACTER): void {
    me.notify("你击败了" + target.name + "！");
}

// 技能移除时触发
on_remove(me: CHARACTER, skill: SKILL | null): boolean | void {
    me.notify("你的" + this.name + "被遗忘了。");
}

// 复活时触发（比武等场景）
on_relive(me: CHARACTER): void {
    // 复活后的处理
}
```

---

## 14. do_attack 参数详解

`me.do_attack(par: DoAttackPar)` 是执行一次攻击的核心方法。返回值是造成的伤害数值（number）。

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | `CHARACTER` | 攻击目标，缺省则取当前敌人 |
| `gj` | `number` | 攻击力，默认 `me.gj` |
| `mz` | `number` | 命中值，默认 `me.mz` |
| `attack_msg` | `string` | 攻击消息；`undefined` 自动生成，`""` 不显示 |
| `miss_msg` | `string` | 闪避消息 |
| `parry_msg` | `string` | 招架消息 |
| `damage_msg` | `string` | 伤害消息（可被 `on_parry` 回调改写） |
| `attack_before` | `string` | 拼接到 `attack_msg` 之前的前置文本 |
| `no_weapon` | `boolean` | 强制空手攻击（不读取武器） |
| `is_throwing` | `boolean` | 暗器攻击 |
| `no_append` | `boolean` | 跳过 `on_attack_over` / `on_force_over` |
| `no_append_target` | `boolean` | 跳过目标的 `on_dodge_over` / `on_parry_over` |
| `no_append_before` | `boolean` | 跳过 `on_before_attack` |
| `no_dodge` | `boolean` | 目标不可闪避 |
| `no_parry` | `boolean` | 目标不可招架 |
| `no_power` | `boolean` | 跳过暴击和 `add_sh_per` 计算 |
| `part` | `AttackPart` | 指定攻击部位（默认随机） |
| `bj` | `number` | 暴击率覆写 |
| `add_bjsh_per` | `number` | 额外暴击伤害百分比 |
| `power_gj` | `number` | 内功附加伤害 |
| `diff_fy` | `number` | 忽视防御百分比（0-100） |
| `on_parry` | `function` | 目标招架时回调 `(target, is_parried) => void` |
| `on_dodge` | `function` | 目标闪避时回调 `(target) => void` |

**输出字段（do_attack 会写入以下字段，调用方可以读取）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `is_dodged` | `boolean` | 本次攻击是否被闪避 |
| `is_parried` | `boolean` | 本次攻击是否被招架 |
| `iscirt` | `boolean` | 本次攻击是否暴击 |

**典型用法模式：**

```typescript
// 模式1：简单攻击
me.do_attack({ target: target, gj: me.gj, mz: me.mz });

// 模式2：自定义消息的攻击
var sh = me.do_attack({
    target: target,
    gj: me.gj + 100,
    mz: me.mz + 50,
    attack_msg: "<hiy>$N全力一击！</hiy>",
    miss_msg: "<cyn>但是$n躲开了。</cyn>",
    no_parry: true
});

// 模式3：判断是否命中
var damage = me.do_attack({ target: target, gj: me.gj });
if (damage > 0) {
    // 命中后的额外处理
}
```

---

## 15. add_status 状态系统

`me.add_status(buff: CharacterStatus, from?: CHARACTER)` 用于添加状态（Buff/Debuff）。

**参数定义（StatusDef 核心字段）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 状态唯一标识（用于叠加/移除判断） |
| `name` | `string` | 状态显示名称 |
| `desc?` | `string` | 状态描述 |
| `duration` | `number` | 持续时间（毫秒）。配合 `on_interval` 时为每次触发间隔 |
| `duration_count?` | `number` | 配合 `on_interval` 使用，指定触发次数。客户端显示总时间 = `duration × duration_count` |
| `prop?` | `PropMap` | 状态附带的属性加成/减益 |
| `is_busy?` | `boolean` | 是否忙乱状态（不可行动） |
| `is_faint?` | `boolean` | 是否昏迷状态（无知觉） |
| `is_miss?` | `boolean` | 是否闪避状态（敌人更难命中） |
| `is_rash?` | `boolean` | 是否鲁莽状态（无法躲闪） |
| `is_shadow?` | `boolean` | 是否为分身状态 |
| `ig_control?` | `boolean` | 是否免疫控制 |
| `downside?` | `boolean` | 是否为负面状态 |
| `override?` | `number` | 叠加模式：0=不可叠加（幂等），1=叠加层数，2=刷新持续时间 |
| `count?` | `number` | 当前叠加层数 |
| `max_count?` | `number` | 最大叠加层数 |
| `no_clear?` | `boolean` | 是否不可被清除 |
| `no_diff?` | `boolean` | 是否不受减免影响 |
| `only_combat?` | `boolean` | 是否仅战斗期间有效 |
| `start_msg?` | `string` | 状态施加时的消息 |
| `finish_msg?` | `string` | 状态结束时的消息 |
| `source?` | `string` | 状态来源（技能/物品 ID） |
| `on_interval?` | `function` | 定时触发回调 `(me, over_count) => boolean \| void`。配合 `duration`（间隔）和 `duration_count`（次数）使用。返回 `false` 可提前终止；不返回或返回 `undefined` 则由 `duration_count` 控制结束 |
| `on_attach?` | `function` | 状态附加时回调 `(me) => void` |
| `on_expire?` | `function` | 状态过期时回调 `(me) => void` |

**实用例子：**

```typescript
// 增益 Buff（给自己）
me.add_status({
    id: "force_buff",
    name: "气贯长虹",
    duration: 30000,           // 30秒
    prop: {
        gj_per: 20,            // 攻击+20%
        mz: 100,               // 命中+100
        add_sh_per: 15         // 最终伤害+15%
    },
    finish_msg: "$N的气息渐渐平复。",
    no_clear: true             // 不可被清除
});

// 负面 Debuff（给敌人）
target.add_status({
    id: "zhongshang",
    name: "重伤",
    duration: 10000,
    downside: true,
    prop: {
        gj_per: -30,           // 降低攻击 30%
        fy_per: -20            // 降低防御 20%
    },
    desc: "你身受重伤，攻击力下降。"
}, me);    // 第二个参数是来源者

// 忙乱状态（敌人无法行动）
target.add_status({
    id: "busy",
    name: "眩晕",
    duration: 3000,
    is_busy: true,
    downside: true,
}, me);

// 可叠加层数的 Buff
me.add_status({
    id: "layer_buff",
    name: "蓄力",
    duration: 60000,
    override: 1,               // 叠加层数模式
    count: 1,
    max_count: 5,
    prop: {
        gj: 50                 // 每层+50攻击
    }
});

// 周期触发效果（on_interval + duration_count）
// duration  = 每次触发间隔
// duration_count = 触发次数
// 客户端显示总时间 = duration × duration_count
me.add_status({
    id: "dot",
    name: "中毒",
    duration: 3000,            // 每 3 秒触发一次
    duration_count: 5,         // 共触发 5 次，客户端显示 15 秒
    downside: true,
    on_interval: function (me: CHARACTER, over_count: number) {
        // over_count 从 1 开始递增，status 系统自动计数
        // 返回 false 可提前终止；不返回则由 duration_count 控制结束
        me.from_attack(100 * over_count, 999999, '', "<hir>$N毒发作了。</hir>");
    },
});
---

## 16. 临时数据（temp）操作规范

> **通用 temp 操作约束（禁止直接访问 temp、必须提供默认值、时间单位等）详见 [全局开发约束.md](全局开发约束.md) 第二条。**

技能代码中操作 temp 的主要对象是 `me`（CHARACTER / USER 实例），通过 `me.query_temp`/`me.set_temp`/`me.add_temp`/`me.remove_temp` 操作。

### 技能中常见用法

**Buff 绝招中配合 `add_status` 使用：**
```typescript
me.add_status({ id: "weapon", name: "无招", duration: time, prop: {...} });
me.set_temp("weapon", 1, time);  // 设置同有效期标记
me.reauto_attack();
```

**冷却/状态查询：**
```typescript
if (me.query_temp("weapon", 0)) {
    // 当前处于"无招"状态
}
```

> **技能特有约束**：若使用 temp 标记来追踪 buff 状态，应确保 temp 的有效期与 `add_status` 的 `duration` 一致或稍长，避免状态不同步。

---

## 17. PropMap 属性大全

`query_prop` 和 `query_enable_prop` 以及 `add_status` 的 `prop` 字段使用 `PropMap` 类型。以下是完整可用的属性键：

### 基础属性
```typescript
str?: number;      // 臂力
con?: number;      // 根骨
dex?: number;      // 身法
int?: number;      // 悟性
per?: number;      // 容貌
kar?: number;      // 福缘
```

### 战斗属性
```typescript
hp?: number;           // 当前气血
max_hp?: number;       // 最大气血
mp?: number;           // 当前内力
max_mp?: number;       // 最大内力
gj?: number;           // 攻击力（固定值）
fy?: number;           // 防御力（固定值）
mz?: number;           // 命中（固定值）
ds?: number;           // 躲闪（固定值）
zj?: number;           // 招架（固定值）
bj?: number;           // 暴击率（固定值）
gjsd?: number;         // 攻击速度（固定值）
```

### 百分比属性
```typescript
gj_per?: number;       // 攻击力百分比加成
fy_per?: number;       // 防御力百分比加成
mz_per?: number;       // 命中百分比加成
ds_per?: number;       // 躲闪百分比加成
zj_per?: number;       // 招架百分比加成
bj_per?: number;       // 暴击率百分比加成
gjsd_per?: number;     // 攻击速度百分比加成
hp_per?: number;       // 气血百分比加成
mp_per?: number;       // 内力百分比加成
exp_per?: number;      // 经验获取百分比加成
pot_per?: number;      // 潜能获取百分比加成
```

### 特殊属性
```typescript
add_sh_per?: number;       // 最终伤害百分比加成
add_bjsh_per?: number;     // 暴击伤害百分比加成
add_sh?: number;           // 固定值伤害增加
diff_sh?: number;          // 固定值伤害减免
diff_sh_per?: number;      // 百分比伤害减免
diff_sh_per2?: number;     // 第二套伤害减免（不同计算阶段）
diff_fy_per?: number;      // 忽视防御百分比
diff_fy_per2?: number;     // 第二套忽视防御
diff_bj?: number;          // 抗暴击
diff_busy?: number;        // 数值忙乱减免
diff_busy_per?: number;    // 百分比忙乱减免
diff_downside_per?: number; // 负面状态抗性百分比
limit_mp?: number;         // 内力加力上限
force_rad?: number;        // 内功转化气血比例
obs?: number;              // 护体真气
shield?: number;           // 护盾值
damage_per?: number;       // 伤害百分比加成
skill_damage?: number;     // 技能伤害加成
reduce_damage?: number;    // 减伤
ignore_fy?: number;        // 忽视防御
ignore_mz?: number;        // 忽视躲闪
attack_num?: number;       // 额外攻击次数
busy?: number;             // 忙乱时间加成（数值）
busy_per?: number;         // 忙乱时间加成（百分比）
```

### 修炼/生活属性
```typescript
study_per?: number;      // 学习效率%
lianxi_per?: number;     // 练习效率%
dazuo_per?: number;      // 打坐效率%
dazuo?: number;          // 打坐效率（固定值）
auto_hp?: number;        // 每秒自动回血
auto_mp?: number;        // 每秒自动回内
recover_per?: number;    // 疗伤效果%
lianyao1?: number;       // 炼药效率
lianyao2?: number;       // 丹药产出
caiyao1?: number;        // 采药效率
kuang1?: number;         // 挖矿效率
diaoyu1?: number;        // 钓鱼效率
shuangxiu?: number;      // 双修效率
```

### 仅用于显示的字段
```typescript
desc?: string;   // 无实际效果，仅用于显示说明
```

---

## 18. 完整示例：华山剑法

```typescript
/**
 * 华山剑法 — 华山派入门剑法
 * 文件位置: server/res/skill/huashan/huashanjianfa.ts
 */
import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "华山剑法";
    id = "huashanjianfa";
    grade = 1;
    family = FAMILIES.HUASHAN;
    desc = "华山派的基础剑法，变化精妙，以轻灵见长。";

    // 攻击动作描述
    attack_actions = [
        "$N一招「白云出岫」，手中$w点向$n的$l",
        "$N使出「有凤来仪」，$w闪烁不定，刺向$n的$l",
        "$N一招「天绅倒悬」，$w自上而下划出一个大弧，向$n劈砍下去",
        "$N向前跨上一步，手中$w使出「白虹贯日」直刺$n的$l",
        "$N手中的$w一晃，使出「苍松迎客」直刺$n的$l"
    ];

    // 可装备到剑法
    can_enables = ["sword"];

    // 学习条件
    learn_condition: LearnCondition = {
        max_mp: 1000,
        skill: { sword: 50 }
    };

    // 绝招
    pfm_set: PerformData = {
        jiang: {
            name: "剑掌五连环",
            distime: 10000,
            enable_skill: "sword",
            mp: 20,
            release_time: 10000,  // 出招时间10秒
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room("<CYN>$N使出华山派绝技「剑掌五连环」，身法陡然加快！</CYN>", target);
                var count = 5;
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: "紧跟着"
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return "华山剑法之剑掌五连环，瞬间出招5次，收招较慢。";
            }
        }
    };

    // 装备到剑法时的属性加成
    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: { gj: lv + 10 }
        };
    }
}
```

---

## 19. 完整示例：丐帮降龙十八掌

```typescript
/**
 * 降龙十八掌 — 丐帮镇帮之宝
 * 文件位置: server/res/skill/gaibang/xianglongzhang.ts
 */
import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "降龙十八掌";
    id = "xianglongzhang";
    grade = 4;              // 绝世武功
    family = FAMILIES.GAIBANG;
    desc = "丐帮的降龙十八掌，至刚至猛，威震天下";

    // 18种攻击动作
    attack_actions = [
        "$N双掌平平提到胸前，神色沉重的缓缓施出「亢龙有悔」推向$n",
        "$N突然身形飞起，双掌居高临下一招「飞龙在天」拍向$n的$l",
        "$N右掌一招「见龙在田」，迅捷无比地劈向$n的$l",
        "$N双掌施出一招「鸿渐于陆」，隐隐带着风声拍向$n的$l",
        "$N左掌聚成拳状，右掌一招「潜龙勿用」缓缓推向$n的$l",
        "$N施出一招「利涉大川」，右掌插腰，左掌劈向$n的$l",
        "$N使出「突如其来」，右掌从不可能的角度向$n的$l推出",
        "$N大吼一声，双掌使出「震惊百里」，不顾一切般击向$n",
        "$N使出降龙十八掌之「或跃在渊」，向$n的$l连续拍出数掌",
        "$N身形滑动，双掌使一招「双龙取水」一前一后按向$n的$l",
        "$N使出「鱼跃于渊」，身形飞起，双掌并在一起向$n的$l劈下",
        "$N双掌立起，使出降龙十八掌中的「时乘六龙」向$n连砍六下",
        "$N使出「密云不雨」，左掌封住$n的退路，右掌斜斜地劈向$l",
        "$N使出降龙十八掌一势「损则有孚」，双掌软绵绵地拍向$n的$l",
        "$N脚下一转，突然欺到$n身前，一招「龙战于野」拍向$n的$l",
        "却见$N门户大开，蓦地施出一招「履霜冰至」向$n的$l劈去",
        "$N嗔目大喝，使出「羝羊触蕃」，双掌由下往上击向$n的$l",
        "$N左掌护胸，右掌使一招「神龙摆尾」上下晃动着击向$n的$l"
    ];

    // 可装备为拳脚 或 招架
    can_enables = ["unarmed", "parry"];

    learn_condition: LearnCondition = {
        max_mp: 20000,
        skill: { unarmed: 500 }
    };

    pfm_set: PerformData = {
        // === 绝招1：降龙（单次强攻+debuff）===
        qi: {
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 2000 + lv * 5;
                if (time > 8000) time = 8000;
                var is_parried = false;
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: "<hiy>$N大喝一声，双掌齐出，如怒潮般汹涌般向$p当胸猛击过去。</hiy>",
                    damage_msg: "<hir>只听砰的一声，$N已经重重打中$p胸口...</hir>",
                    on_parry: function (t: CHARACTER, ispa: boolean) {
                        is_parried = ispa;
                        if (ispa) {
                            this.damage_msg = "<hir>$n慌乱中匆忙招架，后续掌力却如怒潮狂涌而至...</hir>";
                        }
                        return false;
                    },
                    miss_msg: "<hic>$n大惊之下，飘身后退，避开了$N的一掌。</hic>"
                });
                if (sh && !is_parried) {
                    target.add_status({
                        id: "unarmed",
                        duration: time,
                        name: "降龙",
                        downside: true,
                        is_rash: true,
                        desc: "你无法躲闪"
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                var time = 2000 + lv * 5;
                if (time > 8000) time = 8000;
                return "以强劲的掌力猛击敌人，如果敌人招架失败，将在" + (time / 1000) + "秒内无法躲闪。";
            }
        },

        // === 绝招2：十八掌（多段连击）===
        shiba: {
            name: "十八掌",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            msgs: [
                "<hig>-----亢龙有悔-----</hig>\n$N双掌平平提到胸前...",
                "<hig>-----飞龙在天-----</hig>\n$N突然身形飞起...",
                "<hig>-----见龙在田-----</hig>\n$N右掌一招「见龙在田」...",
                "<hic>-----鸿渐于陆-----</hic>\n$N双掌施出一招「鸿渐于陆」...",
                "<hic>-----潜龙勿用-----</hic>\n$N左掌聚成拳状...",
                "<hic>-----利涉大川-----</hic>\n$N施出一招「利涉大川」...",
                "<hiy>-----突如其来-----</hiy>\n$N使出「突如其来」...",
                "<hiy>-----震惊百里-----</hiy>\n$N大吼一声，双掌使出「震惊百里」...",
                "<hiy>-----或跃在渊-----</hiy>\n$N使出降龙十八掌之「或跃在渊」...",
                "<hiz>-----双龙取水-----</hiz>\n$N身形滑动...",
                "<hiz>-----鱼跃于渊-----</hiz>\n$N使出「鱼跃于渊」...",
                "<hiz>-----时乘六龙-----</hiz>\n$N双掌立起...",
                "<hio>-----密云不雨-----</hio>\n$N使出「密云不雨」...",
                "<hio>-----损则有孚-----</hio>\n$N使出降龙十八掌一势「损则有孚」...",
                "<hio>-----龙战于野-----</hio>\n$N脚下一转...",
                "<hir>-----履霜冰至-----</hir>\n却见$N门户大开...",
                "<hir>-----羝羊触蕃-----</hir>\n$N嗔目大喝...",
                "<hir>-----神龙摆尾-----</hir>\n$N左掌护胸，右掌使一招「神龙摆尾」..."
            ],
            query_releasetime: function (me: CHARACTER, lv: number): number {
                lv = lv || me.query_skill("xianglongzhang", 0);
                var t = 12000 - lv * 2;
                if (t <= 8000) return 8000;
                return t;
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<hiy>$N凝神聚气，神态淡然，左手虚划，右手回转...</hiy>\n");
                me.is_rash = 12000 - lv * 2;
                if (me.is_rash < 8000) me.is_rash = 8000;
                var interval = parseInt(me.is_rash / 18);
                var gj = me.gj;
                lv = 105 + parseInt(lv / 500);
                if (lv > 109) lv = 109;
                var $this = this;
                me.call_interval(
                    function (i: number) {
                        let now_target = me.query_enemy();
                        if (!now_target) { me.is_rash = 0; return false; }
                        if (me.do_attack({
                            target: now_target,
                            gj: gj,
                            mz: me.mz,
                            attack_msg: $this.msgs![i],
                            no_weapon: true
                        })) {
                            gj = gj * lv / 100;  // 掌力递增
                        }
                        me.end_attack(now_target);
                        if (!me.enemy?.length) { me.is_rash = 0; return false; }
                        if (i >= 17) me.is_rash = 0;
                    },
                    interval,
                    18
                );
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                var lv1 = 5 + parseInt(lv / 500);
                if (lv1 > 9) lv1 = 9;
                var time = (12000 - lv * 2) / 1000;
                if (time < 8) time = 8;
                return time + "秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌增加伤害" + lv1 + "%，攻击中自身无法躲闪";
            }
        }
    };

    // 基础属性加成
    query_prop(lv: number, me: CHARACTER): PropMap {
        return { gj_per: 5 + parseInt(lv / 300) };
    }

    // 装备属性加成
    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: lv * 2 + 5,
                str: parseInt(lv / 6) + 20,
                mz: parseInt(lv * 1.2) + 20
            },
            parry: {
                zj: lv * 2 + 5,
                fy: lv * 2 + 100
            }
        };
    }
}
```

---

## 20. 完整示例：自创门派技能

以下是一个完整的、可正常加载的门派技能示例，包含所有常规要素：

```typescript
/**
 * 狂风剑法 — 示例门派技能
 * 文件位置: server/res/skill/demo/kuangfengjianfa.ts
 * 
 * 学习路径：基本剑法 → (狂风剑法)
 * 可装备为：剑法、招架
 * 包含绝招：1个伤害型 + 1个Buff型
 */
import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import {WEAPON_TYPE} from "../../../core/const.js";
import type { PropMap } from "../../../types/props.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    // ========== 基础信息 ==========
    name = "狂风剑法";
    id = "kuangfengjianfa";
    grade = 2;                    // 高级技能
    family = FAMILIES.HUASHAN;    // 华山派
    desc = "华山派进阶剑法，以快著称，剑招如狂风骤雨般连绵不绝。";

    // ========== 动作描述 ==========
    attack_actions = [
        "$N手腕一抖，$W化作一道寒光直刺$n的$l",
        "$N身形急转，$W带着呼啸之声横扫$n的$l",
        "$N举剑齐眉，猛然向前一送，$W直取$n的$l",
        "$N剑光霍霍，一招三式，分刺$n的$l"
    ];

    dodge_actions = [
        "但是$n身形一晃，如同狂风中的落叶，避了开去。"
    ];

    parry_actions = [
        "$n手中$i一横，格住了$N的攻势。"
    ];

    // ========== 技能配置 ==========
    can_enables = ["sword", "parry"];

    learn_condition: LearnCondition = {
        max_mp: 3000,
        skill: {
            sword: 100,
            force: 50
        }
    };

    // ========== 绝招 ==========
    pfm_set: PerformData = {
        // 绝招1：狂风骤雨（多段攻击）
        zhouyu: {
            name: "狂风骤雨",
            distime: 15000,
            enable_skill: "sword",
            mp: 20,
            release_time: 2000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var count = 3 + parseInt(lv / 100);
                if (count > 8) count = 8;
                me.send_room(
                    "<hiy>$N手中$W陡然加快，如同狂风骤雨般向$n刺去！</hiy>",
                    target
                );
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                var count = 3 + parseInt(lv / 100);
                if (count > 8) count = 8;
                return "狂风剑法绝技，瞬间刺出" + count + "剑，令敌人防不胜防。";
            }
        },

        // 绝招2：风卷残云（增益Buff）
        fengjuan: {
            name: "风卷残云",
            distime: 30000,
            enable_skill: "sword",
            mp: 15,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 10000 + lv * 10;
                if (time > 20000) time = 20000;
                me.send_room(
                    "<hic>$N深吸一口气，剑意纵横，整个人仿佛与剑融为一体！</hic>",
                    target
                );
                me.add_status({
                    id: "fengjuan_buff",
                    name: "风卷残云",
                    duration: time,
                    prop: {
                        gjsd_per: 30,
                        mz: lv,
                        add_sh_per: parseInt(lv / 100) + 5
                    },
                    finish_msg: "$N的剑意渐渐消散。"
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                var time = 10000 + lv * 10;
                if (time > 20000) time = 20000;
                return "激发剑意，" + (time / 1000) + "秒内攻击速度+30%，命中+" + lv + "，最终伤害+" + (parseInt(lv / 100) + 5) + "%";
            }
        }
    };

    // ========== 属性加成 ==========
    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            gjsd: 50 + parseInt(lv / 10)   // 增加攻击速度
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: lv * 1.5 + 20,
                mz: lv + 15,
                gjsd: 100
            },
            parry: {
                zj: lv * 1.2,
                fy: lv
            }
        };
    }
}
```

---

## 21. 常见问题与调试

### 20.1 技能无法加载

**症状：** 服务器启动时报错，如 `resource not preloaded: server/res/skill/xxx`

**原因：** 新的技能文件没有被注册到启动加载列表中。需要检查 `server/core/world.ts` 中的目录配置，确认新技能所在的目录是否被包含在 `dirs` 数组中。

**解决：**
- 确认技能文件放在正确的分类目录下（如 `huashan/`、`gaibang/` 等）
- 如果新建了目录，需要在启动配置中添加该目录

### 20.2 绝招不显示

**症状：** 游戏中 `cha` 命令看不到绝招

**原因：**
- `pfm_set` 中缺少 `name` 字段
- `enable_skill` 未设置或设置错误
- `PERFORM.fromPlain()` 未在构造函数中调用对 `pfm_set` 中的每个项

### 20.3 绝招无法使用

**症状：** 可以看见绝招，但使用时报错

**原因：**
- `use` 函数参数不对，签名必须是 `(me, target, lv, sktype?)`
- `use` 函数中没有调用 `me.end_attack(target)`
- `enable_skill` 与当前装备的基础技能不匹配
- 在 `use` 中引用了外部变量但作用域错误

### 20.4 属性不生效

**症状：** 装备技能后属性没有变化

**原因：**
- `can_enables` 中缺少对应的基础技能类型
- `query_enable_prop` 返回的对象中键名不对（应该是基础技能名如 `"sword"`）
- 属性名拼写错误（例如 `gjsd` 写成 `gjs`）

### 20.5 常用调试命令

```javascript
// 控制台调试
me.query_skill("my_skill_id");              // 查询技能等级
me.query_skill("my_skill_id", 0);            // 查询基础等级（不含加成）
me.is_enable_skill("my_skill_id", "sword");  // 检查是否装备到剑法
me.gj; me.mz; me.ds;                         // 查看当前战斗属性
me.query_prop("gj");                         // 查看属性加成
me.temp;                                     // 查看临时数据
me.status;                                   // 查看当前状态

// 在技能文件中
console.log("debug:", lv, me.gj);            // 打印日志
```

### 20.6 快速检查清单

```
□ 文件路径正确（server/res/skill/{category}/{name}.ts）
□ import 路径中的 ../ 数量正确
□ import 中使用了 .js 扩展名
□ export default class extends SKILL
□ id 字段与文件名一致
□ 基础技能调用了 set_default(this.id)
□ 特殊技能设置了 can_enables
□ 绝招设置了 enable_skill、name、distime、mp
□ 绝招的 use 函数签名正确
□ 绝招中调用了 end_attack
□ 绝招对象用 PERFORM.fromPlain() 包装
□ 学习条件中的技能 ID 存在
□ family 引用了正确的门派常量
□ TypeScript 编译无报错
```

---

> 本文档覆盖了 SKILL 系统从基础到高级的全部知识点。  
> 参考技能文件：`server/res/skill/base/*.ts`（基础技能模板）、`server/res/skill/huashan/*.ts` 和 `server/res/skill/gaibang/*.ts`（复杂技能示例）。  
> 核心基类定义：`server/core/skill/skill.ts`（SKILL 和 PERFORM 类）。  
> 类型定义：`server/types/props.ts`（PropMap）、`server/types/events.ts`（StatusDef）。  
> 战斗系统：`server/core/char/character.ts`（do_attack、add_status、end_attack 实现）。
