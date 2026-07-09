import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData } from '../../../../core/skill/skill.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '神殿守卫';
    id = 'shouwei';
    grade = 6;

    desc = '古老神殿的守卫者，身披神甲，手持巨刃，如不动明王般守护着神殿的每一寸土地';
    can_enables = [];

    query_prop(lv: number): PropMap {
        return {
            gj: lv * 3,
            mz: lv * 3,
            fy: lv * 3,
            zj: lv * 3,
            ds: lv * 3,
        };
    }

    pfm_set: PerformData = {
        hu: {
            name: '护体',
            distime: 40000,
            enable_skill: 'force',
            mp: 510,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room('<HIW>$N周身泛起一层神圣金光，防御力急剧攀升！</HIW>', target);
                me.add_status({
                    id: 'shouwei_huti',
                    name: '护体',
                    duration: 20000,
                    prop: {
                        fy: Math.floor(lv * 8),
                        diff_sh_per: 30,
                    },
                    finish_msg: '<HIW>$N身上的神圣金光渐渐消散。</HIW>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '守护';
            },
        },
        zhuan: {
            name: '旋转',
            distime: 27000,
            enable_skill: 'force',
            mp: 510,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room('<HIR>$N将手中巨刃抡圆，如旋风般朝$n狂斩而去！</HIR>', target);
                for (var i = 0; i < 3; i++) {
                    me.do_attack({ target, gj: Math.floor(me.gj * 1.5), mz: me.mz });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '旋转攻击';
            },
        },
    };
}
