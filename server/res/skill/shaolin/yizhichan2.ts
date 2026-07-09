import { SKILL, PERFORM } from '../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { SkillSlotDef } from '../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '一指禅';
    id = 'yizhichan2';
    source_skill = 'yizhichan';
    grade = 4;
    family = FAMILIES.SHAOLIN;
    desc = '少林寺七十二绝技之一指禅';
    can_enables = ['unarmed'];
    attack_actions = SKILL.get('unarmed')?.attack_actions || [];
    slots: SkillSlotDef[] = [
        {
            prop: 'yizhi_mz',
            value: (lv: number) => 1000,
            format: (val: number) => '惊魔一指的命中：+' + val,
        },
        {
            prop: 'yizhi_gj',
            value: (lv: number) => 100,
            format: (val: number) => '惊魔一指附加的攻击力增加' + val + '%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + lv * 2,
                str: 1 + Math.floor(lv * 0.25),
                mz: 3 + Math.floor(lv * 1.6),
                mz_per: 10,
            },
        };
    }

    pfm_set: PerformData = {
        jing: {
            name: '惊魔一指',
            distime: 30000,
            enable_skill: 'unarmed',
            weapon_type: WEAPON_TYPE.UNARMED,
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const bonusMZ: number = me.query_prop('yizhi_mz');
                const bonusGJPer: number = me.query_prop('yizhi_gj');
                const time: number = lv * 5 + 2000 > 7000 ? 7000 : lv * 5 + 2000;
                const sh: number = me.do_attack({
                    target: target,
                    gj: me.gj + int((me.gj * bonusGJPer) / 100),
                    mz: me.mz + bonusMZ,
                    no_weapon: true,
                    no_parry: true,
                    attack_msg:
                        '<hiy>$N大喝一声，中指按出，一股凌厉无匹的无形剑气破空而出，直贯$n而去！</hiy>',
                    damage_msg:
                        '<hir>只见$p躲闪不及，被$P这惊天一指正戳在胸前，不由得连声惨叫，胸口鲜血直流！</hir>',
                    miss_msg: '<cyn>可是$p身法颇为灵活，轻轻一退将这道剑气化解于无形。</cyn>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'faint',
                            is_faint: true,
                            duration: time,
                            name: '昏迷',
                            downside: true,
                            finish_msg: '<hiy>慢慢的$N又恢复了知觉……</hiy>\n',
                            start_msg: '<hir>$N只觉得眼前一黑，接着什么都不知道了……</hir>\n',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const time: number = lv * 5 + 2000 > 7000 ? 7000 : lv * 5 + 2000;
                return (
                    '一指禅之惊魔一指，运用无形剑气攻击敌人，使人无法招架，命中后昏迷' +
                    toSec(time) +
                    '秒。'
                );
            },
        },
    };
}
