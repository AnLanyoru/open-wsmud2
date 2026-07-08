import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import type {LearnCondition} from "../../../../types/events.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "覆雨剑法";
    id = "fuyujianfa";
    grade = 6;

    // 原始描述：浪翻云依据洞庭湖水性而自创的剑法，如行云流水，惊涛骇浪，剑势如绵绵春雨，细密无间。
    desc = "浪翻云依据洞庭湖水性而自创的剑法，如行云流水，惊涛骇浪";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N$w轻抖，剑势如细雨绵绵，一招「<HIC>雨丝风片</HIC>」，无数剑丝缠向$n的$l",
        "$N剑势忽急，如暴雨倾盆，正是「<HIB>大雨滂沱</HIB>」，剑光如雨点般洒向$n",
        "$N$w斜指，剑势如长江大河，一招「<HIW>惊涛拍岸</HIW>」，剑气如浪潮般层层叠叠涌向$n",
        "$N$w横挥，化作万点雨滴，正是「<HIG>烟雨朦胧</HIG>」，剑光迷迷蒙蒙罩向$n",
        "$N身形随剑走，一招「<HIC>行云流水</HIC>」，剑势连绵不绝，如江河奔涌向$n的$l",
        "$N$w忽然一转，掀起滔天巨浪，正是「<HIB>翻江倒海</HIB>」，剑气如海啸席卷$n",
        "$N$w疾点，漫天剑雨聚为一线，一招「<HIW>雨过天晴</HIW>」，一道惊天剑气直贯$n",
        "$N长吟一声，剑势如洞庭波涛，正是「<HIC>洞庭秋月</HIC>」，剑光如水中月影笼罩$n"
    ];
    parry_actions = [
        "$n$w轻挥，剑势化作一帘雨幕，将$P的攻势尽数挡在门外\n",
        "$n$w疾转，如水涡般将$P的兵器卷入其中，四两拨千斤\n",
        "$n剑势连绵如雨，以柔克刚，$P只觉剑招如陷入泥沼之中\n",
        "$n$w一圈一引，如洞庭湖面泛起涟漪，将$P的劲力层层化去\n"
    ];
    learn_condition: LearnCondition = {
        max_mp: 60000,
        skill: {
            sword: 500
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 3,
                mz: 20 + lv * 3,
                dex: 2 + Math.floor(lv / 2),
                mz_per: 8,
                gjsd_per: 10,
            },
            parry: {
                zj: 10 + Math.floor(lv * 2.3),
                diff_sh_per: 4,
                zj_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        yu: {
            name: "剑雨",
            distime: 28500,
            enable_skill: "sword",
            mp: 1900,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var count = calcJianyuCount(lv);
                me.send_room("<hib>$N$w一引，剑光化作漫天细雨，绵绵密密，无孔不入地向$n笼罩而去！</hib>\n", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        attack_msg: "<hib>剑雨如丝，绵绵不绝地洒向$n</hib>",
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var count = calcJianyuCount(lv);
                return "化剑为雨，攻击变为" + count + "次，增加穿透防御的几率";
            },
        },
        gang: {
            name: "剑罡",
            distime: 19000,
            enable_skill: "sword",
            mp: 1140,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var time = calcJiangangTime(lv);
                me.send_room("<hiw>$N深吸一口气，$w骤然爆发出万丈剑罡，剑气如实质般凝结，天地为之色变！</hiw>\n", target);
                me.add_status({
                    id: "weapon",
                    name: "剑罡",
                    duration: time,
                    prop: {
                        mz_per: 50,
                        add_sh_per: 50,
                        diff_fy_per: 100,
                    },
                    start_msg: "<hiw>$N周身剑罡爆射，光芒万丈，剑气纵横！</hiw>",
                    desc: "覆雨剑法之剑罡，命中和伤害大幅提升，必定穿透防御",
                });
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var time = calcJiangangTime(lv);
                return "极致的剑法，大幅度增加命中和伤害，必定触发穿透，持续" + toSec(int(time)) + "秒。";
            },
        },
    };
}

function calcJianyuCount(lv: number): number {
    const c = 5 + Math.floor(lv / 150);
    if (c > 12) return 12;
    return c;
}

function calcJiangangTime(lv: number): number {
    const t = 5000 + Math.floor(lv * 5);
    if (t > 12000) return 12000;
    return t;
}
