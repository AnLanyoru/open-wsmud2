/**
 * 模板字符串驻留表 — 客户端本地模板还原引擎
 *
 * 启动时从服务器获取哈希值，与 localStorage 缓存比对：
 * - 哈希一致 → 直接使用缓存数据，零额外网络传输
 * - 哈希不一致 → 下载 tmpl_<hash>.gz (gzip)，原生 DecompressionStream 解压
 * 服务端二进制帧按需发送实体字段（由 mask 控制），
 * 客户端根据 mask 重建字段数组后还原文本，再做视角转换。
 */

// ============================================================
// 注册表
// ============================================================

const Table = {};
const MaskTable = {};
/** 部位名表：[0]=character 部位表，[1]=monster 部位表 */
const PartsTable = [[], []];
let Version = 0;
let _ready = false;

const LS_HASH_KEY = 'tmpl_hash';
const LS_DATA_KEY = 'tmpl_data';

/** 解压 gzip 数据 → JSON 对象（使用浏览器原生 DecompressionStream） */
async function decompressGzipToJson(gzBlob) {
    const ds = new DecompressionStream('gzip');
    const decompressed = gzBlob.stream().pipeThrough(ds);
    const text = await new Response(decompressed).text();
    return JSON.parse(text);
}

/** 将模板数据写入内存表 */
function loadIntoTables(data) {
    if (data.templates) {
        const { v, d } = data.templates;
        if (v > Version && d) {
            Version = v;
            for (const tid of Object.keys(d)) {
                Table[tid] = d[tid].t;
                MaskTable[tid] = d[tid].m;
            }
        }
    }
    if (data.parts) {
        PartsTable[0] = data.parts.character || [];
        PartsTable[1] = data.parts.monster || [];
    }
}

/** 等待模板表加载完成的 Promise */
export const ready = (async () => {
    try {
        // 1. 获取服务器最新哈希
        const hashResp = await fetch('/tmpl-hash.json');
        if (!hashResp.ok) throw new Error('hash fetch failed');
        const { hash, file } = await hashResp.json();

        // 2. 比对 localStorage 缓存
        const cachedHash = localStorage.getItem(LS_HASH_KEY);
        const cachedData = localStorage.getItem(LS_DATA_KEY);

        if (hash === cachedHash && cachedData) {
            // 哈希一致，直接用缓存
            loadIntoTables(JSON.parse(cachedData));
        } else {
            // 3. 哈希不一致，下载压缩包
            const gzResp = await fetch('/' + file);
            if (!gzResp.ok) throw new Error('gzip fetch failed: ' + file);
            const gzBlob = await gzResp.blob();
            const data = await decompressGzipToJson(gzBlob);
            loadIntoTables(data);
            // 4. 写入 localStorage 缓存
            try {
                localStorage.setItem(LS_HASH_KEY, hash);
                localStorage.setItem(LS_DATA_KEY, JSON.stringify(data));
            } catch (_) {
                // localStorage 配额不足时清除旧数据后重试一次
                localStorage.removeItem(LS_DATA_KEY);
                try { localStorage.setItem(LS_HASH_KEY, hash); } catch (_) {}
            }
        }
    } catch (_) {
        // 网络错误或解析失败 → 退化为文本路径（format 返回空字符串）
    }
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
    T_WEAPON: 0x08, // $w $i（原 A_PART 位，$l 改为帧内内联）
    A_THROW:  0x10,
    T_NAME:   0x20,
    // 0x40 保留（原 T_WEAPON 已移至 0x08）
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

function subsDollar(text, fields, hurtPart) {
    return text.replace(/\$([NnPplWwT])/g, (_, k) => {
        switch (k) {
            case 'N': return fields[0];
            case 'n': return fields[5] || '<hir>未知存在</hir>';
            case 'P': return fields[2];
            case 'p': return fields[7] || fields[5] || '<hir>未知存在</hir>';
            case 'l': return hurtPart || '';
            case 'W': return fields[1] || '手';
            case 'w': return fields[3] || '手';
            case 'T': return fields[4] || '';
        }
        return _;
    });
}

function subsCaret(text, args) {
    let idx = 0;
    return text.replace(/\^/g, () => (idx < args.length) ? String(args[idx++]) : '');
}

export function format(tid, mask, sparse, args, hurtPart) {
    if (!isReady()) return '';
    const text = Table[tid];
    if (!text) return '';
    let result = text;
    if (text.includes('$')) result = subsDollar(result, buildFields(mask, sparse), hurtPart);
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

/** 解包部位索引（1B: 高4位类型 + 低4位索引）→ 中文名 */
export function getPartName(packed) {
    const typeIdx = (packed & 0xF0) === 0x10 ? 1 : 0;
    const idx = packed & 0x0F;
    return PartsTable[typeIdx][idx] || '';
}
