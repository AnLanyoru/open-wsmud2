import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "慈航剑典";
    id = "cihangjiandian";
    grade = 6;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 3.1),
                mz: Math.floor(lv * 3.1),
                mz_per: 10,
                add_sh_per: 10,
                diff_fy_per: 10,
                limit_mp: lv * 900,
                desc: "灵动当你开始战斗的5秒内无法被控制; 唯一将你内力的120%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "心有灵犀",
            distime: 30000,
            enable_skill: "force",
            mp: 1150,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 心有灵犀
                // 10秒内你的攻击命中对方后将触发多次，并且不会被控制
                me.send_room("$N使出「心有灵犀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内你的攻击命中对方后将触发多次，并且不会被控制";
            },
        },
        pfm_1: {
            name: "剑心通明",
            distime: 60000,
            enable_skill: "force",
            mp: 2600,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑心通明
                // 10秒内进入剑心通明状态，出招速度和冷却速度缩减到极限，洞悉对方弱点绝对命中招架，如果装备剑伤害增加40%
                me.send_room("$N使出「剑心通明」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内进入剑心通明状态，出招速度和冷却速度缩减到极限，洞悉对方弱点绝对命中招架，如果装备剑伤害增加40%";
            },
        },
    };
}
