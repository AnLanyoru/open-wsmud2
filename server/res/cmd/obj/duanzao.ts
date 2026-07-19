import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { OBJ } from '../../../core/item/obj.js';
import { EQUIPMENT } from '../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../core/const.js';
import { UTIL } from '../../../core/util.js';
import { rebuild_custom_prop } from './reforge.js';

interface ForgeType {
    name: string;
    eqType: number;
    weaponType?: string;
    unit: string;
}

export const FORGE_TYPES: Record<string, ForgeType> = {
    sword: { name: '剑', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.SWORD, unit: '把' },
    blade: { name: '刀', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.BLADE, unit: '把' },
    club: { name: '棍', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.CLUB, unit: '根' },
    staff: { name: '杖', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.STAFF, unit: '根' },
    whip: { name: '鞭', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.WHIP, unit: '条' },
    unarmed: { name: '拳套', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.NONE, unit: '副' },
    none: { name: '拳套', eqType: EQUIP_TYPE.WEAPON, weaponType: WEAPON_TYPE.NONE, unit: '副' },
    cloth: { name: '衣服', eqType: EQUIP_TYPE.CLOTH, unit: '件' },
    shoes: { name: '鞋', eqType: EQUIP_TYPE.SHOES, unit: '双' },
    head: { name: '帽子', eqType: EQUIP_TYPE.HEAD, unit: '顶' },
    cape: { name: '披风', eqType: EQUIP_TYPE.CAPE, unit: '件' },
    wrist: { name: '护手', eqType: EQUIP_TYPE.WRIST, unit: '对' },
    waist: { name: '腰带', eqType: EQUIP_TYPE.WAIST, unit: '条' },
    ring: { name: '戒指', eqType: EQUIP_TYPE.RING, unit: '枚' },
    necklace: { name: '项链', eqType: EQUIP_TYPE.NECKLACE, unit: '条' },
    jewels: { name: '饰品', eqType: EQUIP_TYPE.JEWELS, unit: '件' },
    throwing: { name: '暗器', eqType: EQUIP_TYPE.THROWING, weaponType: WEAPON_TYPE.THROWING, unit: '件' },
};

const GROUPS: Record<string, string[]> = {
    weapon: ['sword', 'blade', 'club', 'staff', 'whip', 'unarmed'],
    clothing: ['cloth', 'shoes', 'head', 'cape', 'wrist', 'waist'],
    accessory: ['ring', 'necklace', 'jewels', 'throwing'],
};

export default class extends COMMAND {
    command = 'duanzao';
    regex = /^(\w+)(?:\s(\w+))?$/;
    allow_fight = false;

    default_template(obj: EQUIPMENT, eqType: number): void {
        const key = obj.path.split('#')[1] ?? '';
        const type = FORGE_TYPES[key];
        obj.eq_type = type?.eqType ?? eqType;
        obj.weapon_type = type?.weaponType ?? '';
        obj.unit = type?.unit ?? '件';
        const name = obj.query_temp<string>('name', obj.name);
        obj.name = name;
        obj.set_temp('cp_name', name);
        obj.color_name = '<hio>' + name + '</hio>';
        rebuild_custom_prop(obj);
    }

    enter(me: USER, arg?: string): void {
        if (!arg || GROUPS[arg]) return this.show_types(me, arg ?? 'weapon');
        const type = FORGE_TYPES[arg];
        if (!type) return me.notify('不能制作这种装备。');
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) return me.notify('制作自制装备需要10块<hio>元晶</hio>。');
        me.notify('请在房间频道说出装备名字，名字必须为2至5个汉字。');
        me.wait_input = (player: USER, input: string): void => this.finish(player, arg, input);
        me.send_commands('cancle', '我不制作了');
    }

    show_types(me: USER, group: string): void {
        const types = GROUPS[group];
        if (!types) return me.notify('没有这类制作服务。');
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) return me.notify('制作需要10块<hio>元晶</hio>，你的材料不足。');
        me.notify('请选择你要制作的装备类型：');
        const commands: string[] = [];
        for (const key of types) commands.push('duanzao ' + key, FORGE_TYPES[key].name);
        me.send_commands(...commands);
    }

    finish(me: USER, key: string, input: string): void {
        if (input === 'cancle') {
            me.wait_input = undefined;
            me.notify('你取消了本次制作。');
            return;
        }
        const name = input.includes(' ') ? input.slice(input.indexOf(' ') + 1).trim() : input.trim();
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(name)) return me.notify('装备名字必须是2至5个汉字。');
        if (!UTIL.check_word(name)) return me.notify('你不能使用这个名字。');
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) {
            me.wait_input = undefined;
            return me.notify('你的元晶不足。');
        }
        if (me.is_full()) return me.notify('你的背包已经满了。');
        const type = FORGE_TYPES[key];
        if (!type) {
            me.wait_input = undefined;
            return me.notify('制作类型已经失效。');
        }
        const obj = OBJ.CREATE('eq/cp#' + key) as EQUIPMENT;
        obj.name = name;
        obj.set_temp('cp_name', name);
        obj.color_name = '<hio>' + name + '</hio>';
        rebuild_custom_prop(obj);
        if (!me.remove_obj(crystal, 10)) return me.notify('元晶扣除失败。');
        me.wait_input = undefined;
        if (!me.add_obj(obj)) {
            me.add_obj('st/yuanjing', 10);
            return me.notify('制作失败，已退还10块元晶。');
        }
        me.notify('制作完成，你获得了' + obj.unit_name() + '。');
    }
}
