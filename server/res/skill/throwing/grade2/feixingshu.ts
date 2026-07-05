import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "飞星术";
    id = "feixingshu";
    grade = 2;
    is_public = true;
    
    // 原始描述：星宿派的暗器手法，以漫天星雨之势撒出暗器，令人防不胜防
    desc = "星宿派的暗器手法";
    can_enables = ["throwing"];
    attack_actions = [
        "$N手腕一抖，$T化作一道流光，直取$n的$l",
        "$N屈指一弹，$T如流星赶月般射向$n的$l",
        "$N反手一扬，数枚$T脱手而出，分袭$n周身要穴",
        "$N身形微转，$T自袖底飞出，无声无息地射向$n的$l",
        "$N双手齐扬，$T如天女散花般洒向$n",
        "$N足尖一点，凌空翻身，$T自指间激射而出",
    ];

    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '星雨最高命中数量：+1',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '星雨最低命中数量：+1',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.4),
                ds: 4 + Math.floor(lv * 1.4),
            },
        };
    }

    pfm_set: PerformData = {
        xingyu: {
            name: "星雨",
            distime: 10000,
            enable_skill: "throwing",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var mzGap = Math.floor((me.mz - target.ds) / 50);
                var base = 3;
                var minCount = base + Math.max(0, mzGap);
                var maxCount = base + 3 + Math.max(0, mzGap);
                var count = Math.min(8, Math.max(2, minCount + Math.floor(Math.random() * (maxCount - minCount + 1))));

                me.send_room("<HIC>$N一声清啸，双手连扬，$T如流星雨般铺天盖地射向$n！</HIC>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器对敌人发动攻击，你的命中和对方的躲闪差距越大命中的暗器数量越多";
            },
        },
    };
}
