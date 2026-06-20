/**
 * Skill conversion script: parses skilldata from 武神数据.js and generates
 * TypeScript skill skeleton files.
 *
 * Usage: node scripts/convert-skills.mjs
 */
import fs from 'fs';
import path from 'path';

const DATA_FILE = 'new_data/武神数据.js';
const SKILL_ROOT = 'server/res/skill';

// ============== GRADE MAPPING ==============
const GRADE_MAP = {
    'HIW': 0, 'HIG': 1, 'HIC': 2, 'HIY': 3, 'HIZ': 4, 'HIO': 5, 'HIR': 6, '': 0,
};
const GRADE_NAME = ['普通', '精良', '高级', '稀有', '绝世', '绝世神功', '无上神武'];

// ============== FAMILY DETECTION ==============
// Only return families that actually exist (have resource files)
const EXISTING_FAMILIES = {
    'HUASHAN': 'FAMILIES.HUASHAN',
    'GAIBANG': 'FAMILIES.GAIBANG',
    'WUDANG': 'FAMILIES.WUDANG',
    'SHAOLIN': 'FAMILIES.SHAOLIN',
    'EMEI': 'FAMILIES.EMEI',
    'XIAOYAO': 'FAMILIES.XIAOYAO',
    'SHASHOU': 'FAMILIES.SHASHOU',
    'LIUSHAN': 'FAMILIES.LIUSHAN',
    'WULANG': 'FAMILIES.WULANG',
    'MONSTER': 'FAMILIES.MONSTER',
};
function detectFamily(desc_grade, name) {
    const d = (desc_grade || '') + (name || '');
    if (/华山/.test(d)) return EXISTING_FAMILIES.HUASHAN;
    if (/丐帮/.test(d)) return EXISTING_FAMILIES.GAIBANG;
    if (/武当/.test(d)) return EXISTING_FAMILIES.WUDANG;
    if (/少林/.test(d)) return EXISTING_FAMILIES.SHAOLIN;
    if (/峨眉/.test(d)) return EXISTING_FAMILIES.EMEI;
    if (/逍遥/.test(d)) return EXISTING_FAMILIES.XIAOYAO;
    if (/杀手/.test(d)) return EXISTING_FAMILIES.SHASHOU;
    if (/六扇门/.test(d)) return EXISTING_FAMILIES.LIUSHAN;
    if (/无浪门/.test(d)) return EXISTING_FAMILIES.WULANG;
    // Families that don't exist yet: 明教, 古墓, 日月, 神龙, 星宿, 桃花岛, 慕容, 雪山, 血刀, 大理, 五毒, 玄冥
    return null; // public skill (or family not yet created)
}

// ============== CAN_ENABLES DETECTION ==============
function detectCanEnables(eqStr) {
    const enables = [];
    if (!eqStr) return enables;

    if (eqStr.includes('基本刀法')) enables.push('blade');
    if (eqStr.includes('基本剑法')) enables.push('sword');
    if (eqStr.includes('基本棍法')) enables.push('club');
    if (eqStr.includes('基本杖法')) enables.push('staff');
    if (eqStr.includes('基本鞭法')) enables.push('whip');
    if (eqStr.includes('基本拳脚')) enables.push('unarmed');
    if (eqStr.includes('基本暗器')) enables.push('throwing');
    if (eqStr.includes('基本轻功')) enables.push('dodge');
    if (eqStr.includes('基本内功')) enables.push('force');
    if (eqStr.includes('基本招架')) enables.push('parry');

    return enables;
}

// ============== ENABLE PROP PARSING ==============
function parsePropLine(line) {
    const props = {};
    const specials = [];
    const tokens = line.trim().split(/\s+/);

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        // Recombine multi-word tokens that follow a number
        while (i + 1 < tokens.length && /^[+-]?\d/.test(tokens[i + 1])) {
            token += tokens[i + 1];
            i++;
        }
        token = token.replace(/[：:]/g, '').trim();
        if (!token) continue;

        const parsed = parseSingleProp(token);
        if (parsed) {
            if (parsed.special) specials.push(parsed.special);
            else Object.assign(props, parsed);
        }
    }
    return { props, specials };
}

function parseSingleProp(token) {
    token = token.trim();
    if (!token) return null;

    // Match patterns: Name+Number or Name+Number% or Name+Number秒
    const patterns = [
        // Absolute values
        [/^攻击\+(\d+)$/, 'gj'],
        [/^攻击：\+(\d+)$/, 'gj'],
        [/^防御\+(\d+)$/, 'fy'],
        [/^防御：\+(\d+)$/, 'fy'],
        [/^命中\+(\d+)$/, 'mz'],
        [/^命中：\+(\d+)$/, 'mz'],
        [/^躲闪\+(\d+)$/, 'ds'],
        [/^躲闪：\+(\d+)$/, 'ds'],
        [/^招架\+(\d+)$/, 'zj'],
        [/^招架：\+(\d+)$/, 'zj'],
        [/^臂力\+(\d+)$/, 'str'],
        [/^臂力：\+(\d+)$/, 'str'],
        [/^根骨\+(\d+)$/, 'con'],
        [/^根骨：\+(\d+)$/, 'con'],
        [/^身法\+(\d+)$/, 'dex'],
        [/^身法：\+(\d+)$/, 'dex'],
        [/^悟性\+(\d+)$/, 'int'],
        [/^悟性：\+(\d+)$/, 'int'],
        [/^容貌\+(\d+)$/, 'per'],
        [/^气血\+(\d+)$/, 'max_hp'],
        [/^气血：\+(\d+)$/, 'max_hp'],
        [/^内力上限\+(\d+)$/, 'limit_mp'],
        [/^内力上限：\+(\d+)$/, 'limit_mp'],
        // Speed
        [/^攻击速度\+([\d.]+)秒$/, 'gjsd', (v) => Math.round(parseFloat(v) * 1000)],
        [/^攻击速度-([\d.]+)秒$/, 'gjsd', (v) => -Math.round(parseFloat(v) * 1000)],
        // Percentages
        [/^最终伤害\+(\d+)%$/, 'add_sh_per'],
        [/^最终伤害：\+(\d+)%$/, 'add_sh_per'],
        [/^暴击\+(\d+)%$/, 'bj_per'],
        [/^暴击：\+(\d+)%$/, 'bj_per'],
        [/^暴击伤害\+(\d+)%$/, 'add_bjsh_per'],
        [/^暴击伤害：\+(\d+)%$/, 'add_bjsh_per'],
        [/^暴击抵抗\+(\d+)%$/, 'diff_bj'],
        [/^暴击抵抗：\+(\d+)%$/, 'diff_bj'],
        [/^伤害减免\+(\d+)%$/, 'diff_sh_per'],
        [/^伤害减免：\+(\d+)%$/, 'diff_sh_per'],
        [/^忽视对方防御\+(\d+)%$/, 'diff_fy_per'],
        [/^忽视对方防御：\+(\d+)%$/, 'diff_fy_per'],
        [/^忽视防御\+(\d+)%$/, 'diff_fy_per'],
        [/^攻击\+(\d+)%$/, 'gj_per'],
        [/^攻击：\+(\d+)%$/, 'gj_per'],
        [/^防御\+(\d+)%$/, 'fy_per'],
        [/^防御：\+(\d+)%$/, 'fy_per'],
        [/^躲闪\+(\d+)%$/, 'ds_per'],
        [/^躲闪：\+(\d+)%$/, 'ds_per'],
        [/^招架\+(\d+)%$/, 'zj_per'],
        [/^招架：\+(\d+)%$/, 'zj_per'],
        [/^命中\+(\d+)%$/, 'mz_per'],
        [/^命中：\+(\d+)%$/, 'mz_per'],
        [/^气血\+(\d+)%$/, 'hp_per'],
        [/^气血：\+(\d+)%$/, 'hp_per'],
        [/^攻击速度\+(\d+)%$/, 'gjsd_per'],
        [/^内力消耗-(\d+)%$/, 'expend_mp_per'],
        [/^内力消耗：-(\d+)%$/, 'expend_mp_per'],
        [/^绝招冷却时间-(\d+)%$/, 'distime_per'],
        [/^绝招冷却时间：-(\d+)%$/, 'distime_per'],
        [/^绝招释放时间-(\d+)%$/, 'releasetime_per'],
        [/^绝招释放时间：-(\d+)%$/, 'releasetime_per'],
        [/^负面状态抵抗\+(\d+)%$/, 'diff_downside_per'],
        [/^打坐效率\+(\d+)%$/, 'dazuo_per'],
        [/^练习效率\+(\d+)%$/, 'lianxi_per'],
        [/^学习效率\+(\d+)%$/, 'study_per'],
        [/^疗伤效果\+(\d+)%$/, 'recover_per'],
        // Time values
        [/^忙乱时间\+([\d.]+)秒$/, 'busy', (v) => Math.round(parseFloat(v) * 1000)],
        [/^忽视忙乱\+([\d.]+)秒$/, 'diff_busy', (v) => Math.round(parseFloat(v) * 1000)],
        [/^忽视忙乱\+(\d+)%$/, 'diff_busy_per'],
        [/^忽视忙乱：\+(\d+)%$/, 'diff_busy_per'],
        // Special numbers
        [/^炼药效率\+(\d+)$/, 'lianyao1'],
        [/^挖矿效率：\+(\d+)$/, 'kuang1'],
        [/^钓鱼效率：\+(\d+)$/, 'diaoyu1'],
    ];

    for (const [regex, key, transform] of patterns) {
        const m = token.match(regex);
        if (m) {
            const val = transform ? transform(m[1]) : parseInt(m[1]);
            return { [key]: val };
        }
    }

    // Special/complex properties that can't be simple numbers
    const specialPatterns = [
        '当你', '穿上', '使用后', '每5秒', '当攻击', '增加你的',
        '反弹', '免疫', '转化', '唯一', '激活后', '装备后',
        '死亡后', '沟通', '火毒', '吸收', '命中后', '进入战斗后',
        '招架成功后', '躲闪失败后', '暴击后', '战斗中', '你对',
        '你的攻击会', '如果你', '命中敌人后', '被敌人命中后',
        '可在', '禁止', '当你成功', '当成功', '命中的',
        '无相', '无剑', '无我', '无招', '金刚', '超渡',
        '破解', '增加你', '受到', '不会', '无法',
    ];

    for (const sp of specialPatterns) {
        if (token.includes(sp)) return { special: token };
    }

    // Skill level boosts
    if (/\+\d+级$/.test(token)) return { special: token };

    // If numeric-looking but unmatched, might be a percent without % sign
    const numMatch = token.match(/^(.+?)([+-]\d+)$/);
    if (numMatch) {
        return { special: token };
    }

    return null;
}

function parseEnableProps(eqStr) {
    if (!eqStr) return {};

    const result = {};
    const sections = eqStr.split(/当装备为/);
    // First section might be global properties
    if (sections[0] && sections[0].trim()) {
        const { props, specials } = parsePropLine(sections[0]);
        if (Object.keys(props).length > 0 || specials.length > 0) {
            result._global = { props, specials };
        }
    }

    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const lines = section.split('\n');
        const header = lines[0].trim();
        let baseType = '';
        if (header.includes('基本刀法')) baseType = 'blade';
        else if (header.includes('基本剑法')) baseType = 'sword';
        else if (header.includes('基本棍法')) baseType = 'club';
        else if (header.includes('基本杖法')) baseType = 'staff';
        else if (header.includes('基本鞭法')) baseType = 'whip';
        else if (header.includes('基本拳脚')) baseType = 'unarmed';
        else if (header.includes('基本暗器')) baseType = 'throwing';
        else if (header.includes('基本轻功')) baseType = 'dodge';
        else if (header.includes('基本内功')) baseType = 'force';
        else if (header.includes('基本招架')) baseType = 'parry';
        else continue;

        const bodyText = lines.slice(1).join(' ');
        const { props, specials } = parsePropLine(bodyText);
        if (Object.keys(props).length > 0 || specials.length > 0) {
            result[baseType] = { props, specials };
        }
    }
    return result;
}

// ============== PERFORM PARSING ==============
function parsePerforms(skillStr) {
    if (!skillStr) return [];
    const performs = [];

    // Parse 绝招 sections
    const pfmBlocks = skillStr.split(/【(.+?)】/);
    for (let i = 1; i < pfmBlocks.length; i += 2) {
        const name = pfmBlocks[i].trim();
        const body = (pfmBlocks[i + 1] || '').trim();

        // Parse parameters
        let mp = 1020;
        let distime = 10000;
        let release_time = 4000;
        let enable_skill = '';

        const mpMatch = body.match(/内力消耗[：:]?\s*(\d+)/);
        if (mpMatch) mp = parseInt(mpMatch[1]);

        const distimeMatch = body.match(/冷却时间[：:]?\s*([\d.]+)秒/);
        if (distimeMatch) distime = Math.round(parseFloat(distimeMatch[1]) * 1000);

        const releaseMatch = body.match(/出招时间[：:]?\s*([\d.]+)秒/);
        if (releaseMatch) release_time = Math.round(parseFloat(releaseMatch[1]) * 1000);

        // Extract description - collapse to single line
        const descParts = body.split(/[；;]/);
        let desc = descParts[0] || '';
        desc = desc.replace(/内力消耗[：:]?\s*\d+/, '').replace(/出招时间[：:]?\s*[\d.]+秒/, '').replace(/冷却时间[：:]?\s*[\d.]+秒/, '').trim();
        // Collapse newlines and whitespace into single line
        desc = desc.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();

        performs.push({
            name,
            mp,
            distime,
            release_time,
            desc: desc || name,
        });
    }

    return performs;
}

// ============== ADVANCE/SLOTS PARSING ==============
function parseSlots(advanceStr) {
    if (!advanceStr || advanceStr === '敬请期待') return [];
    const slots = [];
    const lines = advanceStr.split('\n').filter(l => l.trim());
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === '敬请期待') continue;
        // Generate a slot entry
        const slotId = 'slot_' + slots.length;
        slots.push({
            prop: slotId,
            desc: trimmed,
        });
    }
    return slots;
}

// ============== LEARN CONDITION PARSING ==============
function parseLearnCondition(conditionStr, eqStr) {
    const cond = {};
    if (!conditionStr && !eqStr) return cond;

    const text = (conditionStr || '') + '\n' + (eqStr || '');

    // Skill requirements
    const skillReqs = {};
    const skillMatches = text.matchAll(/(\S+)[：:]?\s*(\d+)\s*级/g);
    for (const m of skillMatches) {
        const skillName = m[1].trim();
        if (/先天|后天|性别|内功|轻功|招架|拳脚|剑法|刀法|棍法|杖法|鞭法|暗器/.test(skillName)) continue;
        if (/气血|内力|攻击|防御/.test(skillName)) continue;
        skillReqs[skillName] = parseInt(m[2]);
    }

    // Also check for base skill requirements from eq
    const baseSkills = {
        '基本刀法': 'blade', '基本剑法': 'sword', '基本棍法': 'club',
        '基本杖法': 'staff', '基本鞭法': 'whip', '基本拳脚': 'unarmed',
        '基本暗器': 'throwing', '基本轻功': 'dodge', '基本内功': 'force',
        '基本招架': 'parry',
    };

    // Don't add base skill requirements from the enable section - those are implicit

    if (Object.keys(skillReqs).length > 0) {
        cond.skill = skillReqs;
    }

    // Attribute requirements
    const str1Match = text.match(/先天臂力[：:]?\s*(\d+)/);
    const con1Match = text.match(/先天根骨[：:]?\s*(\d+)/);
    const dex1Match = text.match(/先天身法[：:]?\s*(\d+)/);
    const int1Match = text.match(/先天悟性[：:]?\s*(\d+)/);

    if (str1Match) cond.str1 = parseInt(str1Match[1]);
    if (con1Match) cond.con1 = parseInt(con1Match[1]);
    if (dex1Match) cond.dex1 = parseInt(dex1Match[1]);
    if (int1Match) cond.int1 = parseInt(int1Match[1]);

    // MP requirement
    const mpMatch = text.match(/内力[：:]?\s*(\d+)/);
    if (mpMatch && parseInt(mpMatch[1]) > 100) cond.max_mp = parseInt(mpMatch[1]);

    return cond;
}

// ============== FILE NAME GENERATION ==============
function generateFileName(skill) {
    let id = (skill.id || '').trim();
    if (id) return id;
    return 'ws_skill_' + Math.random().toString(36).slice(2, 8);
}

// ============== SKILL TYPE DIRECTORY ==============
function getSkillDir(canEnables, desc_grade) {
    if (canEnables.includes('force')) return 'force';
    if (canEnables.includes('dodge')) return 'dodge';
    if (canEnables.includes('blade')) return 'blade';
    if (canEnables.includes('sword')) return 'sword';
    if (canEnables.includes('club')) return 'club';
    if (canEnables.includes('staff')) return 'staff';
    if (canEnables.includes('whip')) return 'whip';
    if (canEnables.includes('unarmed')) return 'unarmed';
    if (canEnables.includes('throwing')) return 'throwing';
    if (canEnables.includes('parry') && canEnables.length === 1) return 'parry';
    // For multi-type skills, use the first non-parry type or a general directory
    return 'new';
}

// ============== GENERATE SKILL FILE ==============
function generateSkillFile(skill, existingIds) {
    const grade = GRADE_MAP[skill.grade] || 0;
    const canEnables = detectCanEnables(skill.eq);
    const family = detectFamily(skill.desc_grade, skill.name);
    const enableProps = parseEnableProps(skill.eq);
    const performs = parsePerforms(skill.skill);
    const slots = parseSlots(skill.advance);
    const learnCond = parseLearnCondition(skill.condition, skill.desc);

    const dir = getSkillDir(canEnables, skill.desc_grade);
    const fileName = generateFileName(skill);

    // Calculate import depth from skill/{subdir}/ to core/
    // Path: server/res/skill/{dir}/file.ts -> server/core/
    // '../' * (dir_segments + 2) -> server/ -> core/
    const depth = dir.split('/').filter(s => s).length + 2;
    const importPrefix = '../'.repeat(depth) + 'core/';

    let imports = `import {SKILL`;
    if (performs.length > 0) imports += `, PERFORM`;
    imports += `} from "${importPrefix}skill/skill.js";\n`;
    imports += `import {SKILL_TYPES`;
    if (canEnables.some(e => ['sword', 'blade', 'club', 'staff', 'whip', 'throwing', 'unarmed'].includes(e))) {
        imports += `, WEAPON_TYPE`;
    }
    imports += `} from "${importPrefix}const.js";\n`;
    if (family) {
        imports += `import {FAMILIES} from "${importPrefix}skill/family.js";\n`;
    }
    imports += `import type {PerformData, EnablePropMap } from "${importPrefix}skill/skill.js";\n`;
    imports += `import type { CHARACTER, DoAttackPar } from "${importPrefix}char/character.js";\n`;

    let code = `${imports}
export default class extends SKILL {
    name = "${skill.name}";
    id = "${skill.id}";
    grade = ${grade};
    ${family ? `family = ${family};` : ''}
    desc = "${(skill.desc || '').replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
    can_enables = ${JSON.stringify(canEnables)};`;

    // Attack actions (generic)
    if (canEnables.some(e => ['sword', 'blade', 'club', 'staff', 'whip', 'unarmed', 'throwing'].includes(e))) {
        code += `\n    attack_actions = SKILL.get("${canEnables.find(e => e !== 'parry') || canEnables[0]}")?.attack_actions || [];`;
    }

    // Learn condition
    if (Object.keys(learnCond).length > 0) {
        code += `\n    learn_condition = ${JSON.stringify(learnCond, null, 2).replace(/\n/g, '\n    ')};`;
    }

    // Slots
    if (slots.length > 0) {
        code += `\n    slots = [\n`;
        for (const slot of slots) {
            code += `        {\n`;
            code += `            prop: '${slot.prop}',\n`;
            code += `            value: (lv: number) => 10,\n`;
            code += `            format: (val: number) => '${slot.desc.replace(/'/g, "\\'")}',\n`;
            code += `        },\n`;
        }
        code += `    ];`;
    }

    // Enable props
    if (Object.keys(enableProps).length > 0) {
        code += `\n\n    query_enable_prop(lv: number): EnablePropMap {\n`;
        code += `        return {\n`;
        for (const [type, data] of Object.entries(enableProps)) {
            if (type === '_global') continue;
            code += `            ${type}: {\n`;
            for (const [key, val] of Object.entries(data.props)) {
                code += `                ${key}: ${val},\n`;
            }
            if (data.specials.length > 0) {
                code += `                desc: "${data.specials.join('; ').replace(/"/g, '\\"')}",\n`;
            }
            code += `            },\n`;
        }
        // Global props
        const global = enableProps._global;
        if (global && (Object.keys(global.props).length > 0 || global.specials.length > 0)) {
            code += `            // Global/base properties:\n`;
            code += `            // ${JSON.stringify(global.props)} ${global.specials.join('; ')}\n`;
        }
        code += `        };\n`;
        code += `    }`;
    }

    // Performs
    if (performs.length > 0) {
        const primaryEnable = canEnables.find(e => e !== 'parry') || canEnables[0] || 'force';
        code += `\n\n    pfm_set: PerformData = {\n`;
        for (const pfm of performs) {
            const key = 'pfm_' + performs.indexOf(pfm);
            code += `        ${key}: {\n`;
            code += `            name: "${pfm.name}",\n`;
            code += `            distime: ${pfm.distime},\n`;
            code += `            enable_skill: "${primaryEnable}",\n`;
            code += `            mp: ${pfm.mp},\n`;
            code += `            release_time: ${pfm.release_time},\n`;
            code += `            use: function(me: CHARACTER, target: CHARACTER, lv: number) {\n`;
            code += `                // TODO: Implement ${pfm.name}\n`;
            const safeDesc = pfm.desc.replace(/"/g, '\\"').replace(/\n/g, ' ');
            code += `                // ${safeDesc}\n`;
            code += `                me.send_room("$N使出「${pfm.name}」攻向$n。", target);\n`;
            code += `                me.do_attack({ target, gj: me.gj, mz: me.mz });\n`;
            code += `                me.end_attack(target);\n`;
            code += `            },\n`;
            code += `            query_desc: function(me: CHARACTER, lv: number) {\n`;
            code += `                return "${safeDesc}";\n`;
            code += `            },\n`;
            code += `        },\n`;
        }
        code += `    };`;
    }

    code += `\n}\n`;

    return { fileName, code, dir };
}

// ============== MAIN ==============
async function main() {
    console.log('Reading data file...');
    const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');

    const result = eval('(() => {' + dataContent + '; return { weaponData, skilldata }; })()');
    const skilldata = result.skilldata || [];

    // Get existing skill IDs
    const existingIds = new Set();
    function findSkillFiles(dir) {
        const files = [];
        if (!fs.existsSync(dir)) return files;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) files.push(...findSkillFiles(full));
            else if (entry.name.endsWith('.ts')) files.push(full);
        }
        return files;
    }
    for (const f of findSkillFiles(SKILL_ROOT)) {
        const content = fs.readFileSync(f, 'utf-8');
        const m = content.match(/id\s*=\s*['"]([^'"]+)['"]/);
        if (m) existingIds.add(m[1]);
    }

    // Filter to only new skills
    const newSkills = skilldata.filter(s => s.id && !existingIds.has(s.id));

    // Skip base skills (they already exist)
    const baseIds = ['force', 'dodge', 'parry', 'sword', 'blade', 'club', 'staff', 'whip', 'unarmed', 'throwing', 'bite', 'literate', 'lianyao'];
    const filteredSkills = newSkills.filter(s => !baseIds.includes(s.id));

    console.log(`Total skills in data: ${skilldata.length}`);
    console.log(`New skills to generate: ${filteredSkills.length}`);

    // Generate files in batches by directory
    const byDir = {};
    for (const skill of filteredSkills) {
        const canEnables = detectCanEnables(skill.eq);
        const dir = getSkillDir(canEnables, skill.desc_grade);
        if (!byDir[dir]) byDir[dir] = [];
        byDir[dir].push(skill);
    }

    let totalGenerated = 0;
    for (const [dir, skills] of Object.entries(byDir)) {
        const outDir = path.join(SKILL_ROOT, dir);
        fs.mkdirSync(outDir, { recursive: true });

        for (const skill of skills) {
            const { fileName, code } = generateSkillFile(skill, existingIds);
            const filePath = path.join(outDir, fileName + '.ts');
            fs.writeFileSync(filePath, code, 'utf-8');
            totalGenerated++;
        }
        console.log(`  ${dir}/: ${skills.length} skills`);
    }

    console.log(`\nGenerated ${totalGenerated} skill files.`);
    console.log('Note: Perform implementations are stubs and need manual completion.');
}

main().catch(console.error);
