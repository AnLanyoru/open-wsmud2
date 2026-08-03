import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';

export default class extends COMMAND {
    command = 'score2';
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, arg: string) {
        let target: CHARACTER | undefined = me;
        if (arg) {
            const look_target = me.find_obj(arg, me.environment);
            if (look_target?.check_character()) {
                target = look_target;
            } else if (me.user_level > 1) {
                target = WORLD.getUser(arg);
            }
            if (!target) {
                return me.notify('你要查看谁的属性。');
            }
            if (target.master != me.id && me.user_level < 4) {
                return me.notify('你要查看谁的属性。');
            }
        }
        let str = ['{"type":"dialog","dialog":"score",'];
        str.push('id:"');
        str.push(target.id);
        str.push('",add_sh:"');
        str.push(String(target.query_prop('add_sh_per')));
        str.push('%",diff_fy:"');
        str.push(format_decayed_percent(target.query_prop('diff_fy_per')));
        str.push('%');
        str.push(format_per2(target.query_prop('diff_fy_per2')));
        str.push('",add_bj:"');
        str.push(String(target.query_prop('add_bjsh_per') + 150));
        str.push('%",diff_sh:"');
        str.push(format_decayed_percent(target.query_prop('diff_sh_per')));
        str.push('%');
        str.push(format_fixed_value(target.query_prop('diff_sh')));
        str.push(format_per2(target.query_prop('diff_sh_per2')));
        str.push('",diff_bj:"');
        str.push(String(target.query_prop('diff_bj')));
        str.push('%",releasetime:"');
        str.push(String(target.query_prop('releasetime') / 1000));
        str.push('秒+');
        str.push(String(target.query_prop('releasetime_per')));
        str.push('%",busy:"');
        str.push(String(target.query_prop('busy') / 1000));
        str.push('秒+');
        str.push(String(target.query_prop('busy_per')));
        str.push('%",diff_busy:"');
        str.push(String(target.query_prop('diff_busy') / 1000));
        str.push('秒+');
        str.push(String(target.query_prop('diff_busy_per')));
        str.push('%",distime:"');
        str.push(String(target.query_prop('distime') / 1000));
        str.push('秒+');
        str.push(String(target.query_prop('distime_per')));
        str.push('%",expend_mp:"');
        str.push(String(target.query_prop('expend_mp')));
        str.push('+');
        str.push(String(target.query_prop('expend_mp_per')));
        str.push('%",dazuo_per:"');
        str.push(String(target.query_prop('dazuo_per')), '%');
        let per = WORLD.DATA.query_temp('dazuo_per', 0) + target.family.query_temp('dazuo_per', 0);
        if (per > 0) {
            str.push('+', String(per), '%');
        }
        str.push('",study_per:"');
        str.push(String(target.query_prop('study_per') + me.int), '%');
        per = WORLD.DATA.query_temp('study_per', 0) + target.family.query_temp('study_per', 0);
        if (per > 0) {
            str.push('+', String(per), '%');
        }
        str.push('",lianxi_per:"');
        str.push(String(target.query_prop('lianxi_per') + me.int * 2), '%');
        per = WORLD.DATA.query_temp('lianxi_per', 0) + target.family.query_temp('lianxi_per', 0);
        if (per > 0) {
            str.push('+', String(per), '%');
        }
        str.push('",downside_per:"');
        str.push(String(target.query_prop('diff_downside_per')));
        str.push('%"}');
        me.send(str.join(''));
    }
}

/** 与 CHARACTER.recount 保持一致：基础百分比在 80% 后衰减。 */
function format_decayed_percent(base: number): string {
    if (base > 80) base = 20 * Math.tanh((base - 80) * 0.04) + 80;
    base = Math.round(base * 100) / 100;
    return String(base);
}

function format_signed_number(value: number): string {
    return (value >= 0 ? '+' : '') + String(value);
}

function format_fixed_value(value: number): string {
    return value === 0 ? '' : format_signed_number(value);
}

/** per2 不参与衰减，作为亮青色括号补充项展示。 */
function format_per2(extra: number): string {
    extra = Math.round(extra * 100) / 100;
    if (extra === 0) return '';
    return '<hic>(' + format_signed_number(extra) + '%)</hic>';
}
