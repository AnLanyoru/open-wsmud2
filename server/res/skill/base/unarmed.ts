import { PERFORM, SKILL } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import type { PropMap } from '../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

export default class extends SKILL {
    id = 'unarmed';
    name = '基本拳脚';
    type = SKILL_TYPES.BASE;
    grade = 0;
    desc = '拳脚类武功的基础功法，坚持锻炼必成大器。每10级会增加1点后天臂力';
    attack_actions = [
        '$N挥拳攻击$n的$l',
        '$N往$n的$l一抓',
        '$N往$n的$l狠狠地踢了一脚',
        '$N提起拳头往$n的$l捶去',
        '$N对准$n的$l用力挥出一拳',
    ];

    query_prop(lv: number): PropMap {
        return { str: Math.floor(lv / 10) };
    }

    constructor() {
        super();
        this.set_default(this.id);
        this.set_pfm_data('zhong', {
            name: '重击',
            distime: 5000,
            mp: 5,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var msg_to_b = '<hig>$N看准时机，双拳蓄力对准$n的$l用力砸去</hig>';
                var gj = 10 + lv;
                me.do_attack({
                    target: target,
                    gj: me.gj + gj,
                    mz: me.mz,
                    attack_msg: msg_to_b,
                    no_weapon: true,
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var gj = 10 + lv;
                return '强力的一击，对敌人造成基本攻击附加' + gj + '的伤害。';
            },
        });
    }
}
