import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {LearnCondition} from "../../../types/events.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

export default class extends SKILL {
    name = "神游太虚";
    id = "lingboweibu4";
    grade = 6;
    family = FAMILIES.XIAOYAO;
    is_ultimate = true;
    source_skill = "lingboweibu2";
    desc = "上古逍遥门所传，凌波踏四方，逍遥游天下";
    can_enables = ["dodge"];

    dodge_actions = [
        "只见$n施展神游太虚，身影如鬼似魅，飘忽不定，$N的攻击尽数落空。",
        "$n步履轻盈，宛如谪仙临世，神游太虚之间，$N连$n的衣袂都难以触及。",
        "但见$n施展神游太虚，身法变幻莫测，仿佛虚虚实实，$N的攻击徒劳无功。",
        "却见$n身形一转，已入坐照之境，$N的招式尽数落空。",
        "$n神游物外，已入太虚之境，$N只觉眼前一花，$n早已到了数丈之外。",
        "$n足踏洛水，步演神虚，$N的攻击如泥牛入海，了无痕迹。",
        "$n若往若返，行云流水，神游太虚步法已臻化境，$N难伤$n分毫。",
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
                desc: "无相：躲闪成功后模仿对方的技能绝招",
            },
        };
    }

    /**
     * 无相：躲闪成功后模仿对方的技能绝招。
     * 内置冷却时间内最多触发一次，对攻击者发动模仿反击。
     */
    on_dodge_over(me: CHARACTER, attacker: CHARACTER, par: DoAttackPar): void {
        if (par.is_dodged && !me.query_temp("sk_lingboweibu4_wx", 0)) {
            const lv: number = me.query_skill("lingboweibu4", 0);
            if (!lv) return;

            const attSkill = attacker.attack_skill;
            if (attSkill) {
                const bonusGj: number = lv * 3;
                me.do_attack({
                    target: attacker,
                    gj: me.gj + bonusGj,
                    mz: me.mz,
                    attack_msg:
                        "<him>$N身形一晃，倏入无相之境。$n的「" +
                        attSkill.name +
                        "」方至半途，其精要已被$N尽数窥破——随即还施彼身，反制$n！</him>",
                });
                me.end_attack(attacker);
                me.set_temp("sk_lingboweibu4_wx", 1, 7000);
            }
        }
    }

    pfm_set: PerformData = {
        lingbo: {
            name: "凌波",
            distime: 60000,
            enable_skill: "dodge",
            mp: 1690,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = 15000;

                me.send_room(
                    "<him>$N施展凌波微步，动无常则，若危若安，进止难期，若往若还——$n眼前唯见幻影万千，无可着力！</him>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "凌波",
                    desc: "凌波微步：动无常则，若危若安，进止难期，若往若还。敌人无从锁定你的身形。",
                    duration: duration,
                    prop: {
                        mz: lv * 3,
                        mz_per: 5 + Math.floor(lv / 200),
                    },
                    on_attach: function (p: CHARACTER): void {
                        p.change_prop({ds: 2999999}, true);
                        p.recount();
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.change_prop({ds: 2999999}, false);
                        p.recount();
                    },
                    finish_msg: "$N步法渐收，太虚之境徐徐散去，神光内敛，复归常态。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return "施展凌波微步，在15秒内全力躲闪敌方攻击，提高命中率。";
            },
        },
        huadie: {
            name: "化蝶",
            distime: 60000,
            enable_skill: "dodge",
            mp: 2180,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const threshold = 3 + Math.floor(lv / 500);
                const myHpPer = me.max_hp > 0 ? (me.hp / me.max_hp) * 100 : 0;
                const targetResist = target.query_prop("diff_downside_per");

                if (myHpPer + threshold >= targetResist) {
                    // 颠倒梦境与现实，互换气血内力比例
                    const myHpRatio = me.max_hp > 0 ? me.hp / me.max_hp : 0;
                    const myMpRatio = me.max_mp > 0 ? me.mp / me.max_mp : 0;
                    const targetHpRatio = target.max_hp > 0 ? target.hp / target.max_hp : 0;
                    const targetMpRatio = target.max_mp > 0 ? target.mp / target.max_mp : 0;

                    me.hp = Math.floor(targetHpRatio * me.max_hp);
                    me.mp = Math.floor(targetMpRatio * me.max_mp);
                    target.hp = Math.floor(myHpRatio * target.max_hp);
                    target.mp = Math.floor(myMpRatio * target.max_mp);

                    me.send_room(
                        "<him>$N阖目凝神，神游太虚，恍惚间不知$N之梦为$n欤，$n之梦为$N欤？\n霎时间虚实颠倒，庄周与蝶俱为一体——造化流转，彼我两忘！</him>",
                        target,
                    );
                } else {
                    me.send_room(
                        "<cyn>$N欲颠倒虚实，然$n心如磐石，神不外驰，梦境终难侵蚀现实。</cyn>",
                        target,
                    );
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const threshold = 3 + Math.floor(lv / 500);
                return "如果你的血量比例+" + threshold + "%不小于对方的异常抵抗则颠倒梦境和现实，将自身状态(气血内力比例)和敌方互换，";
            },
        },
    };
}
