import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "金蛇剑法";
    id = "jinshejianfa";
    grade = 3;

    desc = "金蛇郎君所创的一门剑法";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一抖，剑身如<HIY>金蛇</HIY>般蜿蜒游走，轨迹诡异难测，直取$n$l",
        "$N$w斜指，剑光化作一道<HIY>金芒</HIY>，如毒蛇出洞般迅疾无伦地刺向$n",
        "$N身形扭转，$w翻转如<HIY>灵蛇</HIY>盘绕，剑招刁钻古怪，令人防不胜防",
        "$N$w连刺三剑，剑势如<HIY>金蛇狂舞</HIY>，剑光纵横交错，将$n周身笼罩",
        "$N足尖一点，$w自上而下劈落，剑光化作一条<HIY>金线</HIY>，直取$n$l"
    ];
    slots = [
        {
            prop: 'jskw_mz',
            value: (lv: number) => 10,
            format: (val: number) => '金蛇狂舞的命中增加20%',
        },
        {
            prop: 'jszh_fy',
            value: (lv: number) => 10,
            format: (val: number) => '金蛇追魂无视对方20%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.31),
                bj_per: 6,
                mz: Math.floor(lv * 1.31),
            },
        };
    }

    pfm_set: PerformData = {
        kuang: {
            name: "金蛇狂舞",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcJSKWPer(lv);
                var busy = calcJSKWBusy(lv);
                me.send_room("<HIY>$N手中$W一抖，剑光化作无数条金蛇，纵横交错，漫天飞舞，将$n团团围住！</HIY>", target);
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                });
                if (sh > 0) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        desc: "被金蛇剑法所制，手忙脚乱",
                        duration: busy,
                        downside: true,
                        no_diff: true,
                        start_msg: "<HIY>$n被金蛇剑光所困，只觉眼花缭乱，手忙脚乱！</HIY>\n",
                        finish_msg: "<HIY>$n终于稳住身形，摆脱了金蛇剑法的困扰。</HIY>\n",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = calcJSKWPer(lv);
                var busy = calcJSKWBusy(lv);
                return "对敌人造成" + per + "%攻击力的伤害，命中后使敌人忙乱" + toSec(int(busy)) + "秒";
            },
        },
        zhu: {
            name: "金蛇追魂",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var faint = calcJSZHFaint(lv);
                me.send_room("<HIR>$N剑势陡然一变，$W化作一道金芒如毒蛇吐信，无声无息地直取$n要害！</HIR>", target);
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                });
                if (sh > 0) {
                    target.add_status({
                        id: "faint",
                        is_faint: true,
                        duration: faint,
                        name: "昏迷",
                        downside: true,
                        start_msg: "<HIR>$n被金蛇剑所伤，只觉眼前一黑，便什么也不知道了。</HIR>\n",
                        finish_msg: "<HIY>慢慢的$n又恢复了知觉...</HIY>\n",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var faint = calcJSZHFaint(lv);
                return "对敌人造成伤害，命中后使敌人昏迷" + toSec(int(faint)) + "秒";
            },
        },
    };
}

function calcJSKWPer(lv: number): number {
    return 100 + int(lv / 10);
}

function calcJSKWBusy(lv: number): number {
    return 3000 + lv * 3;
}

function calcJSZHFaint(lv: number): number {
    return 3000 + lv;
}
