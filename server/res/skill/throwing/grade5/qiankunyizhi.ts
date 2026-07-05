import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "乾坤一掷";
    id = "qiankunyizhi";
    grade = 5;

    // 原始描述：消耗大量内力化作暗器攻击敌人，造成高额伤害
    desc = "消耗自身金钱催动真气，金钱越多伤害越高。";
    can_enables = ["throwing"];
    attack_actions = [
        "$N探手入怀，扬手间金光大作，$T裹挟着漫天铜臭之气射向$n的$l",
        "$N冷笑一声，一把金钱撒手飞出，$T破空呼啸罩向$n",
        "$N双指夹出一枚金钱，真气贯注之下金光暴射，直取$n的$l",
        "$N袖袍一抖，金钱如雨点般激射而出，$T带着刺耳破空声袭向$n",
        "$N掌中金钱化作一道金光，$T破空而出，直击$n的$l",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 10 + Math.floor(lv * 5 / 2),
                mz: 8 + lv * 2,
                str: 8 + Math.floor(lv / 4),
                int: 8 + Math.floor(lv / 4),
            },
        };
    }

    pfm_set: PerformData = {
        qian: {
            name: "乾坤一掷",
            distime: 20000,
            enable_skill: "throwing",
            mp: 29,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var baseDmg = Math.floor(me.gj * 1.5);
                me.send_room("<HIY>$N长笑一声，将大把金钱掷出，金光漫天，化作一股沛然真气轰向$n！</HIY>", target);
                me.do_attack({ target, gj: baseDmg, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗内力或自身金钱，化作暗器攻击敌人，造成基础为150%攻击力的伤害。";
            },
        },
    };
}
