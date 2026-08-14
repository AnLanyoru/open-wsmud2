import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';

export default class extends COMMAND {
    command = 'spfm';
    allow_die = true;
    allow_faint = true;
    allow_state = true;
    allow_busy = true;
    regex = /(\S+)(?:\s+(\S+))?/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, arg1: string, arg2: string) {
        if (!arg1) return;
        let func = this['set_' + arg1];
        if (func) {
            func.call(this, me, arg2);
        }
    }

    set_qkyz(me, arg) {
        if (!arg || !(arg > 0)) {
            me.remove_temp('qkyz_m');
            return me.send('<cyn>你将乾坤一掷更改为使用内力，不消耗铜板。</cyn>');
        }
        if (arg > 100000) arg = 100000;
        me.set_temp('qkyz_m', arg);

        me.send('<cyn>你的乾坤一掷每次使用将消耗' + arg + '个铜板。</cyn>');
    }

    set_hswj(me, arg) {
        const gods = ['祝融', '芙蓉', '石廪', '天柱', '紫盖'];
        const godProps: Record<string, string> = {
            祝融: '攻击',
            芙蓉: '命中',
            石廪: '防御',
            天柱: '招架',
            紫盖: '闪避',
        };
        if (!arg || !gods.includes(arg)) {
            me.remove_temp('hswj_wsf_god');
            return me.send(
                '<cyn>可选神峰：' +
                    gods.map(god => god + '（' + godProps[god] + '）').join('、') +
                    '；不指定则随机。</cyn>',
            );
        }
        const skill = me.skills?.get('hengshanwushenjian');
        if (!skill?.addin?.includes(500)) return me.send('<cyn>衡山五神剑进阶五神赋词条后才能设置。</cyn>');
        if (skill.enable_skill !== 'parry' && !(skill as any).parry) {
            return me.send('<cyn>请先将衡山五神剑装备为招架。</cyn>');
        }
        me.set_temp('hswj_wsf_god', arg);
        me.send('<cyn>你的五神赋将召唤' + arg + '（' + godProps[arg] + '）。</cyn>');
    }
}
