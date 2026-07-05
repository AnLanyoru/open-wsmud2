import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "落英神剑";
    id = "luoyingshenjian";
    grade = 3;
    is_public = true;
    
    desc = "桃花岛的剑法";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一振，剑光点点如<HIM>落英缤纷</HIM>，又如<HIM>桃花</HIM>飘落，漫天飞舞中刺向$n的$l",
        "$N身形飘逸，$w斜斜刺出，剑势如<HIM>花瓣</HIM>随风，轻灵中暗藏杀机",
        "$N$w连挽数朵剑花，如<HIM>桃瓣</HIM>纷飞，飘飘扬扬落向$n周身大穴",
        "$N剑走轻灵，$w如<HIM>飞絮</HIM>般飘忽不定，一招「<HIM>江城飞花</HIM>」直取$n$l",
        "$N长袖飘飘，$w挥洒自如，剑光化作<HIM>万点桃红</HIM>，铺天盖地卷向$n"
    ];
    slots = [
        {
            prop: 'lybf_mz',
            value: (lv: number) => 10,
            format: (val: number) => '落英缤纷的命中增加20%',
        },
        {
            prop: 'lybf_gj',
            value: (lv: number) => 10,
            format: (val: number) => '落英缤纷额外附加20%攻击力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.41),
                mz: Math.floor(lv * 1.42),
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        lybf: {
            name: "落英缤纷",
            distime: 10000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var count = calcLybfCount(lv);
                me.send_room("<HIM>$N长啸一声，剑光霍霍，化作漫天桃花瓣，纷纷扬扬，将$n笼罩其中！</HIM>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "<HIM>紧跟着又是一剑，如落花般连绵不绝</HIM>" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var count = calcLybfCount(lv);
                return "快速攻击敌人" + count + "次，等级越高攻击次数越多、冷却时间越短";
            },
        },
    };
}

function calcLybfCount(lv: number): number {
    return 3 + int(lv / 500);
}
