# NPC 属性计算流程

本文说明普通 `NPC` 从属性配置到 `recount()` 产出战斗属性的完整链路。核心实现位于 `server/core/char/character.ts`；`server/core/char/npc.ts` 没有覆写 `recount()`，因此普通 NPC 直接使用 `CHARACTER.recount()`。

## 1. 总体流程

```text
NPC 模板字段与 prop
        │
        ├─ clone()：复制模板 prop、技能和装备
        │
        └─ init()：汇总装备、套装、技能属性
                  │
                  ▼
            add_prop()/change_prop()
                  │
                  ├─ 数值累计到 prop
                  └─ _recount_dirty = true
                           │
                           ▼
                     recount()
                           │
                           ├─ 计算 gjsd/gj/fy/mz/ds/zj/bj
                           ├─ 执行轻功、招架技能的重算回调
                           └─ 计算 diff_sh_per/diff_fy_per
                                    │
                                    ▼
                         战斗入口读取计算结果
```

NPC 克隆时会临时设置 `_recount_suppressed = true`，避免 `init()` 汇总每一项装备、技能属性时反复计算。`init()` 完成后解除抑制，只执行一次 `recount()`，随后把 `hp`、`mp` 补满为 `max_hp`、`max_mp`。

## 2. `prop` 的来源与汇总

`npc.prop` 的有效值由以下来源共同组成；除模板已有值外，运行期增量通常通过 `add_prop()` 或 `change_prop()` 累计：

- NPC 模板直接声明的 `prop`；克隆体通过 `Object.create(template.prop)` 继承模板值，并在自身记录后续增量。
- 已装备物品的 `prop`、精炼属性 `st_prop` 和套装属性 `group_prop()`。
- 技能的基础属性 `query_prop()`、当前启用位置的 `query_enable_prop()` 以及已生效的进阶词条。
- Buff/Debuff 的 `prop`，叠层状态会按层数重复加减。
- `add_combat_prop()` 添加的战斗临时属性。
- 业务代码直接调用 `add_prop()` / `change_prop()` 添加的属性。

记 `P(name) = npc.query_prop(name)`。属性不存在时 `P(name)` 固定返回 `0`。

`str`、`con`、`dex` 等 NPC 实例字段是基础四维；`P('str')`、`P('con')`、`P('dex')` 则是 `prop` 中的附加量。两者不是同一个存储位置，公式对它们的使用方式也不完全相同。

## 3. Dirty 缓存与触发规则

`recount()` 是带 dirty 缓存的重算，不是无条件强制刷新：

```ts
if (this._recount_suppressed || !this._recount_dirty) return;
this._recount_dirty = false;
```

- `add_prop()`、`clear_prop()` 会把 `_recount_dirty` 设为 `true`。
- `change_prop()`、装备、技能、状态和战斗临时属性最终都经由 `add_prop()`，因此会自动标脏。
- 多次属性变更可以合并，第一次真正消费时只计算一次。
- `ensure_recount()` 内部只是调用 `recount()`，同样遵守 dirty 判断。

需要特别注意：直接赋值 `npc.str`、`npc.con`、`npc.dex` 或直接替换/修改 `npc.prop` 不会自动标脏。若对象已经完成过重算，随后只做这类直接赋值，再调用 `recount()` 也可能因为 dirty 为 `false` 而直接返回。动态初始化代码应优先通过 `clear_prop()`、`add_prop()`、`change_prop()` 形成一次明确的属性更新批次。

## 4. 战斗属性公式

下表中的 `trunc(x)` 对应全局 `int(x)`，实现是 `Math.trunc()`，即直接截去小数部分而不是四舍五入。

| 结果字段 | 计算公式与顺序 |
| --- | --- |
| 攻击间隔 `gjsd` | 先令 `base = 4000 - P('gjsd')`。若 `base <= 500`，结果为 `500`；否则结果为 `max(500, trunc(base × (100 - P('gjsd_per')) / 100))`。单位为毫秒。 |
| 攻击力 `gj` | `trunc(str + (P('gj') + P('str') × str / 10) × (100 + P('gj_per')) / 100)`。基础 `str` 在百分比乘区之外。 |
| 防御力 `fy` | `trunc(((str + con) / 10 + P('fy') + P('con') × con / 10) × (100 + P('fy_per')) / 100)`。 |
| 命中 `mz` | `trunc((dex / 2 + P('mz')) × (100 + P('mz_per')) / 100)`。 |
| 躲闪 `ds` | 先计算 `trunc((dex / 2 + P('ds') + P('dex') × dex / 10) × (100 + P('ds_per')) / 100)`，再加上当前轻功 `dodge_skill.on_recount_dodge(npc)` 的返回值（若实现）。 |
| 招架 `zj` | 先计算 `trunc((str / 2 + P('zj') + P('str') × str / 10) × (100 + P('zj_per')) / 100)`，再加上当前招架技能 `parry_skill.on_recount_parry(npc)` 的返回值（若实现）。 |
| 暴击率 `bj` | `trunc(dex / 10 + P('bj_per'))`，单位为百分比。当前公式不读取 `P('bj')`。 |

轻功和招架回调发生在对应基础公式截断之后，回调结果相加后不会再次执行 `int()`。

### 4.1 伤害减免与忽视防御

`diff_sh_per` 和 `diff_fy_per` 使用相同的收敛规则。先取普通部分 `x = P(name)`：

```text
x <= 80：result = x
x > 80 ：result = 80 + 20 × tanh((x - 80) × 0.04)
```

然后再加不衰减部分：

```text
diff_sh_per = converge(P('diff_sh_per')) + P('diff_sh_per2')
diff_fy_per = converge(P('diff_fy_per')) + P('diff_fy_per2')
```

因此普通部分超过 `80` 后逐渐逼近 `100`，但不会硬截断；`diff_sh_per2`、`diff_fy_per2` 在收敛之后直接相加，也没有最终上限钳制。

## 5. 哪些属性不由普通 NPC 的 `recount()` 计算

普通 NPC 的 `recount()` 只写入：

```text
gjsd, gj, fy, mz, ds, zj, bj, diff_sh_per, diff_fy_per
```

它不会修改 `hp`、`mp`、`max_hp`、`max_mp`、基础四维或其他 `prop`。

虽然 `CHARACTER` 另有 `recount_max_hp()`：

```text
max_hp = trunc(
    con × 5
    + (max_mp × query_force_rad() + P('max_hp') + P('con') × con)
      × (100 + P('hp_per')) / 100
)
```

但普通 `NPC` 不会自动调用它。NPC 通常应直接配置或动态赋值 `max_hp`；如业务明确需要按根骨、内力和内功换算气血上限，须显式调用 `recount_max_hp()` 或像比武镜像 NPC 那样覆写 `recount()`。

相比之下，`USER` 和 `FOLLOWER` 的覆写会在 `super.recount()` 后自动调用 `recount_max_hp()`。`server/res/cmd/extend/biwu.ts` 创建的特殊 NPC 也会临时替换 `recount()`，加入相同逻辑。这些不是普通 NPC 的默认行为。

## 6. 重算结果何时被消费

属性变更代码可以主动调用 `recount()`，但关键战斗入口也会通过 `ensure_recount()` 延迟刷新，主要包括：

- `do_attack()`：攻击方和目标双方都会确保属性最新。
- `from_attack()`、`damage()`：受到攻击和伤害结算前确保防御属性最新。
- `auto_attack()`：自动攻击循环读取 `gjsd` 等字段前刷新。
- `do_escape()`：读取自身 `ds`、`gjsd` 前刷新。

因此典型运行方式是“属性变更时标脏，战斗消费时按需重算”。显式 `recount()` 适合需要立即读取结果字段的初始化或业务代码。

## 7. 常见注意事项

- `gjsd` 表示攻击间隔，数值越小攻击越快，最低为 `500ms`；`gjsd` 和 `gjsd_per` 都是“加快”属性。
- `gj_per` 只放大括号内的附加攻击部分，不放大最外层的基础 `str`；其他百分比属性应按各自公式理解，不能统一套用。
- `P('str')` 同时影响攻击和招架，`P('con')` 影响防御，`P('dex')` 只在本流程中额外影响躲闪。
- `P('bj')` 虽在 `PropMap` 中有定义，但当前 `recount()` 的暴击公式只读取 `bj_per`。
- `recount()` 不会清空或重新收集 `prop`；属性的附加/移除由装备、技能、状态等上游逻辑负责，它只根据当前汇总值生成派生字段。
- 若覆写 `recount()`，应在覆写层保留 dirty/suppressed 判断，再调用 `super.recount()`；需要追加最大气血计算时，再调用 `recount_max_hp()`。
