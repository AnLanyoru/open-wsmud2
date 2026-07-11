/**
 * 模板字符串注册表 — 服务端/客户端共享的字符串驻留系统
 *
 * 模板 ID 单调递增，永不回收，保证热更新兼容。
 * 打包阶段扫描 send_room/send_combat 的字面量参数，
 * 调用 register() 分配 ID，生成映射表随前端资源一起下发。
 *
 * 二进制帧优化：0x12 帧不再携带字符串字段，改为携带 7B 玩家 ID，
 * 客户端从 cur_room.items 缓存中按 ID 查找字段值。
 */

// ============================================================
// ID 掩码 — 标记 0x12 帧需要携带哪些 ID（2 位有效，6 位保留）
// ============================================================

export const ID_MASK = {
    A_ID: 0x01,       // $N $W $P $T — 攻击者侧任意占位符
    T_ID: 0x02,       // $n $w $i $p — 目标侧任意占位符
    HURT_PART: 0x04,  // $l — 攻击部位（帧内内联传递，不缓存）
} as const;

// ============================================================
// 字段掩码 — 标记模板需要哪些实体属性（8 位，用于刷新帧和客户端 sparse 构建）
// ============================================================

export const FMASK = {
    A_NAME: 0x01, // $N
    A_WEAPON: 0x02, // $W
    A_CALL3: 0x04, // $P
    T_WEAPON: 0x08, // $w $i (原 A_PART 位，$l 改为帧内内联)
    A_THROW: 0x10, // $T
    T_NAME: 0x20, // $n
    // 0x40 保留（原 T_WEAPON 已移至 0x08）
    T_CALL3: 0x80, // $p
} as const;

/** 全字段数组索引 → 掩码位 */
export const FIELD_TO_MASK: number[] = (() => {
    const m: number[] = [];
    m[0] = FMASK.A_NAME;
    m[1] = FMASK.A_WEAPON;
    m[2] = FMASK.A_CALL3;
    m[3] = FMASK.T_WEAPON;
    m[4] = FMASK.A_THROW;
    m[5] = FMASK.T_NAME;
    m[6] = 0x40; // 保留
    m[7] = FMASK.T_CALL3;
    return m;
})();

/**
 * 计算模板的 ID 掩码 — 用于 template_id 编码 (mask << 16 | pure_id)
 * 0x12 帧按此掩码决定是否携带 A_ID / T_ID（各 7 字节）
 */
function computeIdMask(text: string): number {
    let mask = 0;
    // A_ID: 攻击者侧占位符（$l 不再触发 A_ID，改为 HURT_PART 内联传递）
    if (text.includes('$N') || text.includes('$W') || text.includes('$P') || text.includes('$T')) {
        mask |= ID_MASK.A_ID;
    }
    // T_ID: 目标侧占位符（$w 现在是 T武器，归属目标侧）
    if (text.includes('$n') || text.includes('$w') || text.includes('$i') || text.includes('$p')) {
        mask |= ID_MASK.T_ID;
    }
    // HURT_PART: 攻击部位（帧内内联，不走缓存）
    if (text.includes('$l')) {
        mask |= ID_MASK.HURT_PART;
    }
    return mask;
}

/**
 * 计算模板的字段掩码 — 8 位 FMASK，导出到客户端供 sparse 构建使用
 * 客户端按此掩码从 cur_room.items 缓存中提取字段填充 sparse 数组
 */
function computeFieldMask(text: string): number {
    let mask = 0;
    if (text.includes('$N')) mask |= FMASK.A_NAME;
    if (text.includes('$W')) mask |= FMASK.A_WEAPON;
    if (text.includes('$P')) mask |= FMASK.A_CALL3;
    if (text.includes('$w') || text.includes('$i')) mask |= FMASK.T_WEAPON;
    if (text.includes('$T')) mask |= FMASK.A_THROW;
    if (text.includes('$n')) mask |= FMASK.T_NAME;
    if (text.includes('$p')) mask |= FMASK.T_CALL3;
    // $l 不再设置 fieldMask（改为 idMask HURT_PART 内联传递）
    return mask;
}

/** 统计掩码中有多少个置位 */
export function popcount(mask: number): number {
    let n = 0;
    while (mask) {
        n++;
        mask &= mask - 1;
    }
    return n;
}

// ============================================================
// 注册表
// ============================================================

interface TemplateEntry {
    text: string;
    /** ID 掩码 (2 位) — 用于 template_id 编码，决定 0x12 帧携带哪些 ID */
    idMask: number;
    /** 字段掩码 (8 位 FMASK) — 导出到客户端，供 sparse 构建使用 */
    fieldMask: number;
}

const _templates: Map<string, number> = new Map();
const _entries: TemplateEntry[] = [];

/** 注册模板字符串，返回 ID（已存在则返回旧 ID） */
export function register(text: string): number {
    let id = _templates.get(text);
    if (id !== undefined) return id;
    id = _entries.length;
    _templates.set(text, id);
    _entries.push({ text, idMask: computeIdMask(text), fieldMask: computeFieldMask(text) });
    return id;
}

/** 批量注册并返回 ID 数组 */
export function registerAll(strings: readonly string[]): number[] {
    return strings.map(register);
}

/** 通过 ID 获取模板文本 */
export function get(id: number): string | undefined {
    return _entries[id]?.text;
}

/** 通过文本查找模板 ID（未注册返回 undefined） */
export function getId(text: string): number | undefined {
    return _templates.get(text);
}

/** 获取模板的 ID 掩码（用于 template_id 编码） */
export function getMask(id: number): number {
    return _entries[id]?.idMask ?? 0;
}

/** 获取模板的字段掩码（8 位 FMASK，用于客户端 sparse 构建） */
export function getFieldMask(id: number): number {
    return _entries[id]?.fieldMask ?? 0;
}

/** 模板总数 */
export function count(): number {
    return _entries.length;
}

/** 导出映射表（用于发送给客户端，m 为 8 位 fieldMask） */
export function exportTable(): Record<number, { t: string; m: number }> {
    const out: Record<number, { t: string; m: number }> = {};
    for (let i = 0; i < _entries.length; i++) {
        out[i] = { t: _entries[i].text, m: _entries[i].fieldMask };
    }
    return out;
}

// ============================================================
// 全局挂载 — 技能文件无需 import
// ============================================================

/**
 * 标记字符串为可预编译模板 — pack.mjs --binary 将 _tmpl('...') 替换为数字 ID。
 */
function _tmpl(s: string): string { return s; }

declare global {
    var _tmpl: (s: string) => string;
}
globalThis._tmpl = _tmpl;
