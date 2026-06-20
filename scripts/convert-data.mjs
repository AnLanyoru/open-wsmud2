/**
 * Conversion script: parses 武神数据.js and generates TypeScript files
 * for equipment (eq/) and skills (skill/).
 *
 * Usage: node scripts/convert-data.mjs
 */
import fs from 'fs';
import path from 'path';

const DATA_FILE = 'new_data/武神数据.js';
const OBJ_DIR = 'server/res/obj/eq/new';
const SKILL_DIR = 'server/res/skill/new';

// ============== GRADE MAPPING ==============
const GRADE_MAP = {
    'HIW': 0,  // white
    'HIG': 1,  // green
    'HIC': 2,  // cyan
    'HIY': 3,  // yellow
    'HIZ': 4,  // purple
    'HIO': 5,  // orange
    'HIR': 6,  // red
    '': 0,     // default white
};

// ============== EQUIPMENT TYPE DETECTION ==============
// Based on item name keywords
function detectEqType(name, desc, eq) {
    const n = name + desc;

    // Weapons first - check for specific weapon types
    if (/刀/.test(n) && !/剪刀|菜刀|砍刀架/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'BLADE' };
    if (/剑/.test(n) && !/剑法|剑谱|剑诀/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'SWORD' };
    if (/鞭/.test(n) && !/鞭法/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'WHIP' };
    if (/棍/.test(n) && !/棍法/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'CLUB' };
    if (/杖/.test(n) && !/杖法/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'STAFF' };
    if (/拂尘/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'WHIP' };
    if (/钩/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'SWORD' };
    if (/斧/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'STAFF' };
    if (/枪/.test(n) && !/枪法/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'CLUB' };
    if (/弓/.test(n)) return { eq_type: 'WEAPON', weapon_type: 'THROWING' };

    // Throwing weapons (暗器)
    if (/锥/.test(n) || /针/.test(n) && /暗器/.test(desc) || /冬瓜/.test(n)) return { eq_type: 'THROWING', weapon_type: 'THROWING' };

    // 金蛇锥 is throwing
    if (name === '金蛇锥' || name === '碧磷针' || name === '冰魄银针') return { eq_type: 'THROWING', weapon_type: 'THROWING' };

    // 绣花针 - special weapon
    if (name.includes('绣花针')) return { eq_type: 'WEAPON', weapon_type: 'THROWING' };

    // 金铃索, 玉箫 - these are weapons
    if (name === '金铃索') return { eq_type: 'WEAPON', weapon_type: 'WHIP' };
    if (name === '玉箫') return { eq_type: 'WEAPON', weapon_type: 'SWORD' };

    // 拳套/千斤拳 - unarmed weapon
    if (/拳$/.test(name) && !/拳法/.test(name)) return { eq_type: 'WEAPON', weapon_type: 'NONE' };

    // 圣火令 - special
    if (name === '圣火令') return { eq_type: 'JEWELS' };

    // Armor types
    if (/鞋|靴/.test(n)) return { eq_type: 'SHOES' };
    if (/衣|服|衫|袍|甲|袈裟/.test(n)) return { eq_type: 'CLOTH' };
    if (/披风|披肩|斗篷/.test(n)) return { eq_type: 'CAPE' };
    if (/戒/.test(n)) return { eq_type: 'RING' };
    if (/链/.test(n)) return { eq_type: 'NECKLACE' };
    if (/镯|护腕|手环/.test(n)) return { eq_type: 'WRIST' };
    if (/腰带|鞶|腰锁/.test(n)) return { eq_type: 'WAIST' };
    if (/冠|巾|帽|簪|面罩|面具|头套/.test(n)) return { eq_type: 'HEAD' };
    if (/令|牌|符|珠|印|石|环|佩|囊|琴|鼎/.test(n)) return { eq_type: 'JEWELS' };

    // Default
    return { eq_type: 'JEWELS' };
}

// ============== PROPERTY PARSING ==============
function parseEqProps(eqStr) {
    if (!eqStr || eqStr.trim() === '') return { props: {}, desc: '' };

    const props = {};
    const specials = [];
    const parts = eqStr.split(/\s+/);

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        // Combine multi-word parts
        while (i + 1 < parts.length && /^[+-]?\d/.test(parts[i + 1])) {
            part += parts[i + 1];
            i++;
        }

        const parsed = parsePropToken(part);
        if (parsed) {
            if (parsed.special) {
                specials.push(parsed.special);
            } else {
                Object.assign(props, parsed);
            }
        }
    }

    return { props, desc: specials.join('\n') };
}

function parsePropToken(token) {
    // Remove leading/trailing whitespace and colons
    token = token.replace(/[：:]/g, '').trim();
    if (!token) return null;

    // Pattern: name+number or name-number
    // Try to match common patterns

    // 攻击+X or 攻击：+X
    let m = token.match(/^攻击\+(\d+)$/);
    if (m) return { gj: parseInt(m[1]) };

    m = token.match(/^攻击：\+(\d+)$/);
    if (m) return { gj: parseInt(m[1]) };

    // 防御+X
    m = token.match(/^防御\+(\d+)$/);
    if (m) return { fy: parseInt(m[1]) };
    m = token.match(/^防御：\+(\d+)$/);
    if (m) return { fy: parseInt(m[1]) };

    // 命中+X
    m = token.match(/^命中\+(\d+)$/);
    if (m) return { mz: parseInt(m[1]) };
    m = token.match(/^命中：\+(\d+)$/);
    if (m) return { mz: parseInt(m[1]) };

    // 躲闪+X
    m = token.match(/^躲闪\+(\d+)$/);
    if (m) return { ds: parseInt(m[1]) };
    m = token.match(/^躲闪：\+(\d+)$/);
    if (m) return { ds: parseInt(m[1]) };

    // 招架+X
    m = token.match(/^招架\+(\d+)$/);
    if (m) return { zj: parseInt(m[1]) };
    m = token.match(/^招架：\+(\d+)$/);
    if (m) return { zj: parseInt(m[1]) };

    // 臂力+X
    m = token.match(/^臂力\+(\d+)$/);
    if (m) return { str: parseInt(m[1]) };
    m = token.match(/^臂力：\+(\d+)$/);
    if (m) return { str: parseInt(m[1]) };

    // 根骨+X
    m = token.match(/^根骨\+(\d+)$/);
    if (m) return { con: parseInt(m[1]) };
    m = token.match(/^根骨：\+(\d+)$/);
    if (m) return { con: parseInt(m[1]) };

    // 身法+X or 身法-X
    m = token.match(/^身法\+(\d+)$/);
    if (m) return { dex: parseInt(m[1]) };
    m = token.match(/^身法-(\d+)$/);
    if (m) return { dex: -parseInt(m[1]) };
    m = token.match(/^身法：\+(\d+)$/);
    if (m) return { dex: parseInt(m[1]) };

    // 悟性+X
    m = token.match(/^悟性\+(\d+)$/);
    if (m) return { int: parseInt(m[1]) };
    m = token.match(/^悟性：\+(\d+)$/);
    if (m) return { int: parseInt(m[1]) };

    // 容貌+X
    m = token.match(/^容貌\+(\d+)$/);
    if (m) return { per: parseInt(m[1]) };
    m = token.match(/^容貌(\d+)$/);
    if (m) return { per: parseInt(m[1]) };

    // 气血+X
    m = token.match(/^气血\+(\d+)$/);
    if (m) return { max_hp: parseInt(m[1]) };
    m = token.match(/^气血：\+(\d+)$/);
    if (m) return { max_hp: parseInt(m[1]) };

    // 内力上限+X
    m = token.match(/^内力上限\+(\d+)$/);
    if (m) return { limit_mp: parseInt(m[1]) };
    m = token.match(/^内力上限：\+(\d+)$/);
    if (m) return { limit_mp: parseInt(m[1]) };

    // 攻击速度+X秒 or 攻击速度-X秒
    m = token.match(/^攻击速度\+([\d.]+)秒$/);
    if (m) return { gjsd: Math.round(parseFloat(m[1]) * 1000) };
    m = token.match(/^攻击速度-([\d.]+)秒$/);
    if (m) return { gjsd: -Math.round(parseFloat(m[1]) * 1000) };

    // Percent-based properties
    m = token.match(/^最终伤害\+(\d+)%$/);
    if (m) return { add_sh_per: parseInt(m[1]) };
    m = token.match(/^最终伤害\+(\d+)$/);
    if (m) return { add_sh_per: parseInt(m[1]) };
    m = token.match(/^最终伤害：\+(\d+)%$/);
    if (m) return { add_sh_per: parseInt(m[1]) };
    m = token.match(/^最终伤害：\+(\d+)$/);
    if (m) return { add_sh_per: parseInt(m[1]) };

    m = token.match(/^暴击\+(\d+)%$/);
    if (m) return { bj_per: parseInt(m[1]) };
    m = token.match(/^暴击：\+(\d+)%$/);
    if (m) return { bj_per: parseInt(m[1]) };

    m = token.match(/^暴击伤害\+(\d+)%$/);
    if (m) return { add_bjsh_per: parseInt(m[1]) };
    m = token.match(/^暴击伤害：\+(\d+)%$/);
    if (m) return { add_bjsh_per: parseInt(m[1]) };

    m = token.match(/^暴击抵抗\+(\d+)%$/);
    if (m) return { diff_bj: parseInt(m[1]) };
    m = token.match(/^暴击抵抗：\+(\d+)%$/);
    if (m) return { diff_bj: parseInt(m[1]) };

    m = token.match(/^伤害减免\+(\d+)%$/);
    if (m) return { diff_sh_per: parseInt(m[1]) };
    m = token.match(/^伤害减免：\+(\d+)%$/);
    if (m) return { diff_sh_per: parseInt(m[1]) };
    m = token.match(/^伤害减免\+(\d+)$/);
    if (m) return { diff_sh_per: parseInt(m[1]) };

    m = token.match(/^受到的伤害减少\+(\d+)$/);
    if (m) return { diff_sh: parseInt(m[1]) };
    m = token.match(/^受到的伤害减少：\+(\d+)$/);
    if (m) return { diff_sh: parseInt(m[1]) };

    m = token.match(/^忽视对方防御\+(\d+)%$/);
    if (m) return { diff_fy_per: parseInt(m[1]) };
    m = token.match(/^忽视对方防御：\+(\d+)%$/);
    if (m) return { diff_fy_per: parseInt(m[1]) };
    m = token.match(/^忽视防御\+(\d+)%$/);
    if (m) return { diff_fy_per: parseInt(m[1]) };

    m = token.match(/^忙乱时间\+([\d.]+)秒$/);
    if (m) return { busy: Math.round(parseFloat(m[1]) * 1000) };
    m = token.match(/^忙乱时间\+(\d+)%$/);
    if (m) return { busy_per: parseInt(m[1]) };

    m = token.match(/^忽视忙乱\+([\d.]+)秒$/);
    if (m) return { diff_busy: Math.round(parseFloat(m[1]) * 1000) };
    m = token.match(/^忽视忙乱\+(\d+)%$/);
    if (m) return { diff_busy_per: parseInt(m[1]) };
    m = token.match(/^忽视忙乱：\+(\d+)%$/);
    if (m) return { diff_busy_per: parseInt(m[1]) };

    m = token.match(/^绝招释放时间-([\d.]+)秒$/);
    if (m) return { releasetime: Math.round(parseFloat(m[1]) * 1000) };
    m = token.match(/^绝招释放时间-(\d+)%$/);
    if (m) return { releasetime_per: parseInt(m[1]) };
    m = token.match(/^绝招释放时间：-(\d+)%$/);
    if (m) return { releasetime_per: parseInt(m[1]) };
    m = token.match(/^绝招释放时间：-(\d+)$/);
    if (m) return { releasetime_per: parseInt(m[1]) };

    m = token.match(/^绝招冷却时间-([\d.]+)秒$/);
    if (m) return { distime: Math.round(parseFloat(m[1]) * 1000) };
    m = token.match(/^绝招冷却时间-(\d+)%$/);
    if (m) return { distime_per: parseInt(m[1]) };
    m = token.match(/^绝招冷却时间：-(\d+)%$/);
    if (m) return { distime_per: parseInt(m[1]) };
    m = token.match(/^绝招冷却时间：-(\d+)$/);
    if (m) return { distime_per: parseInt(m[1]) };

    m = token.match(/^内力消耗-(\d+)%$/);
    if (m) return { expend_mp_per: parseInt(m[1]) };
    m = token.match(/^内力消耗：-(\d+)%$/);
    if (m) return { expend_mp_per: parseInt(m[1]) };
    m = token.match(/^内力消耗-(\d+)$/);
    if (m) return { expend_mp: parseInt(m[1]) };

    m = token.match(/^打坐效率\+(\d+)%$/);
    if (m) return { dazuo_per: parseInt(m[1]) };
    m = token.match(/^打坐速度\+(\d+)%$/);
    if (m) return { dazuo_per: parseInt(m[1]) };

    m = token.match(/^练习效率\+(\d+)%$/);
    if (m) return { lianxi_per: parseInt(m[1]) };
    m = token.match(/^练习速度\+(\d+)%$/);
    if (m) return { lianxi_per: parseInt(m[1]) };

    m = token.match(/^炼药效率\+(\d+)$/);
    if (m) return { lianyao1: parseInt(m[1]) };

    // 攻击：+X%
    m = token.match(/^攻击：\+(\d+)%$/);
    if (m) return { gj_per: parseInt(m[1]) };
    m = token.match(/^攻击\+(\d+)%$/);
    if (m) return { gj_per: parseInt(m[1]) };

    // 防御：+X%
    m = token.match(/^防御：\+(\d+)%$/);
    if (m) return { fy_per: parseInt(m[1]) };
    m = token.match(/^防御\+(\d+)%$/);
    if (m) return { fy_per: parseInt(m[1]) };
    m = token.match(/^防御\+(\d+)$/);
    if (m && parseInt(m[1]) <= 100) return { fy_per: parseInt(m[1]) }; // ambiguous with absolute, but small numbers likely %

    // 躲闪+X%
    m = token.match(/^躲闪\+(\d+)%$/);
    if (m) return { ds_per: parseInt(m[1]) };
    m = token.match(/^躲闪：\+(\d+)%$/);
    if (m) return { ds_per: parseInt(m[1]) };

    // 招架+X%
    m = token.match(/^招架\+(\d+)%$/);
    if (m) return { zj_per: parseInt(m[1]) };
    m = token.match(/^招架：\+(\d+)%$/);
    if (m) return { zj_per: parseInt(m[1]) };

    // 命中+X%
    m = token.match(/^命中\+(\d+)%$/);
    if (m) return { mz_per: parseInt(m[1]) };
    m = token.match(/^命中：\+(\d+)%$/);
    if (m) return { mz_per: parseInt(m[1]) };

    // 气血+X%
    m = token.match(/^气血\+(\d+)%$/);
    if (m) return { hp_per: parseInt(m[1]) };
    m = token.match(/^气血：\+(\d+)%$/);
    if (m) return { hp_per: parseInt(m[1]) };

    // 攻击速度+X%
    m = token.match(/^攻击速度\+(\d+)%$/);
    if (m) return { gjsd_per: parseInt(m[1]) };

    // 负面状态抵抗+X%
    m = token.match(/^负面状态抵抗\+(\d+)%$/);
    if (m) return { diff_downside_per: parseInt(m[1]) };

    // 学习效率+X%
    m = token.match(/^学习效率\+(\d+)%$/);
    if (m) return { study_per: parseInt(m[1]) };

    // 内力消耗：-X%
    m = token.match(/^内力消耗：-(\d+)%$/);
    if (m) return { expend_mp_per: parseInt(m[1]) };

    // 免疫暴击 - special
    if (token === '免疫暴击') return { special: '免疫暴击' };

    // 死亡后立即复活 - special
    if (token.includes('死亡后立即复活')) return { special: token };

    // 激活后 - special effects
    if (token.includes('激活后')) return { special: token };

    // 当你命中 - special on-hit effects
    if (token.includes('当你命中')) return { special: token };

    // 穿上 - special equip effects
    if (token.includes('穿上这件')) return { special: token };

    // 使用后 - special use effects
    if (token.includes('使用后')) return { special: token };

    // 每5秒恢复 - special regen effects
    if (token.includes('每5秒恢复')) return { special: token };
    if (token.includes('每5秒恢复')) return { special: token };

    // 当攻击命中后 - special effects
    if (token.includes('当攻击命中后')) return { special: token };

    // 当你受到攻击后 - special effects
    if (token.includes('当你受到攻击后')) return { special: token };

    // 装备后 - special
    if (token.includes('装备后')) return { special: token };

    // 反弹 - special
    if (token.includes('反弹')) return { special: token };

    // 沟通天地 - special
    if (token.includes('沟通天地')) return { special: token };

    // 增加你的化功大法 - special
    if (token.includes('增加你的化功大法')) return { special: token };

    // 火毒 - special
    if (token.includes('火毒')) return { special: token };

    // 吸收 - special
    if (token.includes('吸收')) return { special: token };

    // 转化 - special
    if (token.includes('转化')) return { special: token };

    // Skill level boosts
    m = token.match(/^(.+)\+(\d+)级$/);
    if (m) return { special: token }; // e.g., 辟邪剑法+100级

    // 钓鱼效率
    m = token.match(/^钓鱼效率：\+(\d+)$/);
    if (m) return { diaoyu1: parseInt(m[1]) };

    // 挖矿效率
    m = token.match(/^挖矿效率：\+(\d+)$/);
    if (m) return { kuang1: parseInt(m[1]) };

    // 采药效率
    m = token.match(/^采药效率：\+(\d+)$/);
    if (m) return { caiyao1: parseInt(m[1]) };

    // 疗伤效果
    m = token.match(/^疗伤效果：\+(\d+)%$/);
    if (m) return { recover_per: parseInt(m[1]) };

    // 防御+5 at end of string (standalone number after 防御)
    m = token.match(/^防御\+(\d+)$/);
    if (m && parseInt(m[1]) > 100) return { fy: parseInt(m[1]) };

    // If we can't parse, return as special
    if (token && token.length > 0 && !/^\s*$/.test(token)) {
        return { special: token };
    }

    return null;
}

// ============== UNIT DETECTION ==============
function detectUnit(name, eqType) {
    if (eqType === 'WEAPON' || eqType === 'THROWING') {
        if (/剑|刀/.test(name)) return '把';
        if (/棍|杖|枪/.test(name)) return '根';
        if (/鞭/.test(name)) return '柄';
        if (/拂尘/.test(name)) return '柄';
        if (/斧/.test(name)) return '把';
        if (/锥|针/.test(name)) return '枚';
        if (/拳/.test(name)) return '只';
        return '把';
    }
    if (/衣|服|衫|袍|甲|袈裟/.test(name)) return '件';
    if (/披风|披肩|斗篷/.test(name)) return '件';
    if (/鞋|靴/.test(name)) return '双';
    if (/戒/.test(name)) return '枚';
    if (/链/.test(name)) return '条';
    if (/镯|护腕|手环/.test(name)) return '只';
    if (/腰带|鞶|腰锁/.test(name)) return '条';
    if (/冠|帽|巾/.test(name)) return '顶';
    if (/簪/.test(name)) return '支';
    if (/面罩|面具|头套/.test(name)) return '个';
    if (/令|牌/.test(name)) return '块';
    if (/符/.test(name)) return '张';
    if (/珠|石/.test(name)) return '颗';
    if (/印/.test(name)) return '方';
    if (/环/.test(name)) return '枚';
    if (/佩|囊|香囊/.test(name)) return '个';
    if (/琴/.test(name)) return '把';
    if (/鼎/.test(name)) return '座';
    if (/箫/.test(name)) return '支';
    if (/索/.test(name)) return '条';
    return '个';
}

// ============== VALUE ESTIMATION ==============
function estimateValue(grade) {
    return [1000, 10000, 50000, 200000, 500000, 1000000, 5000000][grade] || 1000;
}

// ============== GENERATE EQUIPMENT FILE ==============
function generateEquipmentFile(item) {
    const grade = GRADE_MAP[item.grade] || 0;
    const { eq_type, weapon_type } = detectEqType(item.name, item.desc, item.eq);
    const { props, desc: specialDesc } = parseEqProps(item.eq);
    const unit = detectUnit(item.name, eq_type);
    const value = estimateValue(grade);

    // Determine file name from item name (pinyin or index)
    const safeName = item.id || item.name.replace(/[^a-zA-Z一-鿿]/g, '');
    const fileName = (item.id || `item_${Math.random().toString(36).slice(2, 8)}`) + '.ts';

    // Build import statement
    let imports = `import {EQUIPMENT} from "../../../../core/item/equipment.js";\n`;
    if (eq_type === 'WEAPON' || eq_type === 'THROWING') {
        imports += `import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";\n`;
    } else {
        imports += `import {EQUIP_TYPE} from "../../../../core/const.js";\n`;
    }

    // Build class
    let code = `${imports}
export default class extends EQUIPMENT {
    unit = "${unit}";
    name = "${item.name}";
    desc = "${item.desc.replace(/"/g, '\\"')}";
    value = ${value};
    grade = ${grade};
    eq_type = EQUIP_TYPE.${eq_type};`;

    if (weapon_type && weapon_type !== 'NONE') {
        code += `\n    weapon_type = WEAPON_TYPE.${weapon_type};`;
    } else if (eq_type === 'WEAPON' && weapon_type === 'NONE') {
        code += `\n    weapon_type = WEAPON_TYPE.NONE;`;
    }

    // Generate prop object
    const propKeys = Object.keys(props);
    if (propKeys.length > 0) {
        code += `\n    prop = {\n`;
        for (const key of propKeys) {
            code += `        ${key}: ${props[key]},\n`;
        }
        code += `    };`;
    }

    // Add special description
    if (specialDesc) {
        code += `\n    // Special effects: ${specialDesc.replace(/\n/g, ' ')}`;
    }

    code += `\n}\n`;

    return { fileName, code, eqType: eq_type };
}

// ============== MAIN ==============
async function main() {
    // Read the data file
    console.log('Reading data file...');
    const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');

    // Extract weaponData and skilldata using eval (safe since we control the file)
    let weaponData = [];
    let skilldata = [];

    // Use a sandboxed eval
    const sandbox = {
        weaponData: null,
        skilldata: null,
        factionEquipmentData: null,
        fellow: null,
        console: console,
    };

    try {
        // Wrap in a function to create scope
        const fn = new Function('sandbox', `
            with (sandbox) {
                ${dataContent}
            }
        `);
        // Actually, the file already declares const variables. Let's use a different approach.
    } catch (e) {
        console.log('Sandbox eval failed, trying direct approach');
    }

    // Direct approach: evaluate the JS file
    // The file declares: const weaponData = [...]; const skilldata = [...]; etc.
    const evalResult = eval(`(() => {
        ${dataContent}
        return { weaponData, skilldata, factionEquipmentData, fellow };
    })()`);

    weaponData = evalResult.weaponData || [];
    skilldata = evalResult.skilldata || [];

    console.log(`Found ${weaponData.length} equipment items`);
    console.log(`Found ${skilldata.length} skills`);

    // Create output directories
    fs.mkdirSync(OBJ_DIR, { recursive: true });
    fs.mkdirSync(SKILL_DIR, { recursive: true });

    // Get existing equipment names from non-new/ directories
    function findExistingEqNames(dir, excludeNew = true) {
        const names = new Set();
        if (!fs.existsSync(dir)) return names;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (excludeNew && entry.name === 'new') continue;
                const sub = findExistingEqNames(full, false);
                sub.forEach(n => names.add(n));
            } else if (entry.name.endsWith('.ts')) {
                const content = fs.readFileSync(full, 'utf-8');
                const m = content.match(/name\s*=\s*['"]([^'"]+)['"]/);
                if (m) names.add(m[1]);
            }
        }
        return names;
    }
    const existingNames = findExistingEqNames('server/res/obj/eq');

    // Generate equipment files
    console.log('\n=== Generating equipment files ===');
    let eqCount = 0, skippedCount = 0;
    for (const item of weaponData) {
        if (!item.name) continue;

        // Skip items that already exist
        if (existingNames.has(item.name)) {
            skippedCount++;
            continue;
        }

        const idx = weaponData.indexOf(item);
        const fileName = item.id || `ws_eq_${String(idx).padStart(3, '0')}`;

        const { code } = generateEquipmentFile(item);
        const filePath = path.join(OBJ_DIR, fileName + '.ts');
        fs.writeFileSync(filePath, code, 'utf-8');
        eqCount++;
    }
    console.log(`Generated ${eqCount} new equipment files in ${OBJ_DIR}/`);
    console.log(`Skipped ${skippedCount} existing items`);

    // For skills, generate a summary first
    console.log('\n=== Skill data analysis ===');
    const skillTypes = {};
    for (const skill of skilldata) {
        const eq = skill.eq || '';
        let type = 'unknown';
        if (eq.includes('基本刀法')) type = 'blade';
        else if (eq.includes('基本剑法')) type = 'sword';
        else if (eq.includes('基本棍法')) type = 'club';
        else if (eq.includes('基本杖法')) type = 'staff';
        else if (eq.includes('基本鞭法')) type = 'whip';
        else if (eq.includes('基本拳脚')) type = 'unarmed';
        else if (eq.includes('基本暗器')) type = 'throwing';
        else if (eq.includes('基本轻功')) type = 'dodge';
        else if (eq.includes('基本内功')) type = 'force';
        else if (eq.includes('基本招架')) type = 'parry';
        else if (skill.name.includes('炼药')) type = 'knowledge';
        else if (skill.name.includes('读书')) type = 'knowledge';

        if (!skillTypes[type]) skillTypes[type] = [];
        skillTypes[type].push(skill);
    }

    for (const [type, skills] of Object.entries(skillTypes)) {
        console.log(`  ${type}: ${skills.length} skills`);
    }

    console.log('\nDone! Equipment files generated. Skills need manual review due to complexity.');
    console.log('Skill files should be created manually or with a second pass script.');
}

main().catch(console.error);
