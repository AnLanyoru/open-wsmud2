/**
 * 模板字符串注册表 — 服务端/客户端共享的字符串驻留系统
 *
 * 模板 ID 单调递增，永不回收，保证热更新兼容。
 * 打包阶段扫描 send_room/send_combat 的字面量参数，
 * 调用 register() 分配 ID，生成映射表随前端资源一起下发。
 */

// ============================================================
// 字段掩码 — 标记模板需要哪些实体属性
// ============================================================

export const FMASK = {
  A_NAME: 0x01, // $N
  A_WEAPON: 0x02, // $W $w
  A_CALL3: 0x04, // $P
  A_PART: 0x08, // $l
  A_THROW: 0x10, // $T
  T_NAME: 0x20, // $n
  T_WEAPON: 0x40, // $i
  T_CALL3: 0x80, // $p
} as const;

/** 全字段数组索引 → 掩码位 */
export const FIELD_TO_MASK: number[] = (() => {
  const m: number[] = [];
  m[0] = FMASK.A_NAME;
  m[1] = FMASK.A_WEAPON;
  m[2] = FMASK.A_CALL3;
  m[3] = FMASK.A_PART;
  m[4] = FMASK.A_THROW;
  m[5] = FMASK.T_NAME;
  m[6] = FMASK.T_WEAPON;
  m[7] = FMASK.T_CALL3;
  return m;
})();

/** 根据模板文本计算字段掩码 */
function computeMask(text: string): number {
  let mask = 0;
  if (text.includes("$N")) mask |= FMASK.A_NAME;
  if (text.includes("$n")) mask |= FMASK.T_NAME;
  if (text.includes("$P")) mask |= FMASK.A_CALL3;
  if (text.includes("$p")) mask |= FMASK.T_CALL3;
  if (text.includes("$l")) mask |= FMASK.A_PART;
  if (text.includes("$W") || text.includes("$w")) mask |= FMASK.A_WEAPON;
  if (text.includes("$i")) mask |= FMASK.T_WEAPON;
  if (text.includes("$T")) mask |= FMASK.A_THROW;
  // $N 和 $n 至少有一个时，双方 name 都带上（客户端视角转换需要名字）
  if (mask & (FMASK.A_NAME | FMASK.T_NAME)) {
    mask |= FMASK.A_NAME | FMASK.T_NAME;
  }
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
  /** 字段掩码 — 标记需要哪些实体属性 */
  mask: number;
}

const _templates: Map<string, number> = new Map();
const _entries: TemplateEntry[] = [];

/** 注册模板字符串，返回 ID（已存在则返回旧 ID） */
export function register(text: string): number {
  let id = _templates.get(text);
  if (id !== undefined) return id;
  id = _entries.length;
  _templates.set(text, id);
  _entries.push({ text, mask: computeMask(text) });
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

/** 获取模板的字段掩码 */
export function getMask(id: number): number {
  return _entries[id]?.mask ?? 0;
}

/** 模板总数 */
export function count(): number {
  return _entries.length;
}

/** 导出映射表（用于发送给客户端） */
export function exportTable(): Record<number, { t: string; m: number }> {
  const out: Record<number, { t: string; m: number }> = {};
  for (let i = 0; i < _entries.length; i++) {
    out[i] = { t: _entries[i].text, m: _entries[i].mask };
  }
  return out;
}
