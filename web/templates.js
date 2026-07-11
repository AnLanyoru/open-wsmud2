/**
 * 模板字符串驻留表 — 客户端本地模板还原引擎
 *
 * 启动时从 /templates-data.json 加载映射表（Express 自动 gzip），
 * 服务端二进制帧按需发送实体字段（由 mask 控制），
 * 客户端根据 mask 重建字段数组后还原文本，再做视角转换。
 */

// ============================================================
// 注册表
// ============================================================

const Table = {};
const MaskTable = {};
let Version = 0;
let _ready = false;

/** 等待模板表加载完成的 Promise */
export const ready = (async () => {
    try {
        const resp = await fetch('/templates-data.json');
        if (resp.ok) {
            const { v, d } = await resp.json();
            if (v > Version && d) {
                Version = v;
                for (const tid of Object.keys(d)) {
                    Table[tid] = d[tid].t;
                    MaskTable[tid] = d[tid].m;
                }
            }
        }
    } catch (_) { /* 网络错误或 JSON 不存在 → 退化为文本路径 */ }
    _ready = true;
})();

function isReady() { return _ready; }

// ============================================================
// 字段掩码 — 与服务端 FMASK 同步
// ============================================================

const MASK = {
    A_NAME:   0x01,
    A_WEAPON: 0x02,
    A_CALL3:  0x04,
    A_PART:   0x08,
    A_THROW:  0x10,
    T_NAME:   0x20,
    T_WEAPON: 0x40,
    T_CALL3:  0x80,
};

const MASK_TO_IDX = {
    0x01: 0, 0x02: 1, 0x04: 2, 0x08: 3,
    0x10: 4, 0x20: 5, 0x40: 6, 0x80: 7,
};

function buildFields(mask, sparse) {
    const f = new Array(8).fill('');
    let si = 0, bit = 1;
    for (let i = 0; i < 8; i++) {
        if (mask & bit) f[MASK_TO_IDX[bit]] = sparse[si++] || '';
        bit <<= 1;
    }
    return f;
}

// ============================================================
// 文本还原
// ============================================================

function subsDollar(text, fields) {
    return text.replace(/\$([NnPplWwiT])/g, (_, k) => {
        switch (k) {
            case 'N': return fields[0];
            case 'n': return fields[5] || '<hir>未知存在</hir>';
            case 'P': return fields[2];
            case 'p': return fields[7] || fields[5] || '<hir>未知存在</hir>';
            case 'l': return fields[3] || '';
            case 'W':
            case 'w': return fields[1] || '手';
            case 'i': return fields[6] || '手';
            case 'T': return fields[4] || '';
        }
        return _;
    });
}

function subsCaret(text, args) {
    let idx = 0;
    return text.replace(/\^/g, () => (idx < args.length) ? String(args[idx++]) : '');
}

export function format(tid, mask, sparse, args) {
    if (!isReady()) return '';
    const text = Table[tid];
    if (!text) return '';
    let result = text;
    if (text.includes('$')) result = subsDollar(result, buildFields(mask, sparse));
    if (args && args.length && result.includes('^')) result = subsCaret(result, args);
    return result;
}

export function perspective(text, aName, tName, myName) {
    if (aName && aName === myName) text = text.split(aName).join('你');
    if (tName && tName === myName) text = text.split(tName).join('你');
    return text;
}

/** 获取模板的 8 位字段掩码（从 MaskTable 查询，供客户端构建 sparse） */
export function getMask(tid) {
    return MaskTable[tid] || 0;
}
