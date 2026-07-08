/**
 * 模板字符串驻留表 — 客户端本地模板还原引擎
 *
 * 服务端二进制帧按需发送实体字段（由 mask 控制），
 * 客户端根据 mask 重建字段数组后还原文本，再做视角转换。
 */

import { PreloadedTable, PreloadedVersion } from './templates-data.js';

// ============================================================
// 注册表
// ============================================================

/** 模板 ID → 文本 */
export const Table = {};
/** 模板 ID → 字段掩码 */
export const MaskTable = {};
/** 版本号 */
export let Version = 0;

/**
 * 加载模板数据。data 格式: { tid: { t: "text", m: mask }, ... }
 * 兼容旧格式: { tid: "text", ... } (mask 默认为全字段)
 */
export function load(version, data) {
    if (version <= Version) return;
    Version = version;
    for (const tid of Object.keys(data)) {
        const entry = data[tid];
        if (typeof entry === 'string') {
            Table[tid] = entry;
            MaskTable[tid] = 0xff; // 兼容旧格式：全字段
        } else {
            Table[tid] = entry.t;
            MaskTable[tid] = entry.m;
        }
    }
}

// 启动时合并预加载模板
load(PreloadedVersion, PreloadedTable);

// ============================================================
// 字段掩码 — 与服务端 FMASK 同步
// ============================================================

export const MASK = {
    A_NAME:   0x01,
    A_WEAPON: 0x02,
    A_CALL3:  0x04,
    A_PART:   0x08,
    A_THROW:  0x10,
    T_NAME:   0x20,
    T_WEAPON: 0x40,
    T_CALL3:  0x80,
};

// 掩码位 → 全字段数组索引
const MASK_TO_IDX = {
    0x01: 0, 0x02: 1, 0x04: 2, 0x08: 3,
    0x10: 4, 0x20: 5, 0x40: 6, 0x80: 7,
};

/**
 * 根据掩码和稀疏字段数组重建完整字段数组（8 元素，未发送的为空串）
 * @param {number} mask
 * @param {string[]} sparse  按 mask 位序排列的字段值
 * @returns {string[]} 8 个元素的完整字段数组
 */
function buildFields(mask, sparse) {
    const f = new Array(8).fill('');
    let si = 0;
    let bit = 1;
    for (let i = 0; i < 8; i++) {
        if (mask & bit) {
            f[MASK_TO_IDX[bit]] = sparse[si++] || '';
        }
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
            case 'N': return fields[0];                      // A_NAME
            case 'n': return fields[5] || '<hir>未知存在</hir>'; // T_NAME
            case 'P': return fields[2];                      // A_CALL3
            case 'p': return fields[7] || fields[5] || '<hir>未知存在</hir>';
            case 'l': return fields[3] || '';
            case 'W':
            case 'w': return fields[1] || '手';              // A_WEAPON
            case 'i': return fields[6] || '手';              // T_WEAPON
            case 'T': return fields[4] || '';                // A_THROW
        }
        return _;
    });
}

function subsCaret(text, args) {
    let idx = 0;
    return text.replace(/\^/g, () => {
        return (idx < args.length) ? String(args[idx++]) : '';
    });
}

/**
 * 还原模板文本（不做视角转换）
 * @param {number} tid
 * @param {number} mask      字段掩码
 * @param {string[]} sparse  按掩码位序的字段值
 * @param {string[]} args    按 ^ 出现顺序填入的值
 * @returns {string}
 */
export function format(tid, mask, sparse, args) {
    const text = Table[tid];
    if (!text) return '';

    const fields = buildFields(mask, sparse);

    let result = text;
    if (text.includes('$')) {
        result = subsDollar(result, fields);
    }
    if (args && args.length && result.includes('^')) {
        result = subsCaret(result, args);
    }
    return result;
}

/**
 * 视角转换：将玩家名替换为"你"
 */
export function perspective(text, aName, tName, myName) {
    if (aName && aName === myName) {
        text = text.split(aName).join('你');
    }
    if (tName && tName === myName) {
        text = text.split(tName).join('你');
    }
    return text;
}
