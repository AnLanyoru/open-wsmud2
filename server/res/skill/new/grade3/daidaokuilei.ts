import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData } from '../../../../core/skill/skill.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '带刀傀儡';
    id = 'daidaokuilei';
    grade = 3;

    desc = '远古机关术打造的带刀傀儡，刀枪不入，不知疲倦，是守卫秘境的恐怖存在';
    can_enables = [];

    query_prop(lv: number): PropMap {
        return {
            gj: lv,
            mz: lv,
            fy: lv,
            zj: lv,
            ds: lv,
        };
    }

    pfm_set: PerformData = {
        hu: {
            name: '护体',
            distime: 50000,
            enable_skill: 'force',
            mp: 510,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room(
                    '<HIR>$N机关响动，周身泛起一层金属光泽，防御力大幅提升！</HIR>',
                    target,
                );
                me.add_status({
                    id: 'daidao_huti',
                    name: '护体',
                    duration: 15000,
                    prop: {
                        fy: Math.floor(lv * 5),
                        diff_sh_per: 20,
                    },
                    finish_msg: '<HIW>$N身上的金属光泽渐渐散去。</HIW>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '守护';
            },
        },
        zhuang: {
            name: '铁壁冲撞',
            distime: 27000,
            enable_skill: 'force',
            mp: 510,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room('<HIR>$N机关轰鸣，整个身躯如一堵铁墙般朝$n猛撞过去！</HIR>', target);
                me.do_attack({ target, gj: Math.floor(me.gj * 2.5), mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '铁壁冲撞';
            },
        },
    };
}
