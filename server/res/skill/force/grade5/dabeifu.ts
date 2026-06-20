import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "天地交征阴阳大悲赋";
    id = "dabeifu";
    grade = 5;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                con: 5 + lv * 2,
                diff_bj: 8,
                diff_downside_per: 15,
                expend_mp_per: 15,
                limit_mp: lv * 290,
                desc: "唯一：将你内力的100%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "搜魂手",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 搜魂手
                // 攻击敌人降低对方战斗属性，吸收气血
                me.send_room("$N使出「搜魂手」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "攻击敌人降低对方战斗属性，吸收气血";
            },
        },
        pfm_1: {
            name: "移穴法",
            distime: 60000,
            enable_skill: "force",
            mp: 120,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 移穴法
                // 移穴换位，你不会被控制
                me.send_room("$N使出「移穴法」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "移穴换位，你不会被控制";
            },
        },
    };
}
