import { COMMAND } from '../../../core/command.js';
import type { CmdAndText, USER } from '../../../core/char/user.js';
import { EQUIPMENT } from '../../../core/item/equipment.js';
import { FORGE_TYPES, PROPERTIES, WEAPON_TYPE } from '../../../core/const.js';
import { WORLD } from '../../../core/world.js';
import type { PropMap } from '../../../types/props.js';

export default class extends COMMAND {
    command = 'reforge';
    regex = /^(\w+)(?:\s(\w+))?(?:\s(\w+))?(?:\s(\w+))?(?:\s(\w+))?$/;
    allow_fight = false;

    enter(me: USER, id: string, operation?: string, arg1?: string, arg2?: string, confirm?: string): void {
        const obj = find_equipment(me, id);
        if (!obj) return me.notify('你只能重铸自己背包中的自制装备。');
        if (!operation) return this.show(me, obj);
        if (obj.is_locked) return me.notify(obj.color_name + '处于锁定状态，无法重铸。');
        switch (operation) {
            case 'add':
                this.add(me, obj, arg1);
                break;
            case 'upgrade': {
                const index = Number(arg1);
                if (!Number.isInteger(index) || index < 0 || index >= CUSTOM_PROP_COUNT) {
                    return me.notify('没有这条属性。');
                }
                this.upgrade(me, obj, index, arg2);
                break;
            }
            case 'replace': {
                const index = Number(arg1);
                if (!Number.isInteger(index) || index < 0 || index >= CUSTOM_PROP_COUNT) {
                    return me.notify('没有这条属性。');
                }
                this.replace(me, obj, index, arg2, confirm);
                break;
            }
            case 'wash':
                this.wash(me, obj, arg1);
                break;
            default:
                return me.notify('没有这个重铸操作。');
        }
    }

    show(me: USER, obj: EQUIPMENT): void {
        const limits = query_category_limits(obj);
        const wash_count = query_wash_count(obj)
        const ability = wash_count >= 25 ? '1条特殊能力槽位已开放' : '特殊能力槽位将在洗练25次后开放';
        me.notify(
            obj.color_name
            + '已洗练' + wash_count + '次'
            + '，可装配的4条属性最多包含'
            + limits.base + '条基础属性、'
            + limits.acquired + '条后天属性、'
            + limits.advanced + '条高级属性、'
            + limits.rare + '条稀有属性、'
            + limits.special + '条特殊属性，'
            + ability
            + '，词条可升级次数<hio>' + query_upgrade_limit(obj) + '</hio>。',
        );
        let count = 0;
        const cmd_and_text: CmdAndText[] = []
        for (let i = 0; i < CUSTOM_PROP_COUNT; i++) {
            const key = query_prop_key(obj, i);
            if (!key) continue;
            count++;
            const level = query_prop_level(obj, i);
            cmd_and_text.push(
                ['reforge ' + obj.id + ' replace ' + i, '替换'],
                ['reforge ' + obj.id + ' upgrade ' + i, '升级', format_custom_prop(key, level) + ' (' + level + ')', true]);
        }
        cmd_and_text.push(['reforge ' + obj.id + ' wash', '洗练一次']);
        if (count < CUSTOM_PROP_COUNT) cmd_and_text.push(['reforge ' + obj.id + ' add', '增加新的属性']);
        me.send_cmd_and_text(...cmd_and_text)
    }

    add(me: USER, obj: EQUIPMENT, key?: string): void {
        const slot = first_empty_slot(obj);
        if (slot < 0) return me.notify('这件装备已经有四条附加属性。');
        if (!key) return send_add_choices(me, obj);
        if (!can_select(obj, key)) return me.notify('当前部位不能添加这个属性，或对应类别已达到上限。');
        if (!consume_material(me, key, 1)) return me.notify('你缺少一块<hio>' + query_material_name(key) + '</hio>。');
        obj.set_temp('cp_p' + slot, key);
        obj.set_temp('cp_l' + slot, 1);
        rebuild_custom_prop(obj);
        me.items_changed(obj);
        WORLD.STATS.updateWeapon(me, obj);
        me.notify('重铸成功，' + (PROPERTIES[key] ?? key) + '提升为' + format_entry(key, 1) + '。');
    }

    upgrade(me: USER, obj: EQUIPMENT, index: number, confirm?: string): void {
        const key = query_prop_key(obj, index);
        const level = query_prop_level(obj, index);
        if (!key || level < 1) return me.notify('没有这条属性。');
        const target = level + 1;
        if (target > query_upgrade_limit(obj)) return me.notify('当前洗练次数不足以继续升级这条属性。');
        if (confirm !== 'ok') {
            me.notify('是否确认提升词条为' + format_custom_prop(key, target) + '？需要' + target + '块<hio>' + query_material_name(key) + '</hio>。');
            return me.send_commands('reforge ' + obj.id + ' upgrade ' + index + ' ok', '确定提升');
        }
        if (!consume_material(me, key, target)) return me.notify('对应属性材料不足。');
        obj.set_temp('cp_l' + index, target);
        rebuild_custom_prop(obj);
        me.items_changed(obj);
        WORLD.STATS.updateWeapon(me, obj);
        me.notify('词条提升成功。');
        me.notify(obj.get_desc(me));
        me.send_commands('reforge ' + obj.id, '继续重铸');
    }

    replace(me: USER, obj: EQUIPMENT, index: number, key?: string, confirm?: string): void {
        const oldKey = query_prop_key(obj, index);
        const oldLevel = query_prop_level(obj, index);
        if (!oldKey || oldLevel < 1) return me.notify('没有这条属性。');
        if (!key) return send_replace_choices(me, obj, index, oldKey, oldLevel);
        if (!can_select(obj, key, index)) return me.notify('不能用这个属性替换当前词条。');
        if (confirm !== 'ok') {
            me.notify('是否确认将词条' + format_custom_prop(oldKey, oldLevel) + '替换为' + format_custom_prop(key, 1) + '，将退回' + query_material_count(oldLevel) + '块<hio>' + query_material_name(oldKey) + '</hio>，消耗100两<hiy>黄金</hiy>。');
            return me.send_commands('reforge ' + obj.id + ' replace ' + index + ' ' + key + ' ok', '确定替换');
        }
        const stone = me.find_obj_bypath('st/p#' + key);
        if (!stone?.count) return me.notify('你缺少新的属性材料。');
        if (!me.add_money(-REPLACE_COST)) return me.notify('你没有100两黄金。');
        if (!me.remove_obj(stone, 1)) {
            me.add_money(REPLACE_COST);
            return me.notify('属性材料扣除失败。');
        }
        me.add_obj('st/p#' + oldKey, query_material_count(oldLevel));
        obj.set_temp('cp_p' + index, key);
        obj.set_temp('cp_l' + index, 1);
        rebuild_custom_prop(obj);
        me.items_changed(obj);
        WORLD.STATS.updateWeapon(me, obj);
        me.notify('词条替换成功。');
        me.notify(obj.get_desc(me));
        me.send_commands('reforge ' + obj.id, '继续重铸');
    }

    wash(me: USER, obj: EQUIPMENT, confirm?: string): void {
        if (confirm !== 'ok') {
            me.notify('洗练一次消耗1块<hio>元晶</hio>，并使固定属性提升1点。');
            return me.send_commands('reforge ' + obj.id + ' wash ok', '确定洗练');
        }
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal?.count || !me.remove_obj(crystal, 1)) return me.notify('你没有元晶。');
        obj.add_temp('cp_sc', 1);
        rebuild_custom_prop(obj);
        me.items_changed(obj);
        WORLD.STATS.updateWeapon(me, obj);
        me.notify('洗练成功，当前已洗练<hio>' + query_wash_count(obj) + '</hio>次。');
        me.notify(obj.get_desc(me));
        me.send_commands('reforge ' + obj.id, '继续重铸');
    }
}


export type CustomPropCategory = 'base' | 'acquired' | 'advanced' | 'rare' | 'special';

export interface CustomPropDef {
    key: keyof PropMap;
    category: CustomPropCategory;
    base: number;
    step: number;
    parts: number[];
}

export const CUSTOM_PATH = 'eq/cp#';
export const CUSTOM_PROP_COUNT = 4;
export const REPLACE_COST = 1000000;
export const CATEGORY_NAMES: Record<CustomPropCategory, string> = {
    base: '基础属性',
    acquired: '后天属性',
    advanced: '高级属性',
    rare: '稀有属性',
    special: '特殊属性',
};
const CATEGORY_SCORES: Record<CustomPropCategory, (lv: number) => number> = {
    base: (lv: number) => 10 + (lv * 5),
    acquired: (lv: number) => 20 + (lv * 6),
    advanced: (lv: number) => 30 + (lv * 7),
    rare: (lv: number) => 40 + (lv * 8),
    special: (lv: number) => 50 + (lv * 10),
};
const OWNER_NAME_TTL = 300000;
const OWNER_NAME_CACHE_LIMIT = 5000;
const OWNER_NAMES = new Map<string, { name: string; expires: number }>();
const OWNER_NAME_QUERIES = new Map<string, Promise<void>>();
const OWNER_EQUIPMENT = new Map<string, Set<EQUIPMENT>>();

const ALL_PARTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const EFFICIENCY_PARTS = ALL_PARTS;

export const CUSTOM_PROPS: Record<string, CustomPropDef> = create_prop_defs();

function create_prop_defs(): Record<string, CustomPropDef> {
    const defs: CustomPropDef[] = [
        { key: 'gj', category: 'base', base: 210, step: 10, parts: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { key: 'mz', category: 'base', base: 210, step: 10, parts: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10] },
        { key: 'fy', category: 'base', base: 210, step: 10, parts: [0, 5, 6, 8, 10] },
        { key: 'ds', category: 'base', base: 210, step: 10, parts: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10] },
        { key: 'zj', category: 'base', base: 210, step: 10, parts: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10] },
        { key: 'max_hp', category: 'base', base: 4000, step: 2000, parts: ALL_PARTS },
        { key: 'max_mp', category: 'base', base: 4000, step: 2000, parts: ALL_PARTS },
        { key: 'str', category: 'acquired', base: 28, step: 2, parts: ALL_PARTS },
        { key: 'con', category: 'acquired', base: 28, step: 2, parts: ALL_PARTS },
        { key: 'dex', category: 'acquired', base: 28, step: 2, parts: ALL_PARTS },
        { key: 'int', category: 'acquired', base: 28, step: 2, parts: ALL_PARTS },
        { key: 'gj_per', category: 'advanced', base: 7, step: 1, parts: [0, 5, 7, 9, 10] },
        { key: 'mz_per', category: 'advanced', base: 7, step: 1, parts: [0, 2, 3, 6, 7, 8, 10] },
        { key: 'fy_per', category: 'advanced', base: 7, step: 1, parts: [1, 2, 3, 4, 7, 9] },
        { key: 'ds_per', category: 'advanced', base: 7, step: 1, parts: [1, 2, 3, 4, 6, 7] },
        { key: 'zj_per', category: 'advanced', base: 7, step: 1, parts: [0, 1, 4, 6, 7, 9] },
        { key: 'hp_per', category: 'advanced', base: 7, step: 1, parts: ALL_PARTS },
        { key: 'lianxi_per', category: 'advanced', base: 9, step: 1, parts: EFFICIENCY_PARTS },
        { key: 'dazuo_per', category: 'advanced', base: 9, step: 1, parts: EFFICIENCY_PARTS },
        { key: 'study_per', category: 'advanced', base: 9, step: 1, parts: EFFICIENCY_PARTS },
        { key: 'add_sh_per', category: 'rare', base: 7, step: 1, parts: [0, 4, 5, 8, 10] },
        { key: 'add_bjsh_per', category: 'rare', base: 7, step: 1, parts: [0, 8, 10] },
        { key: 'diff_bj', category: 'rare', base: 7, step: 1, parts: [1, 3, 4] },
        { key: 'diff_sh_per', category: 'rare', base: 7, step: 1, parts: [1, 2, 4, 5, 7] },
        { key: 'expend_mp_per', category: 'rare', base: 7, step: 1, parts: [0, 3, 5, 7, 8] },
        { key: 'diff_busy_per', category: 'rare', base: 7, step: 1, parts: [1, 2, 3, 4, 9] },
        { key: 'gjsd_per', category: 'rare', base: 7, step: 1, parts: [0, 1, 7] },
        { key: 'diff_fy_per', category: 'rare', base: 7, step: 1, parts: [0, 5, 6, 8, 10] },
        { key: 'releasetime_per', category: 'rare', base: 7, step: 1, parts: [0, 1, 3, 5, 8, 9] },
        { key: 'per', category: 'special', base: 2, step: 1, parts: [1, 3, 6, 7] },
        { key: 'bj_per', category: 'special', base: 2, step: 1, parts: [0, 3, 5, 7, 8, 10] },
        { key: 'gjsd', category: 'special', base: 500, step: 100, parts: [5, 7, 8] },
        { key: 'busy', category: 'special', base: 2000, step: 100, parts: [0, 9] },
        { key: 'busy_per', category: 'special', base: 7, step: 1, parts: [8, 9] },
        { key: 'diff_busy', category: 'special', base: 2000, step: 100, parts: [2, 9] },
        { key: 'diff_downside_per', category: 'special', base: 7, step: 1, parts: [2, 3, 4] },
        { key: 'distime', category: 'special', base: 1400, step: 100, parts: [3, 6, 8] },
        { key: 'distime_per', category: 'special', base: 7, step: 1, parts: [0, 3, 6] },
        { key: 'releasetime', category: 'special', base: 900, step: 100, parts: [0, 5, 7, 8] },
        { key: 'diff_sh', category: 'special', base: 2000, step: 2000, parts: [1, 2, 3, 4, 9] },
    ];
    const result: Record<string, CustomPropDef> = Object.create(null);
    for (const def of defs) result[def.key] = def;
    return result;
}

export function is_custom_equipment(obj: EQUIPMENT): boolean {
    return obj.path.startsWith(CUSTOM_PATH);
}

export function query_wash_count(obj: EQUIPMENT): number {
    return obj.query_temp<number>('cp_sc', 0);
}

export function query_upgrade_limit(obj: EQUIPMENT): number {
    return Math.min(6, Math.floor(query_wash_count(obj) / 10) + 1);
}

export function query_category_limits(obj: EQUIPMENT): Record<CustomPropCategory, number> {
    const count = query_wash_count(obj);
    return {
        base: 4,
        acquired: count >= 10 ? 4 : 3,
        advanced: count >= 50 ? 4 : count >= 10 ? 3 : 2,
        rare: count >= 150 ? 3 : count >= 10 ? 2 : 1,
        special: count >= 50 ? 2 : 1,
    };
}

export function query_prop_key(obj: EQUIPMENT, index: number): string {
    return obj.query_temp<string>('cp_p' + index, '');
}

export function query_prop_level(obj: EQUIPMENT, index: number): number {
    return obj.query_temp<number>('cp_l' + index, 0);
}

export function query_prop_value(key: string, level: number): number {
    const def = CUSTOM_PROPS[key];
    return def ? def.base + def.step * level : 0;
}

export function query_material_count(level: number): number {
    return (level * (level + 1)) / 2;
}

export function query_fixed_prop(eqType: number): keyof PropMap {
    if (eqType === 0 || eqType === 10) return 'gj';
    if (eqType === 5) return 'mz';
    if (eqType === 6) return 'ds';
    if (eqType === 8) return 'zj';
    return 'fy';
}

export function query_custom_base_score(obj: EQUIPMENT): number {
    let score = 450 + query_wash_count(obj);
    for (let i = 0; i < CUSTOM_PROP_COUNT; i++) {
        const def = CUSTOM_PROPS[query_prop_key(obj, i)];
        if (!def) continue;
        const lv = query_prop_level(obj, i)
        score += CATEGORY_SCORES[def.category](lv);
    }
    return score;
}

export function query_custom_score(obj: EQUIPMENT): number {
    let score = query_custom_base_score(obj) + obj.level * obj.grade * 10;
    if (obj.st_prop) {
        for (const stone of obj.st_prop) score += stone.grade * 10;
    }
    return score;
}

export function rebuild_custom_prop(obj: EQUIPMENT): void {
    const prop: Record<string, number> = {};
    const fixed = query_fixed_prop(obj.eq_type);
    prop[fixed] = 450 + query_wash_count(obj);
    for (let i = 0; i < CUSTOM_PROP_COUNT; i++) {
        const key = query_prop_key(obj, i);
        const level = query_prop_level(obj, i);
        if (!key || !CUSTOM_PROPS[key] || level < 1) continue;
        prop[key] = query_prop_value(key, level);
    }
    obj.prop = prop as PropMap;
    obj.original_prop = prop as PropMap;
    if (obj.level > 0) EQUIPMENT.prototype.levelchange_prop.call(obj);
    obj.score = query_custom_base_score(obj);
    const ownerId = obj.query_temp<string>('cp_owner_id', '');
    const cpDesc = obj.query_temp<string>('cp_desc', '');
    const owner = query_owner_name(ownerId, obj);
    const forgeKey = obj.path.split('#')[1] ?? '';
    const weaponName = query_weapon_name(obj.weapon_type);
    const [weaponType, part] = weaponName
        ? [`是一${obj.unit}${weaponName}，`, '武器']
        : ['', FORGE_TYPES[forgeKey]?.name ?? obj.parts[obj.eq_type] ?? '装备'];
    obj.desc = cpDesc
        ? `${cpDesc}\n这${weaponType}是${owner}的专属${part}，基础评分${obj.score}，当前评分${query_custom_score(obj)}`
        : `这${weaponType}是${owner}的专属${part}，基础评分${obj.score}，当前评分${query_custom_score(obj)}`;
    obj.refresh();
}

function query_weapon_name(type: string): string {
    if (type === WEAPON_TYPE.SWORD) return '剑';
    if (type === WEAPON_TYPE.BLADE) return '刀';
    if (type === WEAPON_TYPE.CLUB) return '棍';
    if (type === WEAPON_TYPE.STAFF) return '杖';
    if (type === WEAPON_TYPE.WHIP) return '鞭';
    if (type === WEAPON_TYPE.NONE) return '拳套';
    if (type === WEAPON_TYPE.THROWING) return '暗器';
    return '';
}

function query_owner_name(ownerId: string, obj: EQUIPMENT): string {
    if (!ownerId) return '未知侠士';
    const user = WORLD.getUser(ownerId);
    if (user?.name) {
        OWNER_NAMES.set(ownerId, { name: user.name, expires: Date.now() + OWNER_NAME_TTL });
        return user.name;
    }
    const cached = OWNER_NAMES.get(ownerId);
    if (cached && cached.expires > Date.now()) return cached.name;
    if (cached) OWNER_NAMES.delete(ownerId);
    let equipment = OWNER_EQUIPMENT.get(ownerId);
    if (!equipment) {
        equipment = new Set<EQUIPMENT>();
        OWNER_EQUIPMENT.set(ownerId, equipment);
    }
    equipment.add(obj);
    if (!OWNER_NAME_QUERIES.has(ownerId)) {
        const query = WORLD.DB.getRoleNameByID(ownerId)
            .then(row => {
                const name = row?.name ?? '未知侠士';
                if (OWNER_NAMES.size >= OWNER_NAME_CACHE_LIMIT) {
                    const oldest = OWNER_NAMES.keys().next().value;
                    if (oldest) OWNER_NAMES.delete(oldest);
                }
                OWNER_NAMES.set(ownerId, { name, expires: Date.now() + OWNER_NAME_TTL });
                const items = OWNER_EQUIPMENT.get(ownerId);
                OWNER_EQUIPMENT.delete(ownerId);
                if (items) for (const item of items) rebuild_custom_prop(item);
            })
            .catch(error => {
                OWNER_EQUIPMENT.delete(ownerId);
                console.error('查询自制装备主人名称失败', ownerId, error);
            })
            .finally(() => OWNER_NAME_QUERIES.delete(ownerId));
        OWNER_NAME_QUERIES.set(ownerId, query);
    }
    return cached?.name ?? '未知侠士';
}

export function query_material_name(key: string): string {
    const def = CUSTOM_PROPS[key];
    if (!def) return key;
    return CATEGORY_NAMES[def.category] + '：' + (PROPERTIES[key] ?? key) + (is_percentage_prop(key) ? '%' : '');
}

function is_percentage_prop(key: string): boolean {
    const def = CUSTOM_PROPS[key];
    if (!def) return false;
    if (def.category === 'advanced' || def.category === 'rare') return true;
    return ['bj_per', 'busy_per', 'diff_downside_per', 'distime_per'].includes(key);
}

function format_value(key: string, level: number): string {
    const value = query_prop_value(key, level);
    if (['releasetime', 'distime', 'gjsd', 'busy', 'diff_busy'].includes(key)) return value / 1000 + '秒';
    const def = CUSTOM_PROPS[key];
    if (def && ['advanced', 'rare'].includes(def.category)) return value + '%';
    if (['bj_per', 'busy_per', 'diff_downside_per', 'distime_per'].includes(key)) return value + '%';
    return String(value);
}

function format_entry(key: string, level: number): string {
    const prefix = ['releasetime', 'distime', 'expend_mp_per', 'releasetime_per', 'distime_per'].includes(key)
        ? '-'
        : '+';
    return prefix + format_value(key, level);
}

function format_custom_prop(key: string, level: number): string {
    return '<hio>' + (PROPERTIES[key] ?? key) + '：' + format_entry(key, level) + '</hio>';
}

function find_equipment(me: USER, id: string): EQUIPMENT | undefined {
    const obj = me.find_obj(id);
    if (!obj?.check_equipment() || !is_custom_equipment(obj)) return undefined;
    return obj;
}

function category_count(obj: EQUIPMENT, category: CustomPropCategory, ignoredIndex = -1): number {
    let count = 0;
    for (let i = 0; i < CUSTOM_PROP_COUNT; i++) {
        if (i === ignoredIndex) continue;
        const def = CUSTOM_PROPS[query_prop_key(obj, i)];
        if (def?.category === category) count++;
    }
    return count;
}

function first_empty_slot(obj: EQUIPMENT): number {
    for (let i = 0; i < CUSTOM_PROP_COUNT; i++) if (!query_prop_key(obj, i)) return i;
    return -1;
}

function can_select(obj: EQUIPMENT, key: string, ignoredIndex = -1): boolean {
    const def = CUSTOM_PROPS[key];
    if (!def || !def.parts.includes(obj.eq_type)) return false;
    for (let i = 0; i < CUSTOM_PROP_COUNT; i++) {
        if (i !== ignoredIndex && query_prop_key(obj, i) === key) return false;
    }
    const limits = query_category_limits(obj);
    return category_count(obj, def.category, ignoredIndex) < limits[def.category];
}

function consume_material(me: USER, key: string, count: number): boolean {
    const stone = me.find_obj_bypath('st/p#' + key);
    return !!stone && stone.count >= count && !!me.remove_obj(stone, count);
}

function send_add_choices(me: USER, obj: EQUIPMENT): void {
    const choice_list: string[] = []
    for (const key in CUSTOM_PROPS) {
        if (!can_select(obj, key)) continue;
        const stone = me.find_obj_bypath('st/p#' + key);
        if (!stone?.count) continue;
        choice_list.push(
            'reforge ' + obj.id + ' add ' + key,
            '使用' + stone.color_name + '重铸后' + format_custom_prop(key, 1));
    }
    if (choice_list.length < 1) return me.notify('你没有符合当前部位和类别上限的属性材料。');
    me.send_commands(...choice_list);
}

function send_replace_choices(me: USER, obj: EQUIPMENT, index: number, old_key: string, old_lv: number): void {
    const choice_list: string[] = []
    for (const key in CUSTOM_PROPS) {
        if (!can_select(obj, key, index)) continue;
        const stone = me.find_obj_bypath('st/p#' + key);
        if (!stone?.count) continue;
        choice_list.push(
            'reforge ' + obj.id + ' replace ' + index + ' ' + key,
            '将' + format_custom_prop(old_key, old_lv) + '替换为' + format_custom_prop(key, 1));
    }
    if (choice_list.length < 1) return me.notify('你没有符合当前部位和类别上限的属性材料。');
    me.send_commands(...choice_list);
}
