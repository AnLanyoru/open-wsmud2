import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData } from '../../../../core/skill/skill.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '烛九阴';
    id = 'zhujiuyin';
    grade = 6;

    family = FAMILIES.MONSTER;
    desc = '传说中掌控昼夜更替的远古凶兽，人面蛇身，目开为昼，目闭为夜，其威能深不可测';
    can_enables = ['bite'];

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
        long: {
            name: '烛龙之眼',
            distime: 28500,
            enable_skill: 'bite',
            mp: 2100,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room(
                    '<HIW>$N的双目骤然睁开，爆发出刺目白光，$n眼前一片空白！</HIW>',
                    target,
                );
                if (Math.random() < 0.6) {
                    target.add_status(
                        {
                            id: 'blind',
                            name: '致盲',
                            duration: 5000,
                            downside: true,
                            desc: '被烛龙之眼闪瞎，命中大幅降低',
                            prop: {
                                mz_per: -50,
                            },
                            finish_msg: '<HIW>$n的视力终于恢复。</HIW>',
                        },
                        me,
                    );
                }
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '闪瞎敌人';
            },
        },
        zhao: {
            name: '爪击',
            distime: 28500,
            enable_skill: 'bite',
            mp: 1600,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room('<HIR>$N探出巨爪，以泰山压顶之势朝$n猛拍而下！</HIR>', target);
                me.do_attack({
                    target,
                    gj: Math.floor(me.gj * 2.5),
                    mz: Math.floor(me.mz * 1.5),
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '用利爪攻击敌人';
            },
        },
        hou: {
            name: '怒吼',
            distime: 6650,
            enable_skill: 'bite',
            mp: 44880,
            release_time: 2000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room('<HIR>$N仰天发出一声震天怒吼，声浪如实质般轰向$n！</HIR>', target);
                me.add_status({
                    id: 'nu',
                    name: '蓄力',
                    duration: 3000,
                    prop: {
                        gj_per: 30,
                        mz_per: 30,
                    },
                    finish_msg: '<HIW>$N的怒吼余音渐散。</HIW>',
                });
                for (var i = 0; i < 2; i++) {
                    me.do_attack({
                        target,
                        gj: Math.floor(me.gj * 1.5),
                        mz: Math.floor(me.mz * 1.5),
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '吸气攻击';
            },
        },
    };
}
