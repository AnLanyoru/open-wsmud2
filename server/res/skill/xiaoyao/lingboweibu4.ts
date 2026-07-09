import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import { SKILL_TYPES } from '../../../core/const.js';
import type { PerformData, EnablePropMap, PERFORM } from '../../../core/skill/skill.js';
import type { LearnCondition } from '../../../types/events.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

export default class extends SKILL {
    name = '神游太虚';
    id = 'lingboweibu4';
    grade = 6;
    family = FAMILIES.XIAOYAO;
    is_ultimate = true;
    desc = '上古逍遥门所传，凌波踏四方，逍遥游天下';
    can_enables = ['dodge'];

    dodge_actions = [
        '只见$n施展神游太虚，身影如鬼似魅，飘忽不定，$N的攻击尽数落空。\n',
        '$n步履轻盈，宛如谪仙临世，神游太虚之间，$N连$n的衣袂都难以触及。\n',
        '但见$n施展神游太虚，身法变幻莫测，仿佛虚虚实实，$N的攻击徒劳无功。\n',
        '却见$n身形一转，已入坐照之境，$N的招式尽数落空。\n',
        '$n神游物外，已入太虚之境，$N只觉眼前一花，$n早已到了数丈之外。\n',
        '$n足踏洛水，步演神虚，$N的攻击如泥牛入海，了无痕迹。\n',
        '$n若往若返，行云流水，神游太虚步法已臻化境，$N难伤$n分毫。\n',
    ];

    learn_condition: LearnCondition = {
        max_mp: 15000,
        skill: {
            dodge: 700,
            lingboweibu2: 500,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                dex: lv * 1,
                ds: lv * 3,
                mz: lv * 3,
                ds_per: 5 + Math.floor(lv / 200),
                mz_per: 5 + Math.floor(lv / 200),
                desc: '无相：躲闪成功后模仿对方的技能绝招',
            },
        };
    }

    /**
     * 无相：躲闪成功后模仿对方的技能绝招。
     * 内置冷却时间内最多触发一次，对攻击者发动模仿反击。
     */
    on_dodge_over(me: CHARACTER, attacker: CHARACTER, par: DoAttackPar): void {
        if (par.is_dodged && !me.query_temp('sk_lingboweibu4_wx', 0)) {
            const lv: number = me.query_skill('lingboweibu4', 0);
            if (!lv) return;

            // 收集攻击者所有可模仿的绝招（所有已装备特殊技能中可复制的绝招）
            const imitable: Array<{ pfm: PERFORM; baseType: string }> = [];
            const seen: Set<string> = new Set();
            for (const [, skillData] of attacker.skills) {
                if (!skillData.enable_skill) continue;
                const sk = SKILL.get(skillData.enable_skill);
                if (!sk || sk.type !== SKILL_TYPES.SKILL || seen.has(sk.id)) continue;
                seen.add(sk.id);
                const baseType: string = skillData.enable_skill;
                for (const key in sk.pfm) {
                    const pfm = sk.pfm[key];
                    if (pfm.no_copy) continue;
                    imitable.push({ pfm, baseType });
                }
            }

            if (!imitable.length) return;

            const pick = imitable[Math.floor(Math.random() * imitable.length)];
            const up: number = Math.min(80 + Math.floor(lv / 40), 100);
            const pfmLevel: number = Math.floor((up * lv) / 100);

            me.send_room(
                '<him>$N身形一晃，倏入无相之境。$n的「' +
                    pick.pfm.name +
                    '」方至半途，其精要已被$N尽数窥破！</him>',
                attacker,
            );

            if (pick.pfm.use) {
                pick.pfm.use(me, attacker, pfmLevel, pick.baseType);
            }
            me.end_attack(attacker);
            me.set_temp('sk_lingboweibu4_wx', 1, 500);
        }
    }

    pfm_set: PerformData = {
        lingbo: {
            name: '凌波',
            distime: 60000,
            enable_skill: 'dodge',
            mp: 1690,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = 15000;

                me.send_room(
                    '<him>$N施展凌波微步，动无常则，若危若安，进止难期，若往若还——$n眼前唯见幻影万千，无可着力！</him>',
                    target,
                );

                me.add_status({
                    id: 'dodge',
                    name: '凌波',
                    desc: '凌波微步：动无常则，若危若安，进止难期，若往若还。敌人无从锁定你的身形。',
                    duration: duration,
                    prop: {
                        mz: lv * 3,
                        mz_per: 5 + Math.floor(lv / 200),
                    },
                    on_attach: function (p: CHARACTER): void {
                        p.change_prop({ ds: 2999999 }, true);
                        p.recount();
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.change_prop({ ds: 2999999 }, false);
                        p.recount();
                    },
                    finish_msg: '$N步法渐收，太虚之境徐徐散去，神光内敛，复归常态。',
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return '施展凌波微步，在15秒内全力躲闪敌方攻击，提高命中率。';
            },
        },
        huadie: {
            name: '化蝶',
            distime: 60000,
            enable_skill: 'dodge',
            mp: 2180,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const threshold = 3 + Math.floor(lv / 500);
                const myHpPer = me.max_hp > 0 ? (me.hp / me.max_hp) * 100 : 0;
                const targetResist = target.query_prop('diff_downside_per');

                if (myHpPer + threshold >= targetResist) {
                    // 颠倒梦境与现实，互换气血内力比例
                    const myHpRatio = me.max_hp > 0 ? me.hp / me.max_hp : 0;
                    const myMpRatio = me.max_mp > 0 ? me.mp / me.max_mp : 0;
                    const targetHpRatio = target.max_hp > 0 ? target.hp / target.max_hp : 0;
                    const targetMpRatio = target.max_mp > 0 ? target.mp / target.max_mp : 0;

                    const meTargetHp = Math.floor(targetHpRatio * me.max_hp);
                    const meTargetMp = Math.floor(targetMpRatio * me.max_mp);
                    const targetTargetHp = Math.floor(myHpRatio * target.max_hp);
                    const targetTargetMp = Math.floor(myMpRatio * target.max_mp);

                    me.add_hp(meTargetHp - me.hp);
                    me.add_mp(meTargetMp - me.mp);
                    target.add_hp(targetTargetHp - target.hp);
                    target.add_mp(targetTargetMp - target.mp);

                    me.send_room(
                        '<him>$N阖目凝神，神游太虚，恍惚间不知$N之梦为$n欤，$n之梦为$N欤？\n霎时间虚实颠倒，$N与$n俱为一体，造化流转，彼我两忘！</him>',
                        target,
                    );
                } else {
                    me.send_room(
                        '<cyn>$N欲颠倒虚实，然$n心如磐石，神不外驰，梦境终难侵蚀现实。</cyn>',
                        target,
                    );
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const threshold = 3 + Math.floor(lv / 500);
                return (
                    '如果你的血量比例+' +
                    threshold +
                    '%不小于对方的异常抵抗则颠倒梦境和现实，将自身状态(气血内力比例)和敌方互换，'
                );
            },
        },
    };
}
