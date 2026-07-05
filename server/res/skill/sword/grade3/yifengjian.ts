import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "移风剑法";
    id = "yifengjian";
    grade = 3;

    desc = "移花宫剑法绝技";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一引，剑势如<HIW>风移影动</HIW>，轻灵飘逸中暗藏凌厉，直取$n$l",
        "$N$w斜指，身形如<HIW>行云流水</HIW>般飘忽不定，剑光一闪已至$n面前",
        "$N长袖飘飘，$w如<HIW>春风吹絮</HIW>般轻柔拂过，却暗蕴着凌厉的剑气",
        "$N身法如风，$w化作<HIW>数道白练</HIW>，在$n周身盘旋缠绕，令人眼花缭乱",
        "$N足不点地，$w凌空一击，剑势如<HIW>风卷残雪</HIW>，转瞬间已刺出数剑"
    ];
    slots = [
        {
            prop: 'yfqq_gjsd',
            value: (lv: number) => 10,
            format: (val: number) => '移风起栖结束后增加自己的攻速10%',
        },
        {
            prop: 'yfqq_rm',
            value: (lv: number) => 10,
            format: (val: number) => '每20点容貌增加一次移风起栖的攻击次数',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.32),
                mz: Math.floor(lv * 1.12),
            },
        };
    }

    pfm_set: PerformData = {
        yi: {
            name: "移风起栖",
            distime: 20000,
            enable_skill: "sword",
            mp: 10,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var count = calcYFQQCount(lv);
                me.send_room("<HIW>$N身形一晃，如风移影动，$W化作一道白虹，在$n周围留下道道残影！</HIW>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz * 2,
                        attack_before: i > 0 ? "<HIW>移风未歇，紧跟着又是一剑</HIW>" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var count = calcYFQQCount(lv);
                return "瞬间内对敌人快速攻击" + count + "次，攻击中命中增加100%";
            },
        },
    };
}

function calcYFQQCount(lv: number): number {
    const c = 4 + int(lv / 125);
    if (c > 7) return 7;
    return c;
}
