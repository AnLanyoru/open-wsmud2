import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "乾坤大挪移";
    id = "qiankundanuoyi";
    grade = 5;
    
    desc = "明教的镇教之宝，运劲用力的一项顶级法门。";
    can_enables = ["parry"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: 2700,
                fy: 1600,
                hp_per: 5,
                fy_per: 5,
                desc: "当你招架会积蓄力量，最高12层，每层增加1000防御，招架成功积蓄两层，失败积蓄一层",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "大挪移",
            distime: 9840,
            enable_skill: "parry",
            mp: 1020,
            release_time: 3600,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 大挪移
                // 使用大挪移一次反击敌人，伤害为乾坤的层数/2*你的攻击力
                me.send_room("$N使出「大挪移」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用大挪移一次反击敌人，伤害为乾坤的层数/2*你的攻击力";
            },
        },
        pfm_1: {
            name: "倒转乾坤",
            distime: 22140,
            enable_skill: "parry",
            mp: 2856,
            release_time: 3600,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 倒转乾坤
                // 使用你积蓄的力量恢复自身，每层乾坤恢复你4%的气血，并将你的一个负面状态转移给敌人，忙乱可用
                me.send_room("$N使出「倒转乾坤」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用你积蓄的力量恢复自身，每层乾坤恢复你4%的气血，并将你的一个负面状态转移给敌人，忙乱可用";
            },
        },
    };
}
