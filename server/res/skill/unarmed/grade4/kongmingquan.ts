import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';
import type { LearnCondition } from '../../../../types/events.js';

/** 完成度 80 */
export default class extends SKILL {
    name = '空明拳';
    id = 'kongmingquan';
    grade = 4;

    // 原始描述：周伯通在桃花岛自创的一套拳法，以空明为特点，拳法空灵飘忽，似有似无，令人防不胜防
    desc = '周伯通在桃花岛自创的一套拳法';
    can_enables = ['unarmed'];
    attack_actions = [
        '$N左掌虚晃，右拳自空明处击出，直取$n的$l',
        '$N双拳似闭非闭、似开非开，虚实难辨地罩向$n',
        '$N一招「空碗盛雪」，拳到中途忽然变向，击向$n的$l',
        '$N拳法空灵飘忽，身影如幻如真，一拳从绝无可能的角度打向$n',
        '$N双拳齐出，一虚一实，「空谷回音」般轰向$n',
        '$N身形滴溜一转，拳法大开大合却又空若无物，$n完全无法捉摸',
    ];
    learn_condition: LearnCondition = {
        int1: 40,
    };

    slots = [
        {
            prop: 'kmq_bo_cd',
            value: (lv: number) => 1,
            format: (val: number) => '左右互搏使用的绝招会继承冷却时间',
        },
        {
            prop: 'kmq_bo_lv',
            value: (lv: number) => 1,
            format: (val: number) => '左右互搏使用的绝招会继承技能等级',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 1.7),
                str: 1 + Math.floor(lv / 6),
                mz: 20 + Math.floor(lv * 1.7),
            },
        };
    }

    pfm_set: PerformData = {
        luan: {
            name: '乱拳',
            distime: 20000,
            enable_skill: 'unarmed',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                let allHit = true;
                const diffFyPer = Math.min(80, 10 + int(lv / 50));

                const dirMsgs = [
                    '<hir>$N跳起来从上往下抡了一拳</hir>',
                    '<hir>$N蹲下去由下往上撩了一拳</hir>',
                    '<hir>$N左面劈头盖脸一拳抡向$n</hir>',
                    '<hir>$N右面又是一拳砸了过来</hir>',
                    '<hir>$N正面直直地一拳捣向$n面门</hir>',
                    '<hir>$N绕到背后偷了一拳</hir>',
                ];
                const finalMsg =
                    '<HIR>$N五路拳势倏然一收，化作至简至空的一拳「<HIW>空碗盛雪</HIW>」！拳到中途劲力陡增，$n避无可避！</HIR>';

                me.send_room(
                    '<HIC>$N哈哈大笑，双拳乱舞，拳影漫天，如狂风暴雨般罩向$n！</HIC>',
                    target,
                );
                for (let i = 0; i < 5; i++) {
                    const par: DoAttackPar = {
                        target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_msg: dirMsgs[i],
                    };
                    me.do_attack(par);
                    if (par.is_dodged || par.is_parried) {
                        allHit = false;
                    }
                }
                // 最后一拳
                const lastPar: DoAttackPar = {
                    target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: finalMsg,
                };
                if (allHit) {
                    lastPar.diff_fy = diffFyPer;
                }
                me.do_attack(lastPar);
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const diffFyPer = Math.min(80, 10 + int(lv / 50));
                return '瞬间对敌人攻击6拳，如果全部命中，最后一拳无视对方' + diffFyPer + '%防御';
            },
        },
        bo: {
            name: '左右互搏',
            distime: 30000,
            enable_skill: 'unarmed',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                // used_pfm 存的是 pfm.id（格式："skillId/pfmKey"），在 use_pfm 中由引擎自动设置
                const lastPfmId = me.query_temp('used_pfm', '') as string;
                if (!lastPfmId) return false;

                const boPer = Math.min(100, 50 + int(lv / 40));
                const boCd = me.query_prop('kmq_bo_cd');
                const slashIdx = lastPfmId.indexOf('/');
                if (slashIdx <= 0) return false;

                const skillId = lastPfmId.slice(0, slashIdx);
                const pfmKey = lastPfmId.slice(slashIdx + 1);
                const otherSkill = SKILL.get(skillId);
                if (!otherSkill) return false;
                const otherPerform = otherSkill.pfm[pfmKey];
                if (!otherPerform?.use || otherPerform.no_copy) return false;

                const effectLv = int((lv * boPer) / 100);

                // 复用之前使用的绝招
                otherPerform.use(me, target, effectLv, otherPerform.enable_skill || 'unarmed');

                // 继承冷却时间
                if (boCd && otherPerform.pid) {
                    otherPerform.set_distime(
                        me,
                        otherPerform.enable_skill || 'unarmed',
                        otherPerform.query_distime(me, effectLv),
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const boPer = Math.min(100, 50 + int(lv / 40));
                return (
                    '使用左右互搏之术，再次使用你之前使用的绝招攻击敌人，效果是自身等级的' +
                    boPer +
                    '%。'
                );
            },
        },
    };
}
