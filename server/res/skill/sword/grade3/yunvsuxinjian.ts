import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "玉女素心剑";
    id = "yunvsuxinjian";
    grade = 3;

    desc = "古墓派武学，玉女剑法与全真剑法合璧而成";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一振，剑光如<HIW>素练</HIW>横空，清冷绝俗，正是玉女素心剑法",
        "$N$w斜引，剑势<HIW>轻盈</HIW>如仙，如姑射仙子凌波微步，剑光缥缈中刺向$n$l",
        "$N剑招<HIW>连绵</HIW>不断，玉女剑法施展开来，如<HIW>月宫仙子</HIW>翩翩起舞，令人目眩神驰",
        "$N$w一抖，剑光化作<HIW>点点寒星</HIW>，玉女素心剑法暗合全真剑法之妙，刚柔并济",
        "$N身形旋转，$w划出一道<HIW>优美</HIW>弧线，如天女凌空，剑光洒向$n的$l"
    ];
    slots = [
        {
            prop: 'sjhb_gj',
            value: (lv: number) => 10,
            format: (val: number) => '双剑合璧附加的基础攻击力提高50%',
        },
        {
            prop: 'sjhb_mz',
            value: (lv: number) => 10,
            format: (val: number) => '双剑合璧附加的基础命中提高50%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 1.5),
                mz: 10 + Math.floor(lv * 1.6),
                dex: 10 + Math.floor(lv * 0.166),
            },
        };
    }

    pfm_set: PerformData = {
        he: {
            name: "双剑合璧",
            distime: 60000,
            enable_skill: "sword",
            mp: 100,
            release_time: 1000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var duration = calcSJHBDuration(lv);
                var per = calcSJHBPer(lv);
                me.send_room("<HIW>$N左手玉女剑，右手全真剑，双剑交错，剑光交织如虹，正是玉女素心剑法的最高境界——双剑合璧！</HIW>", target);
                me.add_status({
                    id: "yunvsuxinjian_sjhb",
                    name: "双剑合璧",
                    desc: "剑意交融，攻击命中大幅提升",
                    duration: duration,
                    prop: {
                        gj_per: per,
                        mz_per: per,
                    },
                    start_msg: "<HIW>$N双剑一交，剑光暴涨数倍，$N的剑法威力陡然提升！</HIW>\n",
                    finish_msg: "<HIW>$N双剑分开，剑光渐渐收敛，合璧之势已尽。</HIW>\n",
                }, me);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var duration = calcSJHBDuration(lv);
                var per = calcSJHBPer(lv);
                return "你手中的武器将提供双倍增幅效果，持续" + toSec(int(duration)) + "秒。";
            },
        },
    };
}

function calcSJHBDuration(lv: number): number {
    return 10000 + lv * 2;
}

function calcSJHBPer(lv: number): number {
    return 30 + int(lv / 30);
}
