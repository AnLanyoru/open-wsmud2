import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { OBJ } from '../../../core/item/obj.js';
import { EQUIPMENT } from '../../../core/item/equipment.js';
import { EQUIP_TYPE, FORGE_TYPES, FORGE_WEAPON_TYPES, WEAPON_TYPE } from '../../../core/const.js';
import { UTIL } from '../../../core/util.js';
import { WORLD } from '../../../core/world.js';
import { rebuild_custom_prop } from './reforge.js';
import type { NPC } from '../../../core/char/npc.js';

interface ForgeNpc extends NPC {
    query_duanzao_message(stage: string, typeName?: string, itemName?: string): string;
}

const GROUPS: Record<string, string[]> = Object.assign(Object.create(null), {
    'pub/tiejiang': FORGE_WEAPON_TYPES,
    'yz/zeng': ['cloth', 'shoes', 'head', 'cape', 'wrist', 'waist'],
    'pub/zi': ['ring', 'necklace', 'jewels', 'bracelet', 'hairpin', 'throwing'],
});

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
        const npc = this.find_npc(me);
        if (!npc) return me.notify('这里没有人可以帮你打造装备。');
        if (!arg) return this.show_types(me, npc);
        const types = GROUPS[npc.path];
        if (!types?.includes(arg)) {
            me.wait_input = undefined;
            return me.notify(npc.query_duanzao_message('invalid_type'));
        }
        const type = FORGE_TYPES[arg];
        if (!type) {
            me.wait_input = undefined;
            return me.notify(npc.query_duanzao_message('invalid_type'));
        }
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) return me.notify(npc.query_duanzao_message('material_lack'));
        me.notify(npc.query_duanzao_message('name', type.name));
        me.wait_input = (player: USER, input: string): void => this.finish(player, npc, arg, input);
        me.send_commands('cancle', '我不制作了');
    }

    show_types(me: USER, npc: ForgeNpc): void {
        const types = GROUPS[npc.path];
        if (!types) return me.notify('没有这类制作服务。');
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) return me.notify(npc.query_duanzao_message('material_lack'));
        me.notify(npc.query_duanzao_message('choose'));
        const commands: string[] = [];
        for (const key of types) commands.push('duanzao ' + key, FORGE_TYPES[key].forge_show ?? FORGE_TYPES[key].name);
        me.send_commands(...commands);
    }

    finish(me: USER, npc: ForgeNpc, key: string, input: string): void {
        const types = GROUPS[npc.path];
        if (!types?.includes(key)) {
            me.wait_input = undefined;
            return me.notify(npc.query_duanzao_message('invalid_type'));
        }
        if (input === 'cancle') {
            me.wait_input = undefined;
            me.notify(npc.query_duanzao_message('cancel'));
            return;
        }
        const name = input.includes(' ') ? input.slice(input.indexOf(' ') + 1).trim() : input.trim();
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(name)) return me.notify(npc.query_duanzao_message('invalid_name'));
        if (!UTIL.check_word(name)) return me.notify(npc.query_duanzao_message('forbidden_name'));
        const crystal = me.find_obj_bypath('st/yuanjing');
        if (!crystal || crystal.count < 10) {
            me.wait_input = undefined;
            return me.notify(npc.query_duanzao_message('material_lack'));
        }
        if (me.is_full()) return me.notify(npc.query_duanzao_message('bag_full'));
        const type = FORGE_TYPES[key];
        if (!type) {
            me.wait_input = undefined;
            return me.notify(npc.query_duanzao_message('invalid_type'));
        }
        const obj = OBJ.CREATE('eq/cp#' + key) as EQUIPMENT;
        obj.name = name;
        obj.set_temp('cp_name', name);
        obj.set_temp('cp_owner_id', me.id);
        obj.color_name = '<hio>' + name + '</hio>';
        rebuild_custom_prop(obj);
        if (!me.remove_obj(crystal, 10)) return me.notify(npc.query_duanzao_message('material_lack'));
        me.wait_input = undefined;
        if (!me.add_obj(obj)) {
            me.add_obj('st/yuanjing', 10);
            return me.notify(npc.query_duanzao_message('failed'));
        }
        WORLD.STATS.updateWeapon(me, obj);
        me.notify(npc.query_duanzao_message('success', type.name, obj.unit_name()));
    }

    find_npc(me: USER): ForgeNpc | undefined {
        const items = me.environment?.items;
        if (!items) return undefined;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.check_npc()) continue;
            if (!GROUPS[item.path]) continue;
            const npc = item as ForgeNpc;
            if (typeof npc.query_duanzao_message === 'function') return npc;
        }
        return undefined;
    }
}
