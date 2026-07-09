import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData } from '../../../../core/skill/skill.js';
import { FAMILIES } from '../../../../core/skill/family.js';
import { WEAPON_TYPE } from '../../../../core/const.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends SKILL {
    name = '黑龙';
    id = 'heilong';
    grade = 5;
    family = FAMILIES.MONSTER;
    desc = '黑龙所修的绝世神功';
    attack_actions = [
        '$N张开血盆大口，朝$n的$l猛咬过去',
        '$N发出一声怒吼，扑向$n的$l',
        '$N甩动巨大的尾巴，扫向$n的$l',
        '$N眼中闪过一道寒光，猛地扑向$n的$l',
    ];
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
        tushui: {
            name: '黑龙吐水',
            distime: 30000,
            enable_skill: 'bite',
            weapon_type: WEAPON_TYPE.UNARMED,
            release_time: 0,
            mp: 30,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: '<hib>$N张开巨口，一股黑色的水柱喷射而出，直冲$n！</hib>',
                    damage_msg: '<hib>$p被黑色的水柱击中，浑身一颤，寒气侵入骨髓！</hib>',
                    miss_msg: '<cyn>$p见势不妙，急忙闪身躲避，堪堪避开了$N的吐水攻击。</cyn>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'frozen',
                            is_faint: true,
                            duration: 10000,
                            name: '冻结',
                            desc: '你被冰封，无法行动',
                            downside: true,
                            start_msg: '<hib>$N被寒气包裹，瞬间冻结成冰！</hib>\n',
                            finish_msg: '<hib>$N身上的冰块逐渐碎裂，终于恢复了自由。</hib>\n',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '黑龙吐水，造成一次伤害并使敌人冻结10秒。';
            },
        },
        siyao: {
            name: '撕咬',
            distime: 7000,
            enable_skill: 'bite',
            weapon_type: WEAPON_TYPE.UNARMED,
            release_time: 3000,
            mp: 25,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var gj = (me.gj * (lv / 10 + 100)) / 100;
                me.send_room('<red>$N目露凶光，猛的朝$n扑了过去</red>', target);
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: me.mz,
                    attack_msg: '<hir>$N张开血盆大口，狠狠地朝$n的$l撕咬过去！</hir>',
                    damage_msg: '<hir>$p被$N锋利的牙齿撕下一大块肉，鲜血四溅！</hir>',
                    miss_msg: '<cyn>$p急忙闪避，躲开了$N的撕咬。</cyn>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '向前撕咬，造成' + (lv / 100 + 100) + '%攻击的伤害。';
            },
        },
    };
}
