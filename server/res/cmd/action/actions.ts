import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';

export default class extends COMMAND {
    command = 'actions';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, type: string) {
        //if (!me.actions_changed) return ;
        var str = ['{type:"actions",actions:['];
        var items = me.items;

        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item) continue;
            if ((item.showAction && !item.is_equipment) || item.is_shortcut) {
                if (str.length > 1) str.push(',');
                str.push('{cmd:"use ');
                str.push(item.id);
                str.push('",name:"');
                str.push(item.name);
                str.push('"');
                if (item.distime) {
                    str.push(',distime:');
                    str.push(String(item.distime));
                }
                str.push('}');
            }
        }
        for (var i = 0; i < me.equipment.length; i++) {
            const eq = me.equipment[i];
            if (eq && eq.on_use) {
                if (str.length > 1) str.push(',');
                str.push('{cmd:"use ');
                str.push(eq.id);
                str.push('",name:"');
                str.push(eq.name);
                str.push('"');
                if (eq.distime) {
                    str.push(',distime:');
                    str.push(String(eq.distime));
                }
                str.push('}');
            }
        }
        str.push(']}');
        me.send(str.join(''));
    }
}
