import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import { WEAPON_TYPE } from '../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

export default class extends SKILL {
    name = '小无相功';
    id = 'xiaowuxianggong';
    family = FAMILIES.XIAOYAO;
    grade = 4;
    attack_actions = [
        '$N挥拳攻击$n的$l',
        '$N往$n的$l一抓',
        '$N往$n的$l狠狠地踢了一脚',
        '$N提起拳头往$n的$l捶去',
        '$N对准$n的$l用力挥出一拳',
    ];
    attack_actions2 = ['$N用$W往$n的$l刺去', '$N用$W往$n的$l砍去', '$N挥动$W,斩向$n的$l'];
    desc = '逍遥派的一门奇特武功，其主要特点是不着形相，无迹可寻，可以模仿别人的绝学';
    can_enables = ['unarmed', 'sword', 'blade'];
    learn_condition = {
        max_mp: 1000,
        skill: {
            unarmed: 300,
            parry: 300,
        },
    };
    pfm_set: PerformData = {
        duo: {
            name: '无相',
            distime: 20000,
            mp: 40,
            no_copy: true,
            allow_busy: true,
            query_name(me: CHARACTER, type: string) {
                if (!type) return this.name!;
                return '无相' + ALLOW_TYPES.get(type);
            },
            use(me: CHARACTER, target: CHARACTER, lv: number, sk) {
                var prev = target.query_temp('used_pfm', String(''));
                if (!prev)
                    return me.notify_fail(
                        '<cyn>' + target.name + '最近没有使用绝招，你无法模仿。</cyn>',
                    );
                var str = prev.split('/');
                var sp_skill = SKILL.get(str[0]);
                if (!sp_skill) {
                    return me.notify_fail('没有这个技能。');
                }
                if (sp_skill.grade > 4) return me.notify_fail('对方使用的武功太高深，你无法模仿。');
                var pfm = sp_skill.get_pfm(str[1]);
                if (!pfm) {
                    return me.notify_fail(sp_skill.name + '没有这个绝招。');
                }
                if (pfm.no_copy) return me.notify_fail('这个绝招不能模仿。');
                if (me.is_busy && !pfm.allow_busy)
                    return me.notify_fail('你现在正手忙脚乱，无法模仿别人的技能。');
                var isEnable = false;
                if (pfm.enable_skill) {
                    if (sk === pfm.enable_skill) {
                        isEnable = true;
                    } else {
                        return me.notify_fail(
                            this.query_name(me, sk) + '不能模仿' + pfm.name + '。',
                        );
                    }
                }
                var up = 80 + parseInt(lv / 40);
                if (up > 100) up = 100;
                me.use_pfm(target, pfm, parseInt((up * lv) / 100), sk);

                if (
                    sp_skill.grade <= 4 &&
                    isEnable &&
                    !me.is_in('yz/leitai/leitai') &&
                    sp_skill.family !== FAMILIES.MONSTER
                ) {
                    me.notify(
                        '\n<hic>你学会了绝招【' + pfm.name + '】，可以使用【无我】释放。<hic>',
                    );
                    me.remove_temp('copy_pfm');
                    me.set_temp('copy_pfm_' + pfm.enable_skill, prev);
                }
            },
            query_desc: function (me: CHARACTER, lv: number) {
                lv = 80 + parseInt(lv / 40);
                if (lv > 100) lv = 100;
                return (
                    '使用前一个攻击你的绝招攻击敌人，效果是你小无相功等级的' +
                    lv +
                    '%，如果你的小无相品阶不低于对方技能的品阶并且装备的基础武功相同，你将学会这个绝招'
                );
            },
        },
        wuwo: {
            name: '无我',
            distime: 20000,
            mp: 40,
            allow_busy: true,
            no_copy: true,
            query_releasetime(me: CHARACTER, lv: number): number {
                return me.query_temp('wuwo_gcd', this.release_time!);
            },
            query_distime(me: CHARACTER, lv: number, isref?: boolean) {
                let dis = me.query_temp('wuwo_cd', this.distime!);
                if (isref) dis *= SKILL.REF_CD;
                return dis;
            },
            query_name(me: CHARACTER, type: string): string {
                if (!type) return this.name!;
                return '无我' + ALLOW_TYPES.get(type);
            },
            use(me: CHARACTER, target: CHARACTER, lv: number, sk: string) {
                var prev = me.query_temp('copy_pfm_' + sk, String(''));
                var baseSkill = SKILL.get(sk);
                if (!baseSkill) return false;
                if (!prev) {
                    return me.notify_fail(
                        '<cyn>你最近没有模仿并学会任何绝招，无法使用装备为【' +
                            baseSkill.name +
                            '】的无我。</cyn>',
                    );
                }
                var str = prev.split('/');
                var sp_skill = SKILL.get(str[0]);
                if (!sp_skill) {
                    return me.notify_fail('没有这个技能。');
                }
                if (sp_skill.family === FAMILIES.MONSTER)
                    return me.notify_fail('怪物专属技能无法模仿。');
                if (sp_skill.grade > 4) return me.notify_fail('对方使用的武功太高深，你无法模仿。');
                var pfm = sp_skill.get_pfm(str[1]);
                if (!pfm) {
                    return me.notify_fail(sp_skill.name + '没有这个绝招。');
                }
                if (pfm.no_copy) return me.notify_fail('这个绝招不能模仿。');

                if (me.is_busy && !pfm.allow_busy)
                    return me.notify_fail('你现在正手忙脚乱，无法模仿别人的技能。');
                if (sk == 'sword' && me.query_weapon_type() != WEAPON_TYPE.SWORD) {
                    return me.notify('你使用的武器不对。');
                } else if (sk == 'blade' && me.query_weapon_type() != WEAPON_TYPE.BLADE) {
                    return me.notify('你使用的武器不对。');
                }
                if (pfm.enable_skill == sk && !me.skills.get('xiaowuxianggong')?.[sk]) {
                    return me.notify_fail(
                        '<cyn>你的小无相功需要装备为' +
                            baseSkill.name +
                            '才可以使用【' +
                            pfm.name +
                            '】。</cyn>',
                    );
                }
                var up = 70 + parseInt(lv / 100);
                if (up > 100) up = 100;
                me.use_pfm(target, pfm, parseInt((up * lv) / 100), sk);
                me.set_temp('wuwo_cd', pfm.query_distime(me, lv));
                me.set_temp('wuwo_gcd', pfm.query_releasetime(me, lv));
            },
            query_desc: function (me: CHARACTER, lv: number) {
                lv = 70 + parseInt(lv / 100);
                if (lv > 100) lv = 100;
                return (
                    '使用你无相模仿并学会的绝招，效果是你小无相功等级的' +
                    lv +
                    '%，绝招需要和你的小无相装备的基本技能一样'
                );
            },
        },
    };

    query_attack_action(me: CHARACTER, target: CHARACTER) {
        let type = me.query_weapon_type();
        if (type === WEAPON_TYPE.NONE) return this.attack_actions.random();
        return this.attack_actions2.random();
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: parseInt(lv * 1.4) + 20,
                mz: parseInt(lv * 1.2) + 20,
            },
            sword: {
                gj: parseInt(lv * 1.4) + 20,
                mz: parseInt(lv * 1.2) + 20,
            },
            blade: {
                gj: parseInt(lv * 1.4) + 20,
                mz: parseInt(lv * 1.2) + 20,
            },
        };
    }
}

const ALLOW_TYPES: Map<string, string> = new Map([
    ['blade', '(刀法)'],
    ['sword', '(剑法)'],
    ['unarmed', '(拳脚)'],
]);
