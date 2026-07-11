# 二进制消息架构

> 本文档记录 open-wsmud2 二进制消息系统的完整架构，供快速了解系统设计。
> 最后更新：2026-07-12

---

## 1. 整体数据流

```
源码 (.ts)                    pack.mjs (--binary)              运行时
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ send_room(       │         │ 1. tsc 编译       │         │ send_msg_b(id,…) │
│   "literal",     │ ──编译──> │ 2. 扫描字面量      │ ──运行──> │ _build_binary_buf │
│   target)        │         │ 3. 注册模板        │         │ → Buffer payload  │
│                  │         │ 4. 替换为 send_room│         │ → room._batch_all │
│ send_room(`…     │         │    (id, target,   │         │ → markRoomDirty   │
│   ${expr}`)      │         │    expr)          │         │ → 0-16ms flush    │
└─────────────────┘         │ 5. 生成 templates │         │ → WebSocket 帧    │
└──────────────────┘         │    + parts-table  │         └──────────────────┘
                                    ↓                            ↓
                            templates-data.json           web/process.js
                            parts-table.json              ProcessBinary(data)
                            (客户端模板表+部位表)          → format/mask 还原
                                                         → perspective 视角转换
                                                         → UI 更新
```

---

## 2. 消息类型 (op 编码)

| op      | 高位 0x80 | 含义                     | 触发函数                          |
|---------|-----------|--------------------------|-----------------------------------|
| `0x12`  | 否        | 战斗/房间消息             | send_room_b / send_combat_b       |
| `0x92`  | 是        | 同上，排除自身            | send_room_others_b                |
| `0x55`  | -         | 脏数据刷新帧              | _build_dirty_refresh_frame        |
| `0x53`  | -         | HP/MP 状态变更            | notify_hp_b                       |
| `0x54`  | -         | 伤害占比广播（100ms）     | _damage_tick → _build_damage_frame|
| `0xFE`  | -         | 批处理合并帧标记（顶层）   | _flush_batch                      |
| `0x00`  | -         | raw text fallback        | notify (纯文本路径)               |

**op 高位规则**：`op & 0x80` = excludeSelf 标记，`op & 0x7F` = 真实 op。客户端据此跳过自身消息。

---

## 3. 帧格式详解

### 3.1 顶层：批处理合并帧

```
[0xFE] [frame1] [frame2] [frame3] ...
```

- 首字节 `0xFE` 标识合并帧，客户端 `ProcessBinary` 检测后 `pos=1` 开始循环消费
- 每个子帧以 `[1B op]` 起始，客户端按 op 分发到不同 case
- 一个 WebSocket 帧可能含多个不同 op 的子帧
- `0x55` 刷新帧总是作为合并帧的首子帧，确保后续 `0x12` 帧使用最新缓存

### 3.2 op 0x12 / 0x92 — 战斗/房间消息（ID-based）

```
[1B op]              0x12 或 0x92（excludeSelf）
[2B tid]             模板 ID（pure_id，大端序）
[1B idMask]          ID 掩码（3 位: bit0=A_ID, bit1=T_ID, bit2=HURT_PART）
[7B A_ID]            攻击者 ID（idMask & 0x01 时存在）
[7B T_ID]            目标 ID（idMask & 0x02 时存在，且 target 是角色）
[1B HURT_PART]       攻击部位索引（idMask & 0x04 时存在，无 len 前缀）
[1B argCount]        ^ 参数个数（0-4）
[1B argMask]         参数类型位（1=数字/浮点，0=字符串）
[1B floatMask]       浮点位（argMask=1 时，1=float64，0=varint）
[1B refMask]         TplRef 位（1=嵌套模板引用）
[参数数据...]        按 mask 类型编码
```

**ID_MASK 3 位定义**：

| 位 | 值    | 字段名    | 说明                                                |
|----|-------|-----------|-----------------------------------------------------|
| 0  | 0x01  | A_ID      | 攻击者 ID（`$N` `$W` `$P` `$T` 任意占位符）         |
| 1  | 0x02  | T_ID      | 目标 ID（`$n` `$w` `$p` 任意占位符）                |
| 2  | 0x04  | HURT_PART | 攻击部位索引（`$l`，帧内内联传递，不走缓存）        |

**HURT_PART 1B 索引编码**（高4位类型 + 低4位索引）：

| 高4位 | 类型        | 部位表             | 索引范围 |
|-------|-------------|--------------------|----------|
| 0x00  | CHARACTER   | 角色部位表（15个） | 0x00-0x0F |
| 0x10  | MONSTER     | 怪物部位表（10个） | 0x10-0x1F |

- 服务端 `attack_part` 存储为 `{ name, hert, crit, idx }` 对象，帧内只传 `packPart(type, idx)` 1B
- 客户端收到后调 `getPartName(byte)` 查 `parts-table.json` 还原中文名
- 部位中文名不再走网络传输

**客户端缓存查找**：客户端从 `Process.cur_room.items` 按 ID 查找缓存条目，提取 `name`/`w`/`c`/`th` 字段构建 sparse 数组。缓存由 `items_to_json`（进房）和 `0x55` 刷新帧（字段变更）维护。

**FMASK 8 位字段定义**（用于客户端 sparse 构建和刷新帧，存储在 templates-data.json 的 `m` 字段中）：

| 位 | 值    | 字段名    | 说明               | 缓存字段 |
|----|-------|-----------|--------------------|----------|
| 0  | 0x01  | A_NAME    | 攻击者名字         | name     |
| 1  | 0x02  | A_WEAPON  | 攻击者武器名       | w        |
| 2  | 0x04  | A_CALL3   | 攻击者第三人称称呼 | c        |
| 3  | 0x08  | T_WEAPON  | 目标武器名         | w        |
| 4  | 0x10  | A_THROW   | 暗器名             | th       |
| 5  | 0x20  | T_NAME    | 目标名字           | name     |
| 6  | 0x40  | (保留)    | 不使用             | -        |
| 7  | 0x80  | T_CALL3   | 目标第三人称称呼   | c        |

> **注**：`$l`（攻击部位）不再占用 FMASK 位，改为 ID_MASK.HURT_PART 帧内内联传递。原 A_PART 位 (0x08) 让给 T_WEAPON（`$w`），原 T_WEAPON 位 (0x40) 保留不再使用。A 侧和 T 侧的同名字段共用缓存字段（A_WEAPON/T_WEAPON 共用 `w`，A_NAME/T_NAME 共用 `name`，A_CALL3/T_CALL3 共用 `c`）。

**参数编码**：
- 字符串：`[1B len][utf8 str]`
- 整数：varint（无 LEB128 前缀，直接按字节编码）
- 浮点：`[8B float64 BE]`
- TplRef：嵌套模板，`[2B tid][1B argc][1B mask][1B floatMask][参数...]`，复用父级 A_ID/T_ID 缓存与 hurtPart

**模板 ID 编码**：`template_id = (idMask << 16) | pure_id`，发送时消费 idMask 削除回纯 uint16。

### 3.2a op 0x55 — 脏数据刷新帧

```
[1B op=0x55]
[1B count]           脏玩家数量
[count × (
  [7B id]            玩家 ID
  [1B fieldMask]     8 位 FMASK，标记哪些字段已变更
  [按 mask 顺序的字段...]  每个字段: [1B len][utf8 str]
)]
```

- 作为 `0xFE` 合并帧的首子帧发送，确保后续 `0x12` 帧使用最新缓存
- `fieldMask` 沿用 8 位 FMASK 顺序：A_NAME, A_WEAPON, A_CALL3, T_WEAPON, A_THROW, T_NAME, (0x40保留), T_CALL3
- per-player 的 A_NAME/T_NAME 都映射到 `cache.name`，A_WEAPON/T_WEAPON 都映射到 `cache.w`，A_CALL3/T_CALL3 都映射到 `cache.c`（冗余但一致）
- 0x40 保留位若置位，读取字段但不更新缓存
- 客户端收到后更新 `Process.cur_room.items` 中对应条目的 `name`/`w`/`c`/`th` 字段

**DIRTY 4 位掩码**（服务端 `_dirty_fields`，刷新帧构建时扩展为 8 位 FMASK）：

| 位 | 值    | 字段名    | 扩展为 FMASK                              |
|----|-------|-----------|-------------------------------------------|
| 0  | 0x01  | NAME      | A_NAME \| T_NAME                          |
| 1  | 0x02  | WEAPON    | A_WEAPON \| T_WEAPON                      |
| 2  | 0x04  | CALL3     | A_CALL3 \| T_CALL3                        |
| 4  | 0x10  | THROWING  | A_THROW                                   |

> **注**：PART 已移除（部位不再缓存，无需脏标记）。

**脏标记触发点**：
- `weapon_changed()` → DIRTY.WEAPON
- `equip()/unequip()` THROWING 类型 → DIRTY.THROWING
- 改名/改称号/升级 → DIRTY.NAME

**脏 Set 维护边界**：
- 进房（`item_changed isin=true`）：不加入脏 Set（`items_to_json` 已下发全量数据）
- 离房（`item_changed isin=false`）：从脏 Set 移除
- `replaceRoom`：从旧房间脏 Set 移除
- `on_clone`：重置脏 Set 为空
- `_build_dirty_refresh_frame`：双重检查 `ch.environment === this`

### 3.3 op 0x53 — HP/MP 状态变更

```
[1B op=0x53]
[1B flags]           位掩码：0x01=hp 0x02=max_hp 0x04=mp 0x08=max_mp 0x10=damage
[7B id]              玩家 ID（前4字符 24bit + hex时间戳 int32）
[按 flags 顺序的 float64 BE 值...]
```

**玩家 ID 7 字节编码**（`_pack_id`）：
- 前 3 字节：玩家 ID 前 4 字符（6bit/char × 4 = 24bit）
- 后 4 字节：玩家 ID 第 5 字符后的 hex 时间戳（int32 BE）
- 字符表：`0123456789abcdefghijklmnopqrstuvwxwz`

### 3.4 op 0x54 — 伤害占比广播

```
[1B op=0x54]
[7B targetId]        受击单位 ID
[1B count]           攻击者数量（最大 255）
[count × (
  [7B attackerId]    攻击者 ID
  [varint damage]    累计伤害值
)]
```

- 每 100ms 由全局定时器推送一次
- 客户端找到 `Process.player` 对应的 attackerId，取其 damage 值
- 调用 `Process.sc({id: targetId, damage: myDamage})` 更新 UI 伤害百分比

### 3.5 op 0x00 — raw text fallback

```
[1B op=0x00]
[1B len]
[utf8 str]
```

---

## 4. 服务端发送函数族

**文件**：`server/core/char/character.ts`

### 4.1 统一入口

```typescript
send_msg(text: string | number, target?: ITEM, isCombat?: boolean, excludeSelf?: boolean): void
```
- `typeof text === 'number'` → 二进制路径（`_send_binary`）
- `typeof text === 'string'` → 文本路径（`_build_msg` + `_broadcast_room`）

```typescript
send_msg_b(
    template_id: number | string,
    target?: ITEM,
    isCombat?: boolean,
    excludeSelf?: boolean,
    _a1?: string | number | TplRef,
    _a2?: string | number | TplRef,
    _a3?: string | number | TplRef,
    _a4?: string | number | TplRef,
): void
```
- `typeof template_id === 'string'` → `_expand_text` 展开后走文本路径
- `typeof template_id === 'number'` → `_build_binary_buf` 构建二进制 payload

### 4.2 语义包装函数

| 函数                  | isCombat | excludeSelf | 用途                     |
|-----------------------|----------|-------------|--------------------------|
| `send_room(text,t)`   | false    | false       | 房间消息（含主视角）     |
| `send_room_b(id,t,a1-a4)` | false | false      | 房间消息（二进制路径）   |
| `send_room_others(text,t)` | false | true      | 房间消息（排除自身）     |
| `send_room_others_b(id,t,a1-a4)` | false | true | 房间消息（排除自身，二进制）|
| `send_combat(text,t)` | true     | false       | 战斗消息                 |
| `send_combat_b(id,t,a1-a4)` | true | false      | 战斗消息（二进制路径）   |

**send_room_others_b 特殊处理**：自动 OR 进 `ID_MASK.A_ID << 16`，确保帧携带发送者 A_ID，客户端据此做 excludeSelf 过滤。

### 4.3 二进制构建

**`_build_binary_buf(template_id, target, a1, a2, a3, a4, excludeSelf)`**：
1. 从 `template_id` 提取 `idMask`（高 16 位）和 `pure_id`（低 16 位）
2. 判断 `hasA`/`hasT`/`hasPart`：
   - `hasA = idMask & ID_MASK.A_ID`
   - `hasT = idMask & ID_MASK.T_ID && target.check_character()`
   - `hasPart = idMask & ID_MASK.HURT_PART`
3. 部位索引打包：`partByte = packPart(is_monster ? MONSTER : CHARACTER, attack_part.idx)`（1B）
4. 预扫描 args，TplRef 的 mask OR 进外层 idMask
5. 编码 args：数字→varint，浮点→float64，字符串→len+utf8，TplRef→嵌套
6. 写入 Buffer：`[op][tid][idMask][A_ID?][T_ID?][HURT_PART?][argc][argMask][floatMask][refMask][args]`
7. op = `excludeSelf ? 0x92 : 0x12`

### 4.4 广播路径

**`_broadcast_room(payload, target, excludeself)`**：
- 二进制 payload：直接 `room._batch_all.push(payload)` + `room._batch_noncombat.push(payload)` + `markRoomDirty(room)`
- 文本 payload：遍历 `room.items`，按 `is_player`/`no_message`/`excludeself` 过滤后 `notify`

**`_broadcast_combat(payload, target)`**：
- 二进制 payload：`room._batch_all.push(payload)` + 设 `room._batch_has_combat = true` + `markRoomDirty(room)`
- 文本 payload：按 `no_mcmsg`/`no_combatmsg` 过滤

### 4.5 绝招同步

- `begin_burst()`：空函数（无操作，消息自然入 batch）
- `end_burst()`：调 `flushRoomNow(room)` 立刻 flush，确保绝招消息无延迟

### 4.6 玩家指令即时反馈

- `command()` 方法在 `do_command` 执行后调 `_flush_cmd_batch()` 立刻 flush 房间 batch
- `perform` 命令跳过（已有 `begin_burst`/`end_burst` 机制在 `use_pfm` 中）
- `wait_input` 分支（对话输入）也做 flush
- `_flush_cmd_batch()` 在 batch 为空且无脏玩家时跳过，避免无意义 flush

---

## 5. 房间批处理调度

**文件**：`server/core/world.ts` + `server/core/room/room.ts`

### 5.1 单 timer 递归调度

```
_dirty_rooms: ROOM[]      — 有待处理批次的房间队列
_flush_timer: setTimeout  — 单一调度句柄（null 表示无待处理）
```

- `markRoomDirty(room)`：房间入队（若不在队列），调 `_schedule()`
- `_schedule()`：若无 timer 且有 dirty 房间，`setTimeout(_tick, _nextDelay())`
- `_nextDelay()`：取所有 dirty 房间中最小剩余等待时间（`_batch_delay - (now - _batch_timestamp)`）
- `_tick()`：flush 所有到期房间（`now - timestamp >= _batch_delay`），未到期的留待下次，重新 `_schedule()`
- `flushRoomNow(room)`：立刻 flush 指定房间并从队列移除（由 `end_burst`/`_flush_cmd_batch` 调用）

### 5.2 动态延迟

- `_batch_delay = min(16, 玩家数)`，单位 ms
- 玩家进入房间：`_batch_delay = min(16, +1)`
- 玩家离开房间：`_batch_delay = max(0, -1)`
- 玩家迁移（`replaceRoom`）：同步调整新旧房间的 `_batch_delay`
- 上限 16ms 对齐浏览器 60Hz 渲染帧（16.7ms/帧），一个渲染帧内的动作合并成单帧

### 5.3 flush 流程（`_flush_batch`）

1. 构建脏数据刷新帧（`_build_dirty_refresh_frame`），若非空则 `unshift` 到 `_batch_all` 和 `_batch_noncombat` 首位
2. 清空 `_dirty_players` Set
3. 合并 `_batch_all` 所有 Buffer，前面 unshift `0xFE` 标记
4. `Buffer.concat` + `encodeBinaryFrame` 编码为 WebSocket 帧
5. 若 `_batch_has_combat` 且 `_batch_noncombat` 非空，单独合并非战斗帧
6. 遍历 `room.items`：
   - `no_message` 玩家：跳过
   - `no_combatmsg` 玩家：发 `mergedNonCombat`（若有），否则跳过
   - 其他玩家：发 `mergedAll`

### 5.4 ROOM 批处理字段

```typescript
_batch_all: Buffer[]           — 全量帧 payload 缓冲区
_batch_noncombat: Buffer[]     — 非战斗帧缓冲区（供 no_combatmsg 玩家）
_batch_has_combat: boolean     — 批次中是否包含战斗消息
_batch_delay: number           — 动态推送延迟（0-16ms）
_batch_timestamp: number       — 入队时间戳（0=不在 dirty 队列）
_dirty_players: Set<CHARACTER> — 脏数据玩家列表（下次 flush 编码为 0x55 刷新帧）
```

`on_clone()` 时重置所有批处理属性（含 `_dirty_players`），防止克隆房间继承脏状态。

---

## 6. 伤害占比广播服务

**文件**：`server/core/world.ts` + `server/core/char/character.ts`

### 6.1 注册/注销

- **注册**：`damage()`/`damage2()` 首次记录伤害来源时，若 `damages` 为空则 `registerDamageBroadcast(this)`
- **注销**：
  - `end_fight()` 清理 `damages` 时调 `unregisterDamageBroadcast(this)`
  - 定时器惰性兜底：`_damage_tick` 发现 `damages===null` 或 `environment===null` 时自动移除

### 6.2 100ms 定时器

```typescript
_damage_broadcast_set: Set<CHARACTER>  — 注册单位集合
_damage_timer: setInterval             — 100ms 循环（null=已停止）
```

- **按需启停**：无注册单位时 `clearInterval`，有注册时才 `setInterval`
- **_damage_tick**：遍历注册单位 → `_build_damage_frame()` → push `room._batch_all` + `markRoomDirty`
- 伤害帧走批处理缓冲区，总延迟 100-116ms（100ms 定时器 + 0-16ms batch）

### 6.3 帧构建（`_build_damage_frame`）

```
[0x54][7B targetId][1B count][count × (7B attackerId + varint damage)]
```
- 最多 255 个攻击者
- varint 编码伤害值
- 客户端找到 `Process.player` 对应的 attackerId，取 damage 值

### 6.4 伤害记录字段

```typescript
damages: Record<string, number> | null  — 按攻击者 ID 累计伤害
record_damage: boolean                  — 是否记录伤害统计
sum_damages?: number                    — 总累计伤害
_damage_registered: boolean             — 是否已注册广播
```

- `damage(sh, from, diff_fy)`：完整伤害计算 + 记录
- `damage2(sh, from)`：无防御减免 + 记录
- `damage3(sh, from)`：纯扣血，不记录

---

## 7. 客户端解析

**文件**：`web/process.js` — `ProcessBinary(data)`

### 7.1 顶层处理

```javascript
if (data[0] === 0xFE) pos = 1;  // 批处理合并帧标记
while (pos < data.length) {
    const op = data[pos++];
    const excludeSelf = (op & 0x80) !== 0;
    const realOp = op & 0x7F;
    switch (realOp) { ... }
}
```

### 7.2 op 0x12 解析流程

1. 读 `tid`（2B BE）、`idMask`（1B）
2. 按 idMask 读取 7B A_ID / 7B T_ID（`read7BId`）
3. 按 idMask 读取 1B HURT_PART 部位索引，调 `getPartName(byte)` 查表还原中文名
4. 从模板表查 8 位 `fieldMask`（`getMask(tid)`）
5. `buildSparseFromCache(fieldMask, aId, tId)`：从 `cur_room.items` 缓存按 ID 查字段构建 sparse 数组
6. 读 `argCount`/`argMask`/`floatMask`/`refMask`
7. 按 mask 类型读 args：
   - refMask → `readTplRef`（嵌套模板，复用父级 aId/tId/hurtPart）
   - argMask + floatMask → `getFloat64`
   - argMask → `readVarint`
   - else → `readStr`
8. `format(tid, fieldMask, sparse, args, hurtPart)` 还原模板文本
9. **excludeSelf 过滤**：若 `excludeSelf && aId === Process.player` → break
10. **no_mcmsg 过滤**：若 `aId === Process.player && Setting.no_mcmsg` → break
11. **视角转换**：若 `aId === Process.player` 替换 aName 为"你"；若 `tId === Process.player` 替换 tName 为"你"
12. `Process.message.push(text)` + `scroll2end()`

> **注**：excludeSelf/no_mcmsg/perspective 均用 ID 比较（非名字比较），消除名字碰撞风险。

### 7.3 op 0x55 解析流程

1. 读 `count`（1B）
2. 循环 `count` 次：
   - 读 7B 玩家 ID
   - 读 1B `fieldMask`
   - 按 FMASK 位顺序读取字段（每个字段 `[1B len][utf8 str]`），更新 `cur_room.items` 中对应条目的缓存字段：
     - 0x01 A_NAME → `item.name`
     - 0x02 A_WEAPON → `item.w`
     - 0x04 A_CALL3 → `item.c`
     - 0x08 T_WEAPON → `item.w`（与 A_WEAPON 共用）
     - 0x10 A_THROW → `item.th`
     - 0x20 T_NAME → `item.name`（与 A_NAME 共用）
     - 0x40 (保留) → 读取但不更新缓存
     - 0x80 T_CALL3 → `item.c`（与 A_CALL3 共用）

### 7.4 op 0x53 解析

1. 读 `flags`（1B）
2. 解码 7B 玩家 ID（前 3B → 4 字符，后 4B → hex 时间戳）
3. 按 flags 顺序读 float64 值（hp/max_hp/mp/max_mp/damage）
4. `Process.sc(sc)` 更新 UI

### 7.5 op 0x54 解析

1. 解码 7B 受击单位 ID
2. 读 `count`（1B）
3. 循环读 `[7B attackerId + varint damage]`
4. 若 `attackerId === Process.player`，记录 `myDamage`
5. `Process.sc({id: targetId, damage: myDamage})` 更新 UI 伤害百分比

### 7.6 二进制分析模式

`Setting.show_binary` 开启时，消息末尾追加解析数据。字段值来自 `cur_room.items` 缓存（非帧内下发），标签加 `(cache)` 前缀标识：
```
(b-0x12 tid:42 idMask:0x7 aId:xxx tId:yyy hurtPart:头部 (cache)A_NAME:张三 (cache)T_NAME:李四 args:[5])
(b-0x92 tid:108 idMask:0x1 aId:xxx args:[3,7])
```

---

## 8. pack.mjs 打包流程

**文件**：`scripts/pack.mjs`

**命令**：`node scripts/pack.mjs --binary`

### 8.1 流程

1. **tsc 编译**：`server/` → `server/dist/`
2. **部署**：`dist/core/` → `core/`，`dist/res/` → `res/`
3. **Pass 0**：扫描 `start_msg`/`finish_msg` 字面量
4. **Pass 1**：扫描 `send_room`/`send_room_others`/`send_combat` 字面量
   - 单引号/双引号：`CALL_RE` 匹配，允许 `\s*` 多行格式
   - 反引号：`CALL_BT_RE` 匹配，含 `${}` 的用 `extractInterpolation` 提取为 `^` + 尾参
5. **Pass 1.5**：扫描已知安全上下文字面量
   - action 数组：`attack_actions`/`dodge_actions`/`parry_actions`/`..._vs_..._actions`
   - DoAttackPar 属性：`attack_msg`/`miss_msg`/`parry_msg`/`damage_msg`/`attack_before`
   - `_to_b` 后缀变量赋值
   - 消息数组：`status_msg`/`WINNER_MSG`/`catch_hunt_msg`/`guard_msg`/`DIE_MSG`/`ask_dunno`/`look_str`/`rollDesc`
6. **Pass 2**：扫描 `_tmpl('literal')` 标记 → 替换为模板 ID
7. **生成模板数据**：
   - `templates-data.json`：客户端模板表（`{v:1, d:{id:{t:literal, m:fieldMask}}}`)
   - `parts-table.json`：客户端部位名表（`{character: [...15项], monster: [...10项]}`）
   - `core/templates-build.js`：服务端模板注册（`register(literal)`）
8. **Pass 3**：替换调用点
   - `send_room("literal", ...)` → `send_room(id, ...)`（保留函数名，typeof 分支路由）
   - `send_room(\`literal\`, ...)` → `send_room(id, ..., expr1, expr2)`（`${}` 表达式作尾参）
   - 已知上下文字符串字面量 → 模板 ID
   - `notify_hp(` → `notify_hp_b(`

### 8.2 模板 ID 编码

```
template_id = (idMask << 16) | pure_id
```
- `idMask`：3 位 ID 掩码（A_ID/T_ID/HURT_PART），由 `computeIdMask(text)` 根据模板中的占位符计算
- `pure_id`：模板序号（从 0 递增）
- 发送时 `_build_binary_buf` 消费 idMask 削除回纯 uint16

### 8.3 掩码计算

**`computeIdMask(text)`**（3 位）：
- `$N`/`$W`/`$P`/`$T` → A_ID (0x01)
- `$n`/`$w`/`$p` → T_ID (0x02)
- `$l` → HURT_PART (0x04)

**`computeFieldMask(text)`**（8 位 FMASK）：
- `$N` → A_NAME (0x01)
- `$W` → A_WEAPON (0x02)
- `$P` → A_CALL3 (0x04)
- `$w` → T_WEAPON (0x08)
- `$T` → A_THROW (0x10)
- `$n` → T_NAME (0x20)
- `$p` → T_CALL3 (0x80)
- `$l` 不设置 fieldMask（改为 idMask HURT_PART 内联传递）

### 8.4 `${}` 插值处理

`extractInterpolation(literal)`：
1. 扫描 `${` 开始，按花括号深度匹配到 `}`
2. 提取表达式内容，模板中替换为 `^`
3. 返回 `{template: 含^的纯模板, exprs: 表达式列表}`

**转换示例**：
```typescript
// 源码
me.send_room(`\n$N对著$n喝道：「${target.call(true)}！今日不是你死就是我活！」\n`, target);

// pack 后
me.send_room(id, target, target.call(true));
// 模板注册为：\n$N对著$n喝道：「^！今日不是你死就是我活！」\n
```

### 8.5 `_to_b` 后缀约定

`var msg_to_b = '...'` 被 `TO_B_RE_C` 自动扫描注册为模板，运行时 `msg_to_b` 变量值为模板 ID（number）。

---

## 9. 模板系统

**文件**：`server/core/templates.ts` + `web/templates.js`

### 9.1 占位符

| 占位符 | 含义           | 归属侧   | 编码方式                        |
|--------|----------------|----------|---------------------------------|
| `$N`   | 攻击者名字     | A_ID     | FMASK.A_NAME (0x01)，缓存       |
| `$n`   | 目标名字       | T_ID     | FMASK.T_NAME (0x20)，缓存       |
| `$W`   | 攻击者武器名   | A_ID     | FMASK.A_WEAPON (0x02)，缓存     |
| `$w`   | 目标武器名     | T_ID     | FMASK.T_WEAPON (0x08)，缓存     |
| `$P`   | 攻击者第三人称 | A_ID     | FMASK.A_CALL3 (0x04)，缓存      |
| `$p`   | 目标第三人称   | T_ID     | FMASK.T_CALL3 (0x80)，缓存      |
| `$l`   | 攻击部位       | A_ID     | ID_MASK.HURT_PART (0x04)，帧内内联 1B 索引 |
| `$T`   | 暗器名         | A_ID     | FMASK.A_THROW (0x10)，缓存      |
| `^`    | 运行时参数     | -        | argMask/floatMask/refMask       |

> **注**：`$i` 已淘汰（原目标武器名，现统一用 `$w`）。

### 9.2 视角转换

客户端用 ID 比较（非名字比较）做视角转换：
- 若 `aId === Process.player`：第一人称转换（aName→"你"）
- 若 `tId === Process.player`：第二人称转换（tName→"你"）
- 否则：第三人称（原样）

### 9.3 `no_mcmsg` 设置

- 玩家可设置不显示自己的普通战斗信息
- 客户端在 op 0x12 解析后：若 `aId === Process.player && Setting.no_mcmsg` → break

---

## 10. excludeself 机制

### 10.1 设计原则

- `send_room`/`send_room_b` **不提供** excludeself 参数（去除固定占位）
- excludeself 语义由独立函数 `send_room_others`/`send_room_others_b` 承担
- 二进制路径编码进 op 高位（`0x12 | 0x80 = 0x92`），不占额外字节

### 10.2 客户端过滤

```javascript
const excludeSelf = (op & 0x80) !== 0;
// ...
if (excludeSelf && aId === Process.player) break;  // 用 ID 比较，跳过自身消息
```

### 10.3 send_room_others_b 特殊处理

自动 OR 进 `ID_MASK.A_ID << 16`，确保帧携带发送者 A_ID，客户端才能做 `aId === Process.player` 过滤。

---

## 11. 部位表系统

**文件**：`server/core/templates.ts`（服务端） + `web/templates.js`（客户端） + `parts-table.json`（数据）

### 11.1 部位表结构

```json
{
  "character": ["左脚","右脚","左腿","右腿","小腹","胸前","后背","头部","颈部","后心","左肩","右肩","左手","左手","腰间"],
  "monster": ["左爪","右爪","后腿","小腹","胸前","背部","头部","颈部","前肢","腰间"]
}
```

### 11.2 索引编码

1 字节：`[高4位类型][低4位索引]`

| 类型       | 高4位 | 索引范围 | 部位数 |
|------------|-------|----------|--------|
| CHARACTER  | 0x00  | 0-14     | 15     |
| MONSTER    | 0x10  | 0-9      | 10     |

### 11.3 服务端工具

- `PART_TYPE.CHARACTER` / `PART_TYPE.MONSTER`：类型常量
- `packPart(type, idx)`：打包为 1B
- `getPartName(packed)`：解包查名（服务端文本路径用）
- `exportPartsTable()`：导出部位名表（pack.mjs 生成 JSON 用）

### 11.4 客户端工具

- `getPartName(packed)`：解包查名（从 `PartsTable[typeIdx][idx]` 取值）
- 启动时从 `/parts-table.json` 加载部位表

### 11.5 AttackPart 接口

```typescript
interface AttackPart {
    name: string;   // 部位名称（服务端文本路径用）
    hert: number;   // 伤害倍率
    crit: number;   // 暴击率加成
    idx: number;    // 部位表索引（二进制帧编码用）
}
```

- `CHARACTER.query_part()` 返回 `CHARACTER_PARTS` 中的项
- `MONSTER.query_part()` 覆写返回 `MONSTER_PARTS` 中的项
- `_build_binary_buf` 根据 `is_monster` 选择部位表类型

---

## 12. 关键文件索引

| 文件 | 作用 |
|------|------|
| `server/core/char/character.ts` | CHARACTER 基类：send 函数族、`_build_binary_buf`、`_broadcast_room`/`_broadcast_combat`、`notify_hp_b`、`_build_damage_frame`、`damage`/`damage2`/`damage3`、`format_msg`、`command`（即时反馈） |
| `server/core/char/monster.ts` | MONSTER：覆写 `query_part` 返回怪物部位 |
| `server/core/world.ts` | 世界单例：主心跳、房间批处理调度（`markRoomDirty`/`_tick`/`_schedule`/`flushRoomNow`）、伤害广播服务 |
| `server/core/room/room.ts` | ROOM：批处理缓冲区字段、`_dirty_players` Set、`_build_dirty_refresh_frame`、`_flush_batch`、`on_clone`重置、`replaceRoom`迁移、动态延迟维护、`items_to_json`/`item_json`（含 w/c/th 缓存字段） |
| `server/core/templates.ts` | 模板系统：`ID_MASK`/`FMASK`/`PART_TYPE`/`computeIdMask`/`computeFieldMask`/`get`/`popcount`/`packPart`/`getPartName`/`exportPartsTable` |
| `scripts/pack.mjs` | 编译打包脚本：tsc + 模板扫描注册 + 调用点替换 + 生成 templates-data.json + parts-table.json |
| `web/process.js` | 客户端二进制帧解析：`ProcessBinary`、op 0x12/0x55/0x53/0x54/0x00、`read7BId`、`buildSparseFromCache`、`readTplRef` |
| `web/templates.js` | 客户端模板表：`format`/`perspective`/`ready`/`getMask`/`getPartName`，加载 templates-data.json + parts-table.json |
| `web/combat.js` | 战斗 UI：`StatusChanged`/`AppendStatusItem` |

---

## 13. 性能特征

### 13.1 延迟

- **战斗/房间消息**：0-16ms（批处理动态延迟）
- **HP/MP 状态**：0-16ms（走批处理）
- **伤害占比**：100-116ms（100ms 定时器 + 0-16ms batch）
- **绝招同步**：0ms（`end_burst` 立刻 flush）
- **玩家指令反馈**：0ms（`command()` 后立刻 flush）

### 13.2 带宽节省

- 模板 ID 替换字面量：长字符串（50-100B）→ 2B tid
- ID-based 字段传递：A_NAME/T_NAME 等 8 个字段不再帧内传输，改为 7B ID + 客户端缓存查找
- 部位索引编码：中文名（3-6B utf8）→ 1B 索引
- 字段掩码：只发送需要的字段，避免冗余
- varint 编码：小数字 1 字节，比 float64 省 7 字节
- 批处理合并：多个消息合并为单个 WebSocket 帧，减少帧开销

### 13.3 内存

- 每房间批处理缓冲区：`_batch_all` + `_batch_noncombat`（Buffer 数组）
- 每房间脏玩家 Set：`_dirty_players`，仅在字段变更时累积，flush 后清空
- 伤害广播集合：`Set<CHARACTER>`，仅战斗中的 Boss/单位注册
- 定时器按需启停：无注册单位时 `clearInterval`，空闲零开销
- 客户端缓存：复用 `cur_room.items`，无独立数据结构
