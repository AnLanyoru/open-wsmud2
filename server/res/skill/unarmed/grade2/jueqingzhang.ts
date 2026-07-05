import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "绝情掌";
    id = "jueqingzhang";
    grade = 2;

    // 原始描述：移花宫拳脚功夫，掌势飘忽若云，看似柔情万种，实则暗藏杀机，一招一式中尽显绝情之意。
    desc = "移花宫拳脚功夫";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N身影飘忽，玉掌轻翻，一招「<HIC>落英缤纷</HIC>」挟着凌厉掌风拍向$n的$l",
        "$N欺身而近，双掌连环拍出，正是移花宫的「<HIC>花开花落</HIC>」，掌影重重笼罩$n周身",
        "$N纤腰微摆，玉掌自袖底穿出，一招「<HIC>寒梅吐蕊</HIC>」疾点$n的$l",
        "$N掌势忽转，左掌虚晃，右掌已如鬼魅般印向$n的$l，端的是「<HIC>镜花水月</HIC>」",
        "$N长袖飘飘，双掌翻飞如蝶，一招「<HIC>花间照影</HIC>」似虚似实攻向$n",
        "$N玉掌轻挥间暗藏数道后劲，正是绝情掌的「<HIC>柔情似水</HIC>」，$n若不慎格挡必受暗劲所伤",
        "$N掌势骤变，由柔转刚，五指如钩，一招「<HIC>绝情断义</HIC>」直取$n的$l",
        "$N双掌交错，劲气四溢，一式「<HIC>流水落花</HIC>」飘然攻出，看似无力却暗藏杀机",
        "$N莲步轻移，玉掌自下而上撩出，如「<HIC>枯木逢春</HIC>」般诡异难测",
        "$N玉掌翻飞，幻起漫天掌影，似真似幻，虚实难辨，正是「<HIC>烟花易冷</HIC>」的精妙所在"
    ];
    slots = [
        {
            prop: 'jq_mh_rr',
            value: (lv: number) => 10,
            format: (val: number) => '迷魂时自身容貌增加2',
        },
        {
            prop: 'jq_mh_time',
            value: (lv: number) => 10,
            format: (val: number) => '迷魂忙乱时间增加1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.22),
                mz: Math.floor(lv * 0.82),
            },
        };
    }

    pfm_set: PerformData = {
        mi:
            {
                name: "迷魂",
                distime: 25000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var time = mihunTime(lv);
                    var extra = me.query_prop('jq_mh_time');
                    if (extra) time += extra * 1000;
                    me.send_room("<HIC>$N眼波流转，玉掌轻扬，袖中飞出一缕若有若无的香风，$n只觉心神一荡</HIC>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<hic>$N玉掌如花，五指轻拂，一招「迷魂」已至$n面门，$p只觉眼前人影晃动，心神恍惚</hic>",
                        miss_msg: "<cyn>$n猛地咬破舌尖，剧痛之下神志一清，千钧一发之际向后跃开</cyn>",
                        no_weapon: true
                    });
                    if (sh) {
                        target.add_status({
                            id: "busy",
                            name: "忙乱",
                            duration: time,
                            downside: true,
                            is_busy: true,
                            desc: "你被迷魂掌所惑，心神恍惚，无法行动"
                        }, me);
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var time = mihunTime(lv);
                    var extra = me.query_prop('jq_mh_time');
                    if (extra) time += extra * 1000;
                    return "迷惑敌人，使敌人在" + toSec(time) + "秒内处于忙乱状态";
                },
            },
    };
}

function mihunTime(lv: number): number {
    var time = lv * 11 + 0;
    if (time > 11000) time = 11000;
    return time;
}
