import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'pack';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param me - 执行命令的角色
     */
    enter(me: USER, arg: string) {
        let target: CHARACTER = me;
        if (arg) {
            if (arg == 'none')
                return me.notify('{"type":"dialog","dialog":"pack","money":' + me.money + '}');

            let other_target = me.find_obj(arg, me.environment);
            if (!other_target && me.user_level > 1) {
                other_target = WORLD.getUser(arg);
            }
            if (!other_target || !other_target.check_character()) {
                return me.notify('这里没有这个人。');
            }
            if (me.user_level < 4 && other_target.master != me.id)
                return me.notify('你只能查看自己的背包。');
            target = other_target;
        }
        let str: (string | number)[] = ['{"type":"dialog","dialog":"'];

        if (target != me || !me.is_player) {
            str.push('pack2",id:"');
            str.push(target.id);
            str.push('",name:"');
            str.push(target.name);
            str.push('",');
        } else {
            str.push('pack",');
        }
        str.push('"items":[');
        let items = target.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (i > 0) str.push(',');
                str.push(item.format_to_pack());
                // str.push('{name:"');
                // str.push(item.color_name);
                // str.push('",id:"');
                // str.push(item.id);
                // str.push('",count:');
                // str.push(item.count);
                // str.push(',unit:"');
                // str.push(item.unit);
                // str.push('"');
                // str.push(',value:');
                // str.push(parseInt(item.value / 10));
                // if (item.is_equipment) {
                //     str.push(',can_eq:1');
                // }
                // if (item.on_use) {
                //     str.push(',can_use:1');
                // }
                // if (item.on_study) {
                //     str.push(',can_study:1');
                // }
                // if (item.on_open) {
                //     str.push(',can_open:1');
                // }
                // if (item.combine_count) {
                //     str.push(',can_combine:' + item.combine_count);
                // }
                // str.push('}');
            }
        }
        str.push('],"money":');
        str.push(target.money || 0);
        const eqs = target.equipment;
        if (eqs) {
            str.push(',eqs:[');
            for (let i = 0; i < eqs.length; i++) {
                let eq = eqs[i];
                if (i > 0) str.push(',');
                if (eq) {
                    str.push(
                        `[${JSON.stringify(eq.color_name ?? '')},${JSON.stringify(eq.id ?? '')},${eq.grade},${eq.on_use ? 1 : 0},${eq.is_locked ? 1 : 0}]`,
                    );
                    // str.push('{name:"');
                    // str.push(eq.color_name);
                    // str.push('",id:"');
                    // str.push(eq.id);
                    // str.push('"');
                    // if (eq.on_use) {
                    //     str.push(',can_use:1');
                    // }
                    // str.push('}');
                } else {
                    str.push('null');
                }
            }
            str.push(']');
        }
        str.push(',max_item_count:');
        str.push(target.max_item_count);
        if (target.check_player() && target === me && target.eq_group !== undefined) {
            str.push(',eq_group:');
            str.push(target.eq_group);
        }
        str.push('}');
        me.send(str.join(''));
    }
}
