# OBJ（物品）编写指南

## 目录

1. [概述](#1-概述)
2. [文件组织与路径规范](#2-文件组织与路径规范)
3. [类继承体系](#3-类继承体系)
4. [核心属性详解](#4-核心属性详解)
5. [生命周期回调](#5-生命周期回调)
6. [消耗品（drug/）编写](#6-消耗品-drug-编写)
7. [参数化物品（#suffix）模式](#7-参数化物品-suffix-模式)
8. [货币物品（money/）编写](#8-货币物品-money-编写)
9. [装备物品（eq/）编写](#9-装备物品-eq-编写)
10. [食物与饮品（food/）编写](#10-食物与饮品-food-编写)
11. [容器物品（CONTAINER）编写](#11-容器物品-container-编写)
12. [技能书籍（book/）编写](#12-技能书籍-book-编写)
13. [宝石物品（st/）编写](#13-宝石物品-st-编写)
14. [商城/充值物品（cash/）编写](#14-商城-充值物品-cash-编写)
15. [材料物品（res/）编写](#15-材料物品-res-编写)
16. [特殊物品（sp/）编写](#16-特殊物品-sp-编写)
17. [随机掉落系统（create_by_odds）](#17-随机掉落系统-create_by_odds)
18. [运行时创建物品](#18-运行时创建物品)
19. [物品放置于房间](#19-物品放置于房间)
20. [命令系统（add_action）](#20-命令系统-add_action)
21. [属性大全](#21-属性大全)
22. [常见问题与最佳实践](#22-常见问题与最佳实践)

---

## 1. 概述

物品（OBJ）是游戏世界的核心交互对象。每个物品对应 `server/res/obj/` 下的一个 TypeScript 文件，文件使用 `export default class extends ...` 导出匿名类，引擎在启动时自动扫描加载为原型模板，运行时通过 `OBJ.CREATE()` 创建实例。

**重要原则**：

- 物品文件是**类定义**，不是实例。引擎加载后存放在 `WORLD.OBJ_STROE` 中作为原型。
- 运行时实例通过 `Object.create(base)` 原型克隆创建（见 `OBJ.CREATE` 方法）。
- 每个物品文件只导出一个匿名类，类名固定为 `default`。
- 回调方法 `on_use`、`on_create`、`on_study` 等定义在类的原型上，由引擎在适当时机调用。

---

## 2. 文件组织与路径规范

### 目录结构

```
server/res/obj/
  ├── drug/       # 消耗品（药品、丹药、经验丹等）
  ├── eq/         # 装备（武器、防具、饰品等）
  │   ├── lv0/    # 白装
  │   ├── lv1/    # 精良
  │   ├── lv2/    # 高级
  │   ├── lv4/    # 绝世
  │   └── new/    # 新装备
  ├── food/       # 食物、饮品
  ├── money/      # 货币（金币、银两）
  ├── book/       # 技能书籍、秘籍残页
  ├── cash/       # 商城物品（充值道具）
  ├── res/        # 材料（皮毛、草药、矿石）
  ├── sp/         # 特殊物品（任务物品、工具等）
  │   ├── bj/     # 北京场景物品
  │   ├── yz/     # 扬州场景物品
  │   ├── tool/   # 工具类物品（镐、钓竿等）
  │   └── new/    # 新特殊物品
  └── st/         # 宝石（镶嵌宝石）
```

### 路径命名规则

物品路径 = 相对于 `server/res/obj/` 的路径，不含扩展名 `.ts`。

```
drug/yao          → 路径 "drug/yao"
eq/lv0/jian       → 路径 "eq/lv0/jian"
money/gold        → 路径 "money/gold"
```

### #suffix 参数化路径

物品路径支持 `#参数` 后缀，用于让同一个类定义多个变体：

```
drug/yao#3        → 路径 "drug/yao#3"，par 参数为 "#3"
book/book#sword   → 路径 "book/book#sword"，par 参数为 "#sword"
```

在 `on_create(path, par)` 中接收并解析 `par` 参数字符串。

---

### 类型标注准则

> **编写物品时，必须遵循以下类型标注规则：**

1. **对象类型属性必须显式标注类型。** 当类属性值为对象字面量（`{...}`）时，必须标注类型：
   ```typescript
   // ✅ 正确
   prop: PropMap = { gj: 10, fy: 5 };
   condition = {
       skill: { sword: 100 },
       str: 30,
   } as Record<string, unknown>;

   // ❌ 错误：缺少类型标注
   prop = { gj: 10, fy: 5 };
   ```

2. **重写方法必须显式标注参数类型和返回类型：**
   ```typescript
   // ✅ 正确
   on_use(me: CHARACTER): boolean | void {
       let hp = me.add_hp(100);
       if (hp) me.notify("你恢复了" + hp + "点气血。");
   }
   on_create(path: string, par: string): void {
       if (!par) return;
       var lv = parseInt(par.slice(1));
   }

   // ❌ 错误：缺少类型标注
   on_use(me) {
       let hp = me.add_hp(100);
   }
   on_create(path, par) { ... }
   ```

3. **`group_prop` 和 `on_defense` 必须标注参数与返回类型：**
   ```typescript
   group_prop(count: number): PropMap | void {
       if (count == 3) return { int: 10 };
   }
   on_defense(me: CHARACTER, from: CHARACTER, sh: number): number {
       return Math.floor(sh * 0.9);
   }
   ```

---

## 3. 类继承体系

```
BASE
  └── ITEM
        └── OBJ                ← 通用物品基类（95% 的物品继承此）
              ├── MONEY        ← 货币类（金币、银两）
              ├── EQUIPMENT    ← 装备类（武器、防具）
              └── CONTAINER    ← 容器类（箱子、桌子）
                    └── CORPSE ← 尸体类（角色死亡产生的尸体）
```

### 选择基类的原则

| 物品类型 | 基类 | 文件位置 |
|---------|------|---------|
| 消耗品（药、食物、丹） | `OBJ` | `server/core/item/obj.ts` |
| 货币（钱） | `MONEY` | `server/core/item/money.ts` |
| 装备（武器、衣服等） | `EQUIPMENT` | `server/core/item/equipment.ts` |
| 箱子、可打开容器 | `CONTAINER` | `server/core/item/container.ts` |
| 尸体 | `CORPSE`（引擎创建） | `server/core/item/corpse.ts` |
| 宝石 | `OBJ`（设置 `is_stone = true`） | `server/res/obj/st/` |
| 技能书 | `OBJ`（设置 `skill` 属性） | `server/res/obj/book/` |
| 商城道具 | `OBJ` | `server/res/obj/cash/` |
| 材料 | `OBJ` | `server/res/obj/res/` |

---

## 4. 核心属性详解

### 从 ITEM 继承的属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | `string` | `''` | 物品资源路径，引擎自动设置 |
| `id` | `string` | 自动生成 | 实例唯一 ID，`create_id()` 生成 |
| `name` | `string` | 强制设置 | 物品显示名称 |
| `desc` | `string` | `''` | 物品描述文本 |
| `unit` | `string` | `'个'` | 计量单位（颗、把、两、本、块等） |
| `value` | `number` | `0` | 物品价值/价格（铜钱单位） |
| `grade` | `number` | `0` | 品级 0-6（影响颜色和基础价值） |
| `count` | `number` | `1` | 堆叠数量 |
| `combined` | `boolean` | `false`（ITEM）/ `true`（OBJ） | 是否可堆叠 |
| `is_money` | `boolean` | `false` | 是否为货币 |
| `is_equipment` | `boolean` | `false` | 是否为装备 |
| `is_container` | `boolean` | `false` | 是否为容器 |
| `is_obj` | `boolean` | `true` | 是否为物品 |
| `color_name` | `string` | `''` | 带颜色标签的显示名称，`on_create` 中自动生成 |
| `transable` | `boolean` | `false` | 是否可交易/出售 |
| `showAction` | `boolean` | `false` | 是否显示快捷使用按钮 |
| `distime` | `number` | `0` | 使用冷却时间（毫秒） |
| `otype` | `number` | `0` | 物件类型标识 |
| `temp` | `object` | `{}` | 临时数据存储（会持久化到数据库） |
| `items` | `ITEM[]` | `null` | 子物品列表（容器用） |
| `max_item_count` | `number` | `10` | 最大可容纳物品数 |
| `is_locked` | `boolean` | `false` | 是否锁定（容器） |
| `is_shortcut` | `boolean` | `false` | 是否为快捷栏物品（装备专用） |
| `eq_type` | `number` | `0` | 装备槽位类型（装备专用） |
| `is_open` | `boolean` | `false` | 容器是否已打开 |
| `distype` | `string` | 未定义 | 冷却分组标识，同类物品使用相同 `distype` 共享冷却 |
| `skill` | `string` | 未定义 | 技能书记录的技能 ID |
| `combine_to` | `string` | 未定义 | 合成目标物品路径（残页合成用） |
| `combine_count` | `number` | 未定义 | 合成所需数量 |
| `no_get` | `boolean` | `false` | 是否禁止拾取 |
| `prop` | `PropMap` | 未定义 | 属性加成映射（装备/宝石用） |

### 品级（grade）颜色对照

| grade | 品质 | 颜色标签 | 说明 |
|-------|------|---------|------|
| 0 | 普通 | `<wht>` | 白色 |
| 1 | 精良 | `<hig>` | 亮绿色 |
| 2 | 高级 | `<hic>` | 亮青色 |
| 3 | 稀有 | `<hiy>` | 亮黄色 |
| 4 | 绝世 | `<HIZ>` | 闪烁紫色（高亮） |
| 5 | 传说 | `<hio>` | 亮橙色 |
| 6 | 神器 | `<ord>` | 橙色 |

### otype 物件类型标识

| 值 | 含义 |
|----|------|
| 0 | 普通物品 |
| 1 | 技能书/秘籍 |
| 2 | 宝石 |
| 4 | 装备（EQUIPMENT 默认值） |

---

## 5. 生命周期回调

### on_create(path?, par?)

物品**资源文件加载时**调用，每个原型模板只调用一次（不是每次实例创建都调用）。

```typescript
on_create?(path?: string, par?: string): void;
```

- `path`：物品路径（如 `"drug/yao"`）
- `par`：`#suffix` 后缀部分（如 `"#3"`），注意包含 `#` 符号
- 在此回调中设置 `self.name`、`self.desc`、`self.prop` 等动态属性
- 注意：`this.path` 此时已被引擎设置为 `path + par`（如果 par 存在）

### on_init(me?)

物品**被分配给角色时**调用（如 `me.add_obj()` 时）。

```typescript
on_init?(me: CHARACTER): void;
```

- `me`：被分配到的角色
- 典型用途：初始化物品实例的特定状态

### on_reload(me?)

物品**从数据库加载到角色身上时**调用（玩家登录、重启等）。

```typescript
on_reload?(me: CHARACTER): void;
```

- 在 `on_load()` 方法中被调用
- 用于重建设备状态、重新应用强化等级等

### on_use(me, par?)

玩家**使用物品时**调用（`use` 命令）。

```typescript
on_use?(me: CHARACTER, par?: string): boolean | void;
```

- 返回 `false` 阻止物品消耗（不移除物品）
- 返回 `undefined`/`true` 表示正常使用并消耗
- `par` 为可选附加参数
- 当 `showAction = true` 且 `distime > 0` 时，客户端会显示快捷按钮和冷却

### on_study(me, skill, lv)

玩家**使用物品修炼技能时**调用（`study` 命令）。

```typescript
on_study?(me: CHARACTER, skill: SKILL, lv: number): boolean | void;
```

- `skill`：技能对象
- `lv`：玩家当前该技能等级
- 返回 `false` 阻止修炼

### on_open(me)

玩家**打开容器时**调用（`open` 命令）。

```typescript
on_open?(me: CHARACTER): OBJ[] | false | void;
```

- 返回 `OBJ[]` 数组作为容器内的物品列表
- 返回 `false` 阻止打开
- 返回 `undefined`/`void` 表示无内容
- 典型用途：宝箱、礼包开出随机物品

### on_get(player?)

玩家**拾取物品时**调用。

```typescript
on_get?(player: CHARACTER): boolean | void;
```

- 返回 `false` 阻止拾取
- 注意：CONTAINER 类的默认实现直接返回 `false`（不可拾取容器本身）

### on_receive(me, from?)

玩家**领取消息附件时**调用（`receive` 命令）。

```typescript
on_receive?(me: CHARACTER, from?: CHARACTER): boolean | void;
```

- `from`：发件人（如果有）
- 返回 `false` 阻止接收
- 典型用途：充值物品自动转换成对应效果

### on_enter(obj)

**有角色进入本物品所在房间时**触发。

```typescript
on_enter?(obj: Record<string, any>): void;
```

- `obj`：进入的角色对象
- 注意：只有当物品在房间地面上时有效

### on_leave(obj, dir)

**有角色从本物品所在房间离开时**触发。

```typescript
on_leave?(obj: Record<string, any>, dir: string): boolean | void;
```

- `dir`：离开方向
- 返回 `false` 阻止离开

### EQUIPMENT 专有回调

#### on_eq(me)

**装备时**调用（条件检查通过后，属性加成之前）。

```typescript
on_eq?(me: CHARACTER): boolean | void;
```

- 返回 `false` 阻止装备

#### on_uneq(me)

**卸下装备时**调用。

```typescript
on_uneq?(me: CHARACTER): void;
```

#### on_defense(me, from, sh)

**防具防御计算时**调用。

```typescript
on_defense?(me: CHARACTER, from: CHARACTER, sh: number): number;
```

- `sh`：当前伤害值
- 返回减免后的伤害值

#### group_prop(count)

**套装属性计算**，查询套装效果时调用。

```typescript
group_prop?(count: number): PropMap | void;
```

- `count`：已装备的同套装件数
- 返回对应件数触发的属性加成
- 需要同时设置 `group_name` 套装组名

---

## 6. 消耗品（drug/）编写

消耗品是最常见的物品类型，继承自 `OBJ`。核心逻辑在 `on_use` 中实现。

### 基础模板

```typescript
// 文件：server/res/obj/drug/hp_pill.ts
import type { CHARACTER } from "../../../core/char/character.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "金创药";
    value = 1000;
    grade = 1;
    combined = true;
    distime = 30000;        // 30 秒冷却
    allow_fight = true;     // 战斗中可使用
    desc = "这是一颗金创药，可以恢复气血。";
    action_msg = "吃";      // 快捷按钮文字
    transable = true;       // 可交易出售

    on_use(me: CHARACTER): void {
        let hp = me.add_hp(parseInt(String(me.max_hp * 0.3)));
        if (hp) {
            me.notify("<hig>你服下一颗金创药，恢复了" + hp + "点气血。</hig>");
        }
    }
}
```

### 增加经验/潜能的消耗品

```typescript
// 文件：server/res/obj/drug/exp.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "朱果";
    desc = "一颗红色果子，吃了增加 500 经验，500 潜能";
    grade = 1;
    exp = 500;
    pot = 500;
    value = 1000;
    transable = true;

    on_use(me) {
        me.notify("你吞下一颗" + this.color_name + "。");
        me.add_exp(this.exp, this.pot);
        // 返回 true 或 undefined 表示消耗此物品
    }

    on_create(path, par) {
        if (!par) {
            this.path = path + "#0";
            return;
        }
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;
        switch (lv) {
            case 1:
                this.name = "朱果";
                this.exp = 6000;
                this.pot = 5000;
                this.value = 5000;
                this.desc = "一颗红色果子，吃了增加 6000 经验，5000 潜能";
                break;
            // ... 更多等级
        }
        this.grade = lv + 1;
    }
}
```

### 添加 Buff 状态的消耗品

```typescript
// 文件：server/res/obj/drug/buff.ts（片段）
on_use(me) {
    me.notify("你吞下一颗" + this.color_name + "。");
    if (!this.prop) return;
    me.add_status({
        id: "drugbuff",
        name: this.name,
        desc: this.desc,
        duration: 50000 + this.grade * 10000,
        prop: this.prop,
        override: 1    // 覆盖同 id 的旧状态
    });
    return true;
}
```

### 常见 me 方法参考

| 方法 | 签名 | 说明 |
|------|------|------|
| `me.notify(msg)` | `(msg: string) => void` | 发送消息给玩家 |
| `me.notify_fail(msg)` | `(msg: string) => boolean` | 发送失败消息并返回 false |
| `me.send_room(msg, target?)` | `(msg: string, target?: any, excludeself?) => void` | 房间广播消息 |
| `me.add_hp(val)` | `(v: number) => number` | 增加气血，返回实际增加量 |
| `me.add_mp(val)` | `(v: number) => number | undefined` | 增加内力，返回实际增加量 |
| `me.add_exp(exp, pot?, money?)` | `(exp?: number, pot?: number, money?: number) => void` | 增加经验/潜能/金钱 |
| `me.add_status(buff)` | `(buff: CharacterStatus) => boolean` | 添加状态效果 |
| `me.remove_obj(obj, count?)` | `(obj: string | ITEM, count?: number) => ITEM | null` | 移除物品 |
| `me.find_obj_bypath(path)` | `(path: string, parent?) => ITEM | undefined` | 按路径查找物品 |
| `me.query_temp(name, def?)` | `<T>(name: string, def?: T) => T` | 查询临时数据 |
| `me.set_temp(name, val, time?)` | `(name: string, val: any, time?: number) => void` | 设置临时数据（可选过期时间） |
| `me.add_temp(name, val, time?)` | `(name: string, val: number, time?: number) => number` | 累加临时数据 |
| `me.change_prop(prop, is_attach)` | `(prop: PropMap, is_attach: boolean) => void` | 应用/移除属性加成 |
| `me.query_skill(name, def?)` | `(name: string, def?: number) => number` | 查询技能等级 |
| `me.add_cash(count, reason?)` | `(count: number, reason?: string) => void` | 增加元宝（充值货币） |
| `me.do_recover(hp)` | `(hp: number) => number` | 恢复气血（考虑治疗加成） |

---

## 7. 参数化物品（#suffix）模式

通过路径后缀 `#参数` 让一个类定义多种变体，这是游戏中最常用的模式之一。

### 路径示例

```
drug/yao#0    → path="drug/yao#0", par="#0"    → 回复药
drug/yao#1    → path="drug/yao#1", par="#1"    → 暴虐丹
drug/yao#2    → path="drug/yao#2", par="#2"    → 龟灵丹
drug/yao#3    → path="drug/yao#3", par="#3"    → 培元丹

book/book#sword    → path="book/book#sword", par="#sword"    → 剑法秘籍
book/book#unarmed  → path="book/book#unarmed", par="#unarmed" → 拳法秘籍

eq/tool/chu#1  → path="eq/tool/chu#1", par="#1"  → 1 级铁镐
eq/tool/chu#6  → path="eq/tool/chu#6", par="#6"  → 6 级移山镐
```

### 完整示例：参数化药品

```typescript
// 文件：server/res/obj/drug/yao.ts
import type { CHARACTER } from "../../../core/char/character.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "蛇血丹";
    value = 30000;
    grade = 3;
    combined = true;
    distime = 60000;
    allow_fight = true;
    desc = "这是一份白驼山出产的蛇血丹，不知道什么功效";
    action_msg = "吃";
    transable = true;
    drug_type: number;  // 自定义属性，在 on_create 中设置

    on_use(me: CHARACTER) {
        me.notify("<hic>你吃掉一颗蛇血丹。</hic>");
        switch (this.drug_type) {
            case 1: // 暴虐丹：增加伤害，减少防御
                me.add_status({
                    id: "food",
                    name: "暴虐",
                    desc: "增加你的伤害，减少你的防御",
                    prop: { diff_sh_per: -8, add_sh_per: 8 },
                    duration: 10000
                });
                break;
            case 2: // 龟灵丹：增加防御，减少伤害
                me.add_status({
                    id: "food",
                    name: "龟灵",
                    desc: "增加你的防御，减少你的伤害",
                    prop: { diff_sh_per: 8, add_sh_per: -8 },
                    duration: 10000
                });
                break;
            case 3: // 培元丹：增加内力上限
                var sx = 50 + me.random(me.con);
                me.limit_mp += sx;
                me.notify("<hiw>你的内力上限增加了" + sx + "。</hiw>");
                break;
            default: // 0 或未指定：回复气血
                var hp = me.add_hp(parseInt(me.max_hp * 0.3));
                if (hp) {
                    me.notify("<hig>你恢复了" + hp + "气血。</hig>");
                }
                break;
        }
    }

    on_create(path: string, par: string) {
        var lv = 0;
        if (par) {
            lv = parseInt(par.slice(1)); // 去掉 '#' 字符
        }
        this.drug_type = lv;
        this.name = ["再生", "暴虐", "龟灵", "培元"][lv] + this.name;
    }
}
```

### 参数化装备示例

```typescript
// 文件：server/res/obj/eq/cp.ts（crafting weapons）
import { EQUIPMENT } from "../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../core/const.js";

const TYPE_INFO = {
    sword: { name: "长剑", desc: "一把手工锻造的长剑", unit: "把", weapon_type: WEAPON_TYPE.SWORD },
    blade: { name: "长刀", desc: "一把手工锻造的长刀", unit: "把", weapon_type: WEAPON_TYPE.BLADE },
    club:  { name: "长棍", desc: "一根手工锻造的长棍", unit: "根", weapon_type: WEAPON_TYPE.CLUB },
    staff: { name: "长杖", desc: "一根手工锻造的长杖", unit: "根", weapon_type: WEAPON_TYPE.STAFF },
    whip:  { name: "长鞭", desc: "一根手工锻造的长鞭", unit: "根", weapon_type: WEAPON_TYPE.WHIP },
};

export default class extends EQUIPMENT {
    unit = "把";
    name = "自制武器";
    desc = "一把手工锻造的武器";
    value = 100000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;

    on_create(path, par) {
        if (par) {
            const key = par.substring(1); // 去掉 '#'
            const info = TYPE_INFO[key];
            if (info) {
                this.name = info.name;
                this.desc = info.desc;
                this.unit = info.unit;
                this.weapon_type = info.weapon_type;
            }
        }
    }
}
```

### 参数解析辅助方法

```typescript
on_create(path, par) {
    // par 格式说明
    // 路径 "drug/yao#3"  → par = "#3"
    // 路径 "drug/buff#2"  → par = "#2"

    if (!par) {
        // 无参数时的默认行为
        this.grade = 0;
        return;
    }

    // 获取纯数字参数
    var lv = parseInt(par.slice(1)); // 去掉 '#'，解析数字

    // 多参数格式（如 "#12" 表示类型1等级2）
    // 约定 par[0] = 类型, par[1] = 等级
    var type = parseInt(par[1]);  // 类型标识
    var lv = parseInt(par[2]);    // 等级数值
}
```

---

## 8. 货币物品（money/）编写

货币物品继承自 `MONEY` 类。引擎会自动处理货币的堆叠、交易和使用。

### 黄金

```typescript
// 文件：server/res/obj/money/gold.ts
import { MONEY } from "../../../core/item/money.js";

export default class extends MONEY {
    name = "黄金";
    desc = "金子，人见人爱的金子";
    unit = "两";
    value = 10000;   // 面值 10000 铜钱
}
```

### 银子

```typescript
// 文件：server/res/obj/money/silver.ts
import { MONEY } from "../../../core/item/money.js";

export default class extends MONEY {
    name = "银子";
    desc = "银子，白花花的银子";
    unit = "两";
    value = 100;     // 面值 100 铜钱
}
```

### MONEY 类特有行为

- `is_money = true` 自动设置
- `combined = true` 自动设置（可堆叠）
- `transable = true` 自动设置（可交易）
- 物品进入角色背包时，自动转换为 `me.money` 数值增加（而非作为物品存在）
- 面值由 `value` 属性控制：黄金=10000，银子=100，铜钱=1
- 颜色自动生成：value=1 黄色，value=100 亮白，其他亮黄

### 非 MONEY 的货币等价物

有时需要创建不可直接存入钱袋的货币等价物（如金锭）：

```typescript
// 文件：server/res/obj/money/g100.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "金锭";
    desc = "金子，人见人爱的金子";
    unit = "块";
    grade = 3;
    value = 1000000;  // 面值 1000000 铜钱
    transable = true;
    // 注意：不继承 MONEY，所以以物品形式存在背包中
}
```

---

## 9. 装备物品（eq/）编写

装备继承自 `EQUIPMENT` 类，支持穿戴、卸下、强化、镶嵌宝石、套装效果等。

### 装备特有属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `eq_type` | `number` | `EQUIP_TYPE.WEAPON` (0) | 装备部位 |
| `weapon_type` | `string` | `''` | 武器类型（武器专用） |
| `prop` | `PropMap` | 未定义 | 属性加成 |
| `level` | `number` | `0` | 强化等级 0-12 |
| `hole_count` | `number` | `0` | 可用宝石孔数 |
| `st_prop` | `StoneEntry[]` | `null` | 已镶嵌宝石列表 |
| `condition` | `object` | `null` | 装备条件 |
| `group_name` | `string` | `null` | 套装组名 |
| `group_prop` | `function` | 未定义 | 套装属性计算函数 |
| `score` | `number` | `0` | 装备评分 |
| `no_fenjie` | `boolean` | 未定义 | 禁止分解 |
| `no_jinglian` | `boolean` | 未定义 | 禁止精炼 |
| `original_prop` | `object` | `null` | 原始属性（强化基准） |
| `eq_msg` | `string` | `null` | 自定义装备广播消息 |
| `uneq_msg` | `string` | `null` | 自定义卸下广播消息 |

### EQUIP_TYPE 装备部位常量

```typescript
// 定义于 server/core/const.ts
EQUIP_TYPE.WEAPON   = 0   // 武器
EQUIP_TYPE.CLOTH    = 1   // 衣服/护甲
EQUIP_TYPE.SHOES    = 2   // 鞋子
EQUIP_TYPE.HEAD     = 3   // 头部/头盔
EQUIP_TYPE.CAPE     = 4   // 披风
EQUIP_TYPE.RING     = 5   // 戒指
EQUIP_TYPE.NECKLACE = 6   // 项链
EQUIP_TYPE.JEWELS   = 7   // 饰品
EQUIP_TYPE.WRIST    = 8   // 护腕
EQUIP_TYPE.WAIST    = 9   // 腰带
EQUIP_TYPE.THROWING = 10  // 暗器
```

### WEAPON_TYPE 武器类型常量

```typescript
// 定义于 server/core/const.ts
WEAPON_TYPE.NONE     = "unarmed"    // 空手（拳套）
WEAPON_TYPE.SWORD    = "sword"      // 剑法
WEAPON_TYPE.BLADE    = "blade"      // 刀法
WEAPON_TYPE.STAFF    = "staff"      // 杖法
WEAPON_TYPE.CLUB     = "club"       // 棍法
WEAPON_TYPE.WHIP     = "whip"       // 鞭法
WEAPON_TYPE.THROWING = "throwing"   // 暗器
```

### 简单装备（武器）

```typescript
// 文件：server/res/obj/eq/lv0/jian.ts
import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "铁剑";
    desc = "一把生铁打造的剑";
    value = 2000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 1    // 攻击 +1
    };
}
```

### 简单装备（防具）

```typescript
// 文件：server/res/obj/eq/lv0/cloth.ts
import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "布衣";
    desc = "一件很普通的青色布衣";
    unit = "件";
    grade = 0;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 200;
    prop: PropMap = {
        fy: 1      // 防御 +1
    };
}
```

### 带装备条件的装备

```typescript
// 文件：server/res/obj/eq/lv4/shangfangjian.ts
import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "尚方宝剑";
    desc = "先帝御赐的尚方宝剑，上斩昏君下斩奸臣";
    unit = "把";
    grade = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = { gj: 100, mz: 50, fy: 20 };
    condition = {
        skill: { sword: 100 },  // 剑法 100 级以上
        str: 30,                 // 后天臂力 30 以上
        gender: 1                // 性别要求：男
    };
}
```

### 带套装效果的装备

套装效果通过 `group_name` 和 `group_prop` 实现：

```typescript
// 文件：server/res/obj/eq/lv2/lm_jian.ts
import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "龙纹剑";
    desc = "黑色不明材质打造，通体龙纹鳞甲";
    unit = "把";
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    hole_count = 2;          // 2 个宝石孔
    prop: PropMap = {
        gj: 80,
        int: 10,
        add_sh_per: 2
    };
    group_name = "lm2";      // 套装组名：同组名的装备组成套装

    // 根据已装备件数返回对应属性加成
    group_prop(count: number): PropMap | void {
        if (count == 3) {
            return { int: 10 };           // 3 件套：悟性 +10
        } else if (count == 5) {
            return { lianxi_per: 15, dazuo_per: 15 };  // 5 件套：练习效率 +15%，打坐效率 +15%
        }
    }
}
```

同一套装的其他部件（只需设置相同的 `group_name`）：

```typescript
// 文件：server/res/obj/eq/lv2/lm_cloth.ts
export default class extends EQUIPMENT {
    name = "龙纹服";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.CLOTH;
    hole_count = 1;
    prop = { fy: 30, int: 10, lianxi_per: 8 };
    group_name = "lm2";
    group_prop(count) { /* 同上 */ }
}

// 文件：server/res/obj/eq/lv2/lm_shoes.ts
export default class extends EQUIPMENT {
    name = "龙纹靴";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.SHOES;
    hole_count = 1;
    prop = { fy: 21, int: 10 };
    group_name = "lm2";
    group_prop(count) { /* 同上 */ }
}

// 文件：server/res/obj/eq/lv2/lm_tou.ts
export default class extends EQUIPMENT {
    name = "龙纹冠";
    unit = "顶";
    grade = 2;
    eq_type = EQUIP_TYPE.HEAD;
    hole_count = 1;
    prop = { fy: 20, int: 10, dazuo_per: 8 };
    group_name = "lm2";
    group_prop(count) { /* 同上 */ }
}
```

### 带 on_eq/on_uneq 回调的装备

```typescript
export default class extends EQUIPMENT {
    name = "神秘戒指";
    unit = "枚";
    grade = 4;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = { gj: 50, fy: 50 };
    eq_msg = "$N戴上了$o，戒指闪耀出七彩光芒。";  // 自定义装备广播
    uneq_msg = "$N摘下了$o，光芒随之消散。";        // 自定义卸下广播

    on_eq(me: CHARACTER): boolean | void {
        me.notify("你感受到一股神秘的力量涌入体内。");
        // 返回 false 阻止装备
    }

    on_uneq(me: CHARACTER): void {
        me.notify("那股神秘的力量消失了。");
    }

    on_defense(me: CHARACTER, from: CHARACTER, sh: number): number {
        // 额外减伤 10%
        return Math.floor(sh * 0.9);
    }
}
```

### 参数化装备（多等级）

```typescript
// 文件：server/res/obj/eq/tool/chu.ts
import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "铁镐";
    desc = "一根精铁制成的铁镐";
    value = 1000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;

    on_create(path, par) {
        let lv = 1;
        if (par) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv > 0 && lv < 7)) return;
        }
        this.grade = lv;
        this.prop = {
            gj: [1, 10, 40, 120, 340, 490, 690][lv],
            kuang1: [1, 5, 10, 15, 20, 25, 30][lv],   // 挖矿效率
        } as PropMap;

        if (this.grade === 6) {
            this.name = "移山镐";
            this.desc = "你可以在自家后院挖矿，更容易挖到高级的宝石";
        }
        // 调用父类 on_create 设置 value
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
```

### condition 装备条件详细说明

```typescript
condition = {
    // 技能等级要求：key=技能ID, value=最低等级
    skill: { sword: 100, force: 50 },

    // 先天属性要求（带 "1" 后缀表示先天）
    str1: 20,    // 先天臂力 ≥ 20
    con1: 20,    // 先天根骨 ≥ 20
    dex1: 20,    // 先天身法 ≥ 20
    int1: 20,    // 先天悟性 ≥ 20

    // 后天属性要求（不含后缀表示后天总和）
    str: 30,     // 后天臂力 ≥ 30（含装备加成）
    con: 30,
    dex: 30,
    int: 30,

    // 性别要求
    gender: 1,   // 1=男, 0=女

    // 自定义描述文本（仅显示不检查）
    desc: "特定条件才能装备"
};
```

---

## 10. 食物与饮品（food/）编写

食物和饮品通常使用 `add_status` 实现周期性恢复效果。

### 食物：周期性回复气血

```typescript
// 文件：server/res/obj/food/food.ts
import type { CHARACTER } from "../../../core/char/character.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "碗";
    name = "米饭";
    value = 200;
    combined = true;
    desc = "一碗热气腾腾的白米饭，吃掉后每 5 秒恢复 100 点气血。";
    action_msg = "吃";
    distime = 60000;
    transable = true;
    recover_hp = 100;

    on_use(me: CHARACTER) {
        me.send_room("$N吃下一" + this.unit + this.name + "。");
        me.add_status({
            id: "food",
            name: this.name,
            recover_hp: this.recover_hp,
            on_interval: function (me: CHARACTER) {
                let hp = me.do_recover(this.recover_hp!);
                if (hp > 0) me.notify('<hig>你恢复了' + hp + '气血。</hig>');
            },
            duration_count: 4,   // 触发次数
            duration: 5000       // 每 5 秒触发一次
        });
    }

    on_create(path: string, par: string) {
        if (!par) {
            this.path = path + "#0";
            return;
        }
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;

        switch (lv) {
            case 1:
                this.name = "包子";
                this.value = 100;
                this.recover_hp = 100;
                this.desc = "一个热气腾腾的肉包子，吃掉后每 5 秒恢复 100 点气血。";
                this.unit = "个";
                break;
            case 2:
                this.name = "鸡腿";
                this.value = 200;
                this.recover_hp = 200;
                this.desc = "一个香喷喷的鸡腿，吃掉后每 5 秒恢复 200 点气血。";
                this.unit = "个";
                break;
            case 3:
                this.name = "面条";
                this.value = 200;
                this.recover_hp = 200;
                this.desc = "一碗热气腾腾的面条，吃掉后每 5 秒恢复 200 点气血。";
                this.unit = "碗";
                break;
            case 4:
                this.name = "扬州炒饭";
                this.value = 500;
                this.recover_hp = 400;
                this.desc = "一碗香气腾腾的炒饭，吃掉后每 5 秒恢复 400 点气血。";
                this.unit = "碗";
                break;
        }
    }
}
```

### 饮品：周期性回复内力

```typescript
// 文件：server/res/obj/food/drink.ts
import type { CHARACTER } from "../../../core/char/character.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "壶";
    name = "米酒";
    value = 200;
    combined = true;
    desc = "一壶醉仙楼的米酒，喝掉后每 5 秒恢复 100 点内力。";
    action_msg = "喝";
    distime = 60000;
    recover_mp = 100;
    transable = true;

    on_use(me: CHARACTER) {
        me.send_room("$N仰头灌下一" + this.unit + this.name + "。");
        me.add_status({
            id: "drink",
            name: this.name,
            desc: this.desc,
            recover_mp: this.recover_mp,
            on_interval: function (me: CHARACTER) {
                if (me.mp < me.max_mp) {
                    me.add_mp(this.recover_mp!);
                    me.send('<blu>你恢复了' + this.recover_mp + '内力。</blu>');
                }
            },
            duration_count: 10,  // 触发 10 次
            duration: 5000       // 间隔 5 秒
        });
    }

    on_create(path: string, par: string) {
        if (!par) {
            this.path = path + "#0";
            return;
        }
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;
        // ... 按等级设置不同属性
    }
}
```

### add_status 方法参数说明

```typescript
me.add_status({
    id: "状态唯一标识",      // 用于覆盖和查重
    name: "状态显示名",
    desc: "状态描述",
    duration: 10000,         // 持续时间（毫秒）
    duration_count: 4,       // 可选：触发次数（替代 duration）
    prop: { gj: 10 },        // 可选：状态持续的属性加成
    override: 1,             // 可选：1=覆盖旧状态, 2=叠加
    recover_hp: 100,         // 自定义属性，在 on_interval 中读取
    on_interval: function(me) {
        // 每个 duration 间隔触发一次
    },
    on_end: function(me) {
        // 状态结束时触发
    }
});
```

---

## 11. 容器物品（CONTAINER）编写

容器继承自 `CONTAINER` 类，支持打开查看内部物品、拾取等功能。

### CONTAINER 特有行为

- `is_container = true` 自动设置
- `combined = false` 不可堆叠
- `on_get` 默认返回 `false`（不可拾取容器本身）
- 打开容器时调用 `on_open` 返回物品列表
- 支持 `get all from <id>` 批量拾取

### 宝箱/礼包（使用 on_open 返回随机物品）

```typescript
// 文件：server/res/obj/sp/yz/box1.ts
import { OBJ } from "../../../../core/item/obj.js";

export default class extends OBJ {
    name = "小箱子";
    desc = "这是在崔员外家找到的一个小箱子，不知道里面放了些什么。";
    unit = "个";
    value = 0;
    grade = 2;

    on_open(me) {
        // 使用 create_by_odds 生成随机掉落物品
        return OBJ.create_by_odds([
            { obj: "money/gold", min: 1, max: 10 },                          // 必掉 1-10 两黄金
            { obj: ["book/book#unarmed", "book/book#parry"], odds: 10000 },  // 必掉一本技能书（随机）
            { obj: ["st/st_blu", "st/st_red", "st/st_gre"], min: 1, max: 3, odds: 5000 }, // 50% 掉宝石
            { obj: ["eq/lv1/pifeng"], odds: 2000 },                          // 20% 掉披风
        ]);
    }
}
```

### 礼包（固定内容）

```typescript
// 文件：server/res/obj/cash/sm.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "师门补给包";
    desc = "里面有 28 个橙色师门令牌，6 个紫色师门令牌，50 精力";
    unit = "个";
    value = 0;
    grade = 5;

    on_open(me) {
        var result = [
            { obj: "cash/jing#3", count: 1 }
        ];
        return OBJ.create_by_odds(result);
    }
}
```

### 环境容器（房间中的桌子）

```typescript
// 文件：server/res/obj/food/desk.ts
import { CONTAINER } from "../../../core/item/container.js";
import { WORLD } from "../../../core/world.js";
import { OBJ } from "../../../core/item/obj.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends CONTAINER {
    name = "婚宴礼桌";
    desc = "这是醉仙楼的宴席桌子，上面放满了各种好吃的。";
    unit = "个";
    value = 0;
    grade = 1;
    combined = false;
    no_get = true;         // 禁止拾取桌子本身
    no_alloc = true;       // 不掉落

    on_create(path: string, par: string) {
        var lv = 0;
        if (par) {
            lv = parseInt(par.slice(1));
            if (!(lv > 0 && lv < 6)) lv = 0;
        }
        this.grade = lv;
    }

    // 覆写 query_items 动态生成物品列表
    query_items(me: CHARACTER) {
        if (me.query_temp("get_marry") || !WORLD.DATA.query_temp("marry")) return;
        var items: OBJ[] = [];
        var count = 1;
        if (me.id == WORLD.DATA.query_temp("mar1") || me.id == WORLD.DATA.query_temp("mar2")) count = 3;
        for (var i = 0; i < this.grade; i++) {
            var obj = OBJ.CREATE("food/marry#" + (this.random(3) + 3 * i), count);
            items.push(obj);
        }
        return items;
    }

    // 覆写 clear_items 控制拾取后的状态
    clear_items(me: CHARACTER) {
        me.set_temp("get_marry", 1, 60000 * 30);  // 30 分钟内不能再取
    }
}
```

### 容器设置初始物品

```typescript
// 在代码中创建容器时，可以使用 set_items 设置初始内容
var box = OBJ.CREATE("sp/yz/box1");
box.set_items(
    "money/gold",              // 直接传路径字符串
    ["drug/yao#1", 5],         // 传 [路径, 数量] 元组
    "eq/lv0/jian"
);
```

---

## 12. 技能书籍（book/）编写

技能书籍继承自 `OBJ`，通过 `skill` 属性指定关联技能，通过 `on_study` 回调控制学习行为。

### 技能秘籍（参数化，按技能 ID）

```typescript
// 文件：server/res/obj/book/book.ts
import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";
import { SKILL } from "../../../core/skill/skill.js";

export default class extends OBJ {
    unit = "本";
    name = "武功秘籍";
    desc = "一本武功秘籍";
    max_level = 100;
    combined = true;
    value = 0;
    otype = 1;        // 秘籍类型

    constructor() {
        super();
        // 添加额外命令
        this.add_action('sbook', '存到技能仓库', (me) => {
            WORLD.COMMANDS.sbook.enter(me, this.id);
        });
        this.add_action('split', '拆分', (me) => {
            WORLD.COMMANDS.sbook.split_book(me, this);
        });
    }

    on_create(path, par) {
        if (!par) return;
        par = par.slice(1);
        var skill = SKILL.get(par);
        if (!skill) return;
        this.skill = skill.id;         // 设置关联技能
        this.grade = skill.grade;
        var cc = this.query_grade_color();
        this.name = skill.name + "秘籍";
        this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
        this.desc = "一本武功秘籍，里面记载了" + skill.color_name + "的练习方法。";
        // 显示学习条件
        var cond = skill.condition_tostring();
        if (cond) {
            this.desc = this.desc + "\n学习条件：\n" + cond;
        }
        this.value = WORLD.DATA.book_values[this.grade];
    }

    // 学习回调：玩家使用 study 命令时调用
    on_study(me, skill, lv) {
        // skill: SKILL 对象，lv: 当前等级
        if (skill.do_learn && skill.do_learn(me, lv) == false) return false;
        return true;
    }
}
```

### 使用示例

路径 `"book/book#sword"` 创建一本剑法秘籍：
```typescript
var book = OBJ.CREATE("book/book#sword");
// 此时 skill = "sword"，name = "基本剑法秘籍"
```

### 秘籍残页（可合成）

```typescript
// 文件：server/res/obj/book/wd.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "份";
    name = "武道残页";
    desc = "一本武功秘籍碎片，需要十份残页就可以合成一本完整的武道秘籍。";
    combine_to = "book/wudao";     // 合成目标物品路径
    combine_count = 10;            // 需要 10 份合成
    grade = 5;
    otype = 1;
    // 打开合成面板时会自动检测 combine_to 和 combine_count
}
```

### 经书（四十二章经等）

```typescript
// 文件：server/res/obj/book/bc.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "本";
    name = "四十二章经";
    desc = "四十二章经之某章";
    combined = false;
    jing_index = 1;   // 经书索引（用于收集任务）
    grade = 4;
}
```

---

## 13. 宝石物品（st/）编写

宝石用于镶嵌到装备上提供属性加成。

### 宝石关键属性

- `is_stone = true` 标记为宝石
- `otype = 2` 宝石类型标识
- `st_prop` 由装备管理，宝石本身用 `prop` 定义属性
- `prop` 中的属性会在镶嵌后追加到装备上

### 基础宝石

```typescript
// 文件：server/res/obj/st/st_gj.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "朱雀之魂";
    desc = "传说为朱雀残魂所化，非金非石非木，隐隐有朱雀虚影，主毁灭，镇邪祟";
    unit = "块";
    value = 10000000;
    transable = true;
    is_stone = true;
    grade = 6;
    otype = 2;

    on_create(path: string, par: string) {
        var lv = 5;
        if (!par) {
            lv = 5 - parseInt(Math.log(this.random(400) + 1));
        } else {
            lv = parseInt(par.slice(1));
        }
        this.path = path + "#" + lv;
        switch (lv) {
            case 1:
                this.prop = { add_sh_per: 1, mz: 300 };
                this.desc += "\n最终伤害：+1%\n命中：+300";
                break;
            case 2:
                this.prop = { add_bjsh_per: 5 };
                this.desc += "\n暴击伤害：+5%";
                break;
            // ... 更多等级
        }
    }
}
```

### 可合成宝石

```typescript
// 文件：server/res/obj/st/st_sc.ts
import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";
import type { PropMap } from "../../../types/props.js";

export default class extends OBJ {
    name = "碎裂的贪狼";
    desc = "一颗神秘的宝石";
    unit = "块";
    value = 10000;
    combined = true;
    is_stone = true;
    transable = true;
    grade = 3;
    prop: PropMap = { str: 1 };
    otype = 2;

    on_create(path, par) {
        var lv = 0;
        if (par != undefined) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv >= 0 && lv < 8)) return;
        }
        var val = lv % 2 == 0 ? 10 : 40;
        var stype = parseInt(lv / 2);
        switch (stype) {
            case 0: this.name = "破军"; this.prop = { str: val }; break;
            case 1: this.name = "贪狼"; this.prop = { con: val }; break;
            case 2: this.name = "七杀"; this.prop = { dex: val }; break;
            case 3: this.name = "紫薇"; this.prop = { int: val }; break;
        }
        if (lv % 2 == 0) {
            this.name = "碎裂的" + this.name;
            this.combine_count = 10;
            this.combine_to = path + "#" + (lv + 1);  // 合成为高级
            this.grade = 4;
        } else {
            this.combine_count = 10;
            this.combine_to = "st/st_s2#" + stype;
            this.grade = 5;
        }
    }
}
```

---

## 14. 商城/充值物品（cash/）编写

商城物品通常有独特的 `on_use` 或 `on_receive` 逻辑。

### 充值物品（on_receive）

```typescript
// 文件：server/res/obj/cash/cash.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "元宝";
    desc = "这是一锭官银";
    unit = "个";
    value = 100;
    grade = 5;

    on_receive(me) {
        // 领取消息附件时，自动转换为元宝
        if (!this.count) return false;
        me.add_cash(this.count, "排行榜收取");
        // 注意：返回 false 阻止物品进入背包
    }
}
```

### 功能道具（on_use）

```typescript
// 文件：server/res/obj/cash/saodang.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "张";
    name = "扫荡符";
    desc = "使用后可以扫荡已完成关卡";
    value = 0;
    grade = 3;

    on_use(me) {
        me.notify("你使用了一张扫荡符。");
        // 触发扫荡逻辑
        return true;
    }
}
```

### 属性增加道具

```typescript
// 文件：server/res/obj/cash/jing.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "枚";
    name = "养精丹";
    desc = "一枚丹药，吃了后会增加精力";
    ad_jl = 10;
    grade = 1;
    value = 10000;

    on_use(me) {
        // 增加精力
        me.add_temp("ad_jl", this.ad_jl);
        me.notify("<hiy>你增加了" + this.ad_jl + "点精力。</hiy>");
        return true;
    }

    on_create(path, par) {
        if (!par) return;
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;
        // 按等级设置不同属性
        this.ad_jl = [20, 30, 50, 100][lv - 1];
        this.grade = lv;
    }
}
```

---

## 15. 材料物品（res/）编写

材料物品通常比较简单，主要用于收集、合成、任务提交。

```typescript
// 文件：server/res/obj/res/cao.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "株";
    name = "草药";
    desc = "一株不知名的草药";
    value = 100;
    grade = 1;
    transable = true;
}
```

```typescript
// 文件：server/res/obj/res/pimao1.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "张";
    name = "粗糙的皮毛";
    desc = "一张粗糙的皮毛，抵挡不了什么风雨";
    value = 50;
    transable = true;
}
```

```typescript
// 文件：server/res/obj/res/yu.ts
import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "条";
    name = "鱼";
    desc = "一条新鲜的鱼";
    value = 50;
    grade = 1;
    transable = true;
}
```

---

## 16. 特殊物品（sp/）编写

特殊物品用于任务、工具、场景交互等。可以非常灵活，实现复杂交互逻辑。

### 任务物品

```typescript
// 文件：server/res/obj/sp/yz/yaoshi.ts
import { OBJ } from "../../../../core/item/obj.js";

export default class extends OBJ {
    unit = "把";
    name = "铜钥匙";
    desc = "一把生了锈的铜钥匙";
    value = 0;
}
```

### 工具类物品（同时是装备）

```typescript
// 文件：server/res/obj/sp/tool/chu.ts
// 铁镐既是装备（可以拿着）也是工具
import { EQUIPMENT } from "../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "铁镐";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;

    on_create(path, par) {
        // 按等级设置属性（参考第 9 节的参数化装备示例）
    }
}
```

### 复杂交互物品

```typescript
// 文件：server/res/obj/sp/tool/zhuisha.ts
import { OBJ } from "../../../../core/item/obj.js";
import { WORLD } from "../../../../core/world.js";

export default class extends OBJ {
    unit = "个";
    name = "门派追杀令";
    desc = "使用后可以召唤门派 NPC 追杀仇人";
    grade = 1;
    value = 10000;

    on_use(me) {
        if (!me.is_player) return me.notify("你不能用追杀令。");
        me.notify("请说出你要追杀的玩家的名字（打开聊天框任意频道输入）：");
        // 等待玩家输入
        me.wait_input = this.readname.bind(this);
        return false;  // 不立即消耗物品
    }

    on_create(path, par) {
        if (!par) {
            this.path = path + "#1";
            return;
        }
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv <= 5)) return;
        this.grade = lv;
    }

    readname(me, cmd) {
        // 玩家输入后的回调处理
        if (!cmd) return me.send('请输入玩家名字：');
        var ss = cmd.split(' ');
        if (ss.length != 2) return me.notify("格式不对。");
        var name = ss[1];
        // ... 验证并执行追杀逻辑
    }
}
```

---

## 17. 随机掉落系统（create_by_odds）

`OBJ.create_by_odds()` 是静态方法，用于按概率生成物品列表。常用于宝箱、怪物掉落、礼包等。

### OddsEntry 接口

```typescript
interface OddsEntry {
    /** 掉落概率（万分比，默认 10000 = 100%） */
    odds?: number;

    /** 命中时掉落的物品路径（或路径数组，随机取一） */
    obj?: string | string[];

    /** 未命中时的保底物品路径 */
    fall_obj?: string;

    /** 固定数量（与 min/max 互斥） */
    count?: number;

    /** 随机数量最小值 */
    min?: number;

    /** 随机数量最大值 */
    max?: number;
}
```

### 基本用法

```typescript
// 必掉：1 个金创药
OBJ.create_by_odds([{ obj: "drug/yao#0", count: 1 }]);

// 必掉：1-10 两黄金
OBJ.create_by_odds([{ obj: "money/gold", min: 1, max: 10 }]);

// 20% 概率掉落披风
OBJ.create_by_odds([{ obj: "eq/lv1/pifeng", odds: 2000 }]);

// 从数组中随机选一个掉落
OBJ.create_by_odds([{ obj: ["st/st_blu", "st/st_red", "st/st_gre"], odds: 5000 }]);
```

### 多物品列表

```typescript
return OBJ.create_by_odds([
    { obj: "money/gold", min: 1, max: 5 },                    // 必掉 1-5 黄金
    { obj: "drug/yao#0", count: 2 },                          // 必掉 2 颗金创药
    { obj: "eq/lv1/pifeng", odds: 2000 },                     // 20% 掉披风
    { obj: "book/book#sword", odds: 1000 },                   // 10% 掉秘籍
    { obj: ["st/st_gj#1", "st/st_fy#1"], odds: 3000 },       // 30% 随机掉宝石
    { obj: "money/silver", fall_obj: "money/coin", odds: 5000 }, // 50% 掉银子，否则掉铜钱
]);
```

### 保底物品（fall_obj）

```typescript
// 50% 概率掉黄金，否则掉铜钱
{ obj: "money/gold", fall_obj: "money/coin", odds: 5000 }
```

---

## 18. 运行时创建物品

### 基本创建

```typescript
// 创建单个物品
var item = OBJ.CREATE("drug/yao#0");    // count 默认为 1
var item = OBJ.CREATE("drug/yao#0", 5); // 创建 5 个（堆叠）

// 克隆到容器
OBJ.clone_to("money/gold", me.items, 10);  // 给玩家 10 两黄金
OBJ.clone_to("eq/lv0/jian", container);     // 给容器放一把铁剑
```

### 添加到玩家背包

```typescript
// 创建并添加物品到玩家背包
var item = OBJ.CREATE("drug/yao#1", 3);
me.add_obj(item);  // 自动堆叠并触发 on_init/on_reload
```

### 克隆已有物品

```typescript
var original = OBJ.CREATE("eq/lv2/lm_jian");
var clone = original.clone();  // 原型克隆，保留 temp 数据
```

### 从概率列表创建

```typescript
var items = OBJ.create_by_odds([{
    obj: "money/gold",
    min: 1,
    max: 5
}, {
    obj: "drug/yao#0",
    count: 2
}]);
// items 为 OBJ[] 数组
```

---

## 19. 物品放置于房间

### 在房间文件中静态放置

```typescript
// 在房间定义的 init 方法中
set_obj("drug/yao#0");           // 放置一个金创药
set_obj("money/gold", 10);       // 放置 10 两黄金
set_obj("eq/lv0/jian");          // 放置一把铁剑
```

### 代码中动态创建

```typescript
// 创建物品并放入房间
var item = OBJ.CREATE("money/gold", 100);
room.push_item(item);
room.notify(room.get_short() + "的地上多了" + item.color_name + "。");
```

### 怪物掉落

怪兽死亡时掉落由 `CHARACTER.query_drop()` 控制，通常在 NPC 定义中通过 `drop_list` 设置：

```typescript
// 在怪兽类中
this.drop_list = [
    { obj: "money/gold", min: 1, max: 5 },
    { obj: "drug/yao#0", odds: 5000 },
    { obj: "eq/lv0/jian", odds: 1000 }
];
```

---

## 20. 命令系统（add_action）

可以通过 `add_action` 为物品添加自定义命令。

### 在构造函数中添加

```typescript
constructor() {
    super();
    this.add_action('sbook', '存到技能仓库', (me) => {
        WORLD.COMMANDS.sbook.enter(me, this.id);
    });
    this.add_action('split', '拆分', (me) => {
        WORLD.COMMANDS.sbook.split_book(me, this);
    });
}
```

### add_action 方法签名

```typescript
add_action(
    cmd: string,       // 命令名
    name: string|null, // 显示名称
    func: (...args) => any  // 执行函数
)
```

- 命令名即玩家输入的命令，例如 `sbook` 对应 `sbook <物品id>`
- 显示名称会在客户端显示为可点击按钮
- 执行函数的第一个参数通常是触发命令的角色

### 移除命令

```typescript
remove_action(name: string | string[]);
```

---

## 21. 属性大全

以下是在 `prop` 中可以使用的所有属性键。从 `server/core/const.ts` 中的 `PROPERTIES` 常量提取。

### 先天属性（角色创建时固定）

| 键 | 中文名 | 说明 |
|----|--------|------|
| `str1` | 先天臂力 | 影响攻击伤害，不可后天改变 |
| `con1` | 先天根骨 | 影响气血成长和防御 |
| `dex1` | 先天身法 | 影响躲闪和攻击速度 |
| `int1` | 先天悟性 | 影响学习和修炼效率 |

### 后天属性

| 键 | 中文名 | 说明 |
|----|--------|------|
| `str` | 臂力 | 影响攻击伤害 |
| `con` | 根骨 | 影响气血成长 |
| `dex` | 身法 | 影响躲闪和攻速 |
| `int` | 悟性 | 影响学习和修炼 |

### 基础战斗属性

| 键 | 中文名 | 说明 |
|----|--------|------|
| `gj` | 攻击 | 固定值攻击加成 |
| `fy` | 防御 | 固定值防御加成 |
| `ds` | 躲闪 | 固定值躲闪加成 |
| `zj` | 招架 | 固定值招架加成 |
| `mz` | 命中 | 固定值命中加成 |
| `per` | 容貌 | 影响部分 NPC 互动 |
| `age` | 年龄 | — |

### 百分比战斗属性

| 键 | 中文名 | 说明 |
|----|--------|------|
| `gj_per` | 攻击 | 攻击百分比加成 |
| `fy_per` | 防御 | 防御百分比加成 |
| `ds_per` | 躲闪 | 躲闪百分比加成 |
| `zj_per` | 招架 | 招架百分比加成 |
| `mz_per` | 命中 | 命中率百分比加成 |
| `bj_per` | 暴击 | 暴击率百分比加成 |

### 气血 & 内力

| 键 | 中文名 | 说明 |
|----|--------|------|
| `max_hp` | 气血 | 固定值气血上限加成 |
| `max_mp` | 内力 | 固定值内力上限加成 |
| `hp_per` | 气血 | 气血百分比加成 |
| `limit_mp` | 内力上限 | 固定值内力上限加成 |
| `gjsd` | 攻击速度 | 固定值攻速 |
| `gjsd_per` | 攻击速度 | 攻速百分比加成 |

### 绝招相关

| 键 | 中文名 | 说明 |
|----|--------|------|
| `releasetime` | 绝招释放时间 | 固定值减少释放时间 |
| `distime` | 绝招冷却时间 | 固定值减少冷却时间 |
| `expend_mp` | 内力消耗 | 固定值减少内力消耗 |
| `releasetime_per` | 绝招释放时间 | 百分比减少释放时间 |
| `distime_per` | 绝招冷却时间 | 百分比减少冷却时间 |
| `expend_mp_per` | 内力消耗 | 百分比减少内力消耗 |

### 伤害 & 减免

| 键 | 中文名 | 说明 |
|----|--------|------|
| `add_sh_per` | 最终伤害 | 最终伤害百分比加成 |
| `add_bjsh_per` | 暴击伤害 | 暴击伤害百分比加成 |
| `add_sh` | 伤害增加 | 固定值伤害增加 |
| `diff_sh_per` | 伤害减免 | 百分比伤害减免 |
| `diff_sh` | 受到的伤害减少 | 固定值伤害减免 |
| `diff_sh_per2` | 伤害减免 | 第二套伤害减免 |
| `diff_fy_per` | 忽视对方防御 | 百分比忽视防御 |
| `diff_fy_per2` | 忽视对方防御 | 第二套忽视防御 |

### 忙乱 & 抵抗

| 键 | 中文名 | 说明 |
|----|--------|------|
| `busy` | 忙乱时间 | 固定值 |
| `busy_per` | 忙乱时间 | 百分比 |
| `diff_busy` | 忽视忙乱 | 减少忙乱时间（固定值） |
| `diff_busy_per` | 忽视忙乱 | 减少忙乱时间（百分比） |
| `diff_bj` | 暴击抵抗 | 固定值 |
| `diff_downside` | 负面状态抵抗 | 固定值 |
| `diff_downside_per` | 负面状态抵抗 | 百分比 |
| `recover_per` | 疗伤效果 | 百分比加成 |
| `no_fy` | 无法防御 | 使目标无法防御 |

### 修炼效率

| 键 | 中文名 | 说明 |
|----|--------|------|
| `study_per` | 学习效率 | 百分比加成 |
| `dazuo_per` | 打坐效率 | 百分比加成 |
| `dazuo` | 打坐效率 | 固定值 |
| `lianxi_per` | 练习效率 | 百分比加成 |

### 生活技能

| 键 | 中文名 | 说明 |
|----|--------|------|
| `lianyao1` | 炼药效率 | — |
| `lianyao2` | 丹药产出 | — |
| `lianyao_exp_per` | 炼药获得经验 | — |
| `kuang1` | 挖矿效率 | — |
| `kuang_exp` | 挖矿经验 | — |
| `kuang_pot` | 挖矿潜能 | — |
| `diaoyu1` | 钓鱼效率 | — |
| `diaoyu_exp` | 钓鱼经验 | — |
| `diaoyu_pot` | 钓鱼潜能 | — |
| `caiyao1` | 采药效率 | — |
| `caiyao_exp` | 采药经验 | — |
| `caiyao_pot` | 采药潜能 | — |
| `xiulian_exp` | 闭关经验 | — |
| `shuangxiu` | 双修效率 | — |
| `fenjie` | 分解获得的玄晶 | — |

---

## 22. 常见问题与最佳实践

### 文件路径

- 物品文件放在 `server/res/obj/` 下任意子目录中
- 路径使用正斜杠 `/`，引擎会自动处理反斜杠转换
- 文件名即物品路径（不含扩展名）：`server/res/obj/drug/yao.ts` 对应路径 `drug/yao`

### import 路径

注意相对于 `server/res/obj/` 的层级，使用正确数量的 `../../`：

```
drug/yao.ts           → import { OBJ } from "../../core/item/obj.js"
eq/lv0/jian.ts        → import { EQUIPMENT } from "../../../core/item/equipment.js"
sp/yz/box1.ts          → import { OBJ } from "../../../core/item/obj.js"
```

### 何时使用 on_create vs on_init

| 回调 | 调用时机 | 典型用途 |
|------|---------|---------|
| `on_create` | 资源**加载时**（一次） | 设置 name、desc、prop、grade 等静态属性 |
| `on_init` | 物品分配给**角色时**（每次） | 初始化实例级别的状态 |
| `on_reload` | 从数据库**加载时**（每次） | 重建设备状态 |

### 防止物品消耗

在 `on_use` 中返回 `false` 可阻止物品消耗：

```typescript
on_use(me) {
    if (me.hp >= me.max_hp) {
        me.notify("你的气血已经满了。");
        return false;  // 不消耗物品
    }
    me.add_hp(100);
    // 不返回或返回 true 则消耗物品
}
```

### 堆叠物品

- `combined = true`：可堆叠，同类物品合并为一个格子，count 累加
- `combined = false`：不可堆叠，每个物品独立占一个格子
- 装备默认为 `combined = false`
- 消耗品、材料默认为 `combined = true`

### 冷却时间（distime）

- `distime` 以毫秒为单位
- `distime = 30000` 表示 30 秒冷却
- `showAction = true` 时，客户端会显示快捷按钮和冷却倒计时
- `allow_fight` 控制战斗中是否可用
- `action_msg` 设置按钮文字（"吃"、"喝"、"使用"等）
- 同物品共享冷却（基于路径），不同物品冷却独立
- 如需不同路径共享冷却，设置 `distype` 为相同字符串

### 物品描述

- `desc` 为纯文本描述
- 如需格式化显示，可在 `get_desc` 方法中覆写
- 装备类自动在 `get_desc` 中附加部位、属性、宝石等信息
- 容器类自动在 `get_desc` 中附加内部物品列表

### 调试技巧

- 物品加载失败会在服务器日志中输出错误
- 使用 `OBJ.CREATE("路径")` 如果路径不存在会抛出 `没有物品定义` 异常
- `WORLD.OBJ_STROE` 是一个 Map，可以用 `WORLD.OBJ_STROE.has("路径")` 检查物品是否已加载

### otype 选择指南

| 物品类型 | otype |
|---------|-------|
| 普通消耗品、材料、食物 | `0`（默认） |
| 技能书、秘籍、残页 | `1` |
| 宝石 | `2` |
| 装备 | `4`（EQUIPMENT 默认值） |

### 合成系统

使用 `combine_to` 和 `combine_count` 属性启用自动合成：

```typescript
export default class extends OBJ {
    combine_to = "book/wudao";     // 合成目标
    combine_count = 10;            // 需要 10 份
}
```

当玩家右键点击物品选择"合成"时，系统会自动检测同路径物品数量是否满足 `combine_count`，满足则消耗并生成 `combine_to` 物品。

### 发送房间消息

使用 `me.send_room()` 广播消息时，支持 `$N`、`$O`、`$o` 等占位符：

```typescript
me.send_room("$N吃下一" + this.unit + this.name + "。", this);
// $N → 玩家名, $o → 物品名
```

### transient 数据（temp）

`this.temp` 存储在数据库中的额外数据，可用于：

- 记录物品状态
- 存储自定义数量（如剩余使用次数）
- 存储过期时间（配合 `set_temp` 的 `time` 参数）

```typescript
// 设置临时数据（带过期时间）
this.set_temp("charge", 5, 3600000);  // 1 小时后过期

// 查询
var charge = this.query_temp("charge", 0);
```

---

> **文档版本**: v1.0
> **最后更新**: 2026-06-20
> **相关文件**: `server/core/item/obj.ts`, `server/core/item/money.ts`, `server/core/item/equipment.ts`, `server/core/item/container.ts`, `server/core/const.ts`
