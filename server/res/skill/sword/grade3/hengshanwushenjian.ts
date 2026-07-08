import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "衡山五神剑";
    id = "hengshanwushenjian";
    grade = 3;

    desc = "衡山派的绝技，因紫盖、芙蓉、石廪、祝融、天柱五峰而得名";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N手中$w一颤，剑光如<HIM>紫盖</HIM>凝霞，绚烂夺目，直刺$n的$l",
        "$N长剑横空，剑势如<HIM>芙蓉</HIM>出水，清丽脱俗中暗藏杀意，直取$n$l",
        "$N$w一抖，劲力如山，如<HIM>石廪</HIM>耸立，沉稳凝重地压向$n",
        "$N身形一转，剑光暴长，如<HIM>祝融</HIM>之火，烈焰焚天般卷向$n的$l",
        "$N纵身一跃，$w自天而降，如<HIM>天柱</HIM>擎天，势不可挡地劈向$n"
    ];
    parry_actions = [
        "$N$w一圈，剑光化作五峰虚影，以「<HIM>五岳为屏</HIM>」之势将$P的攻势尽数挡下",
        "$N剑势一引，如<HIM>紫盖</HIM>横云，$w轻灵一转便将$P的力道卸开",
        "$N$w微颤，如同<HIM>祝融</HIM>吐焰，一股炽烈剑意迫得$P不得不收招自保"
    ];
    slots = [
        {
            prop: 'wsf_hz',
            value: (lv: number) => 10,
            format: (val: number) => '每次装备为招架时可设置五神赋召唤目标',
        },
        {
            prop: 'wsj_ts',
            value: (lv: number) => 10,
            format: (val: number) => '五神剑出招时，每剑分别附加五神的特殊效果(攻击，破防，命中，不可躲闪，不可招架)',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 1.5),
                str: Math.floor(lv / 6),
                mz: 10 + Math.floor(lv * 1.5),
            },
            parry: {
                zj: 10 + Math.floor(lv * 1.5),
                str: Math.floor(lv / 6),
                fy: 10 + Math.floor(lv * 1.5),
            },
        };
    }

    pfm_set: PerformData = {
        wu: {
            name: "五神剑",
            distime: 13000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcWSJPer(lv);
                var gods = ["<HIM>紫盖</HIM>", "<HIM>芙蓉</HIM>", "<HIM>石廪</HIM>", "<HIR>祝融</HIR>", "<HIM>天柱</HIM>"];
                var msgs = [
                    "$N剑光如紫盖凝霞，绚烂夺目",
                    "$N剑势如芙蓉出水，清丽脱俗",
                    "$N剑劲如山石廪耸立，沉稳凝重",
                    "$N剑光如火祝融焚天，炽烈霸道",
                    "$N剑意如天柱擎天，势不可挡"
                ];
                me.send_room("<HIM>$N剑势忽变，以五峰之势施出衡山绝技「五神剑」，五道剑光先后射向$n！</HIM>", target);
                for (var i = 0; i < 5; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        attack_msg: i < 5 ? msgs[i] + "！" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = calcWSJPer(lv);
                return "瞬间对敌人攻击5次，每次造成" + per + "%伤害。";
            },
        },
        fu: {
            name: "五神赋",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var duration = calcWSFDuration(lv);
                var per = calcWSFPer(lv);
                var gods = ["祝融", "石廪", "芙蓉", "鹤翔", "天柱"];
                var god = gods[int(Math.random() * gods.length)];
                var props = ["gj_per", "mz_per", "fy_per", "ds_per", "bj_per"];
                var prop = props[int(Math.random() * props.length)];
                var propMap: any = {};
                propMap[prop] = per;
                me.send_room(`<HIM>$N长吟一声，引得衡山五峰共鸣，「${god}」之力加诸己身！</HIM>`, target);
                me.add_status({
                    id: "hengshanwushenjian_wsf",
                    name: "五神赋·" + god,
                    desc: god + "之力加身，战斗属性提升",
                    duration: duration,
                    prop: propMap,
                    start_msg: `<HIM>${god}之力灌注全身，$N只觉内力充盈，战意高昂！</HIM>\n`,
                    finish_msg: `<HIY>${god}之力渐渐消退，$N恢复常态。</HIY>\n`,
                }, me);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var duration = calcWSFDuration(lv);
                var per = calcWSFPer(lv);
                return "召唤祝融，石廪，芙蓉，鹤翔，天柱之一，" + toSec(int(duration)) + "秒内随机增加你的某项战斗属性" + per + "%";
            },
        },
    };
}

function calcWSJPer(lv: number): number {
    return 70 + int(lv / 20);
}

function calcWSFDuration(lv: number): number {
    return 10000 + lv * 10;
}

function calcWSFPer(lv: number): number {
    return 20 + int(lv / 100);
}
