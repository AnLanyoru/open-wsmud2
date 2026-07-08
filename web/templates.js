/**
 * 模板字符串驻留表 — 客户端本地模板还原引擎
 *
 * 映射表随前端资源一起下发，浏览器可长期缓存。
 * 服务端发送二进制帧 (template_id, 8 entity fields, ^args...)，
 * 客户端本地还原完整消息文本后，再进行视角转换（替换为你）。
 */

/** 模板 ID → 文本 映射表 */
export const Table = {};

/** 版本号，用于热更新时比对 */
export let Version = 0;

/**
 * 从服务端加载模板映射表
 * @param {number} version
 * @param {Object<number, string>} data
 */
export function load(version, data) {
    if (version <= Version) return;
    Version = version;
    Object.assign(Table, data);
}

// ============================================================
// 实体字段索引
// ============================================================

// 8 个实体字段在 field 数组中的位置
export const F = {
    A_NAME:    0,  // attacker name
    A_WEAPON:  1,  // attacker weapon_name()
    A_CALL3:   2,  // attacker call3() — 他/她
    A_PART:    3,  // attacker attack_part.name
    A_THROW:   4,  // attacker throwing_name()
    T_NAME:    5,  // target name
    T_WEAPON:  6,  // target weapon_name()
    T_CALL3:   7,  // target call3()
};

/**
 * 用实体字段数组替换模板中的 $ 占位符
 * @param {string} text     模板文本
 * @param {string[]} fields 8 个实体字段
 * @returns {string} $ 占位符已替换的文本（尚未做视角转换）
 */
function subsDollar(text, fields) {
    return text.replace(/\$([NnPplWwiT])/g, (_, k) => {
        switch (k) {
            case 'N': return fields[F.A_NAME];
            case 'n': return fields[F.T_NAME] || '<hir>未知存在</hir>';
            case 'P': return fields[F.A_CALL3];
            case 'p': return fields[F.T_CALL3] || fields[F.T_NAME] || '<hir>未知存在</hir>';
            case 'l': return fields[F.A_PART] || '';
            case 'W':
            case 'w': return fields[F.A_WEAPON] || '手';
            case 'i': return fields[F.T_WEAPON] || '手';
            case 'T': return fields[F.A_THROW] || '';
        }
        return _;
    });
}

/**
 * 用 ^args 数组替换模板中的 ^1 ^2 ... 占位符
 */
function subsCaret(text, args) {
    return text.replace(/\^(\d+)/g, (_, n) => {
        const idx = parseInt(n) - 1;
        return (idx < args.length) ? String(args[idx]) : '';
    });
}

/**
 * 还原模板文本（不做视角转换）
 * @param {number} tid      模板 ID
 * @param {string[]} fields 8 个实体字段
 * @param {string[]} args   ^1 ^2 ... 额外参数
 * @returns {string} 第三人称完整文本
 */
export function format(tid, fields, args) {
    let text = Table[tid];
    if (!text) return '';

    if (text.includes('$')) {
        text = subsDollar(text, fields);
    }
    if (args && args.length && text.includes('^')) {
        text = subsCaret(text, args);
    }
    return text;
}

/**
 * 视角转换：将玩家名替换为"你"
 * @param {string} text  第三人称文本
 * @param {string} aName attacker name
 * @param {string} tName target name
 * @param {string} myName 当前玩家名
 * @returns {string}
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
