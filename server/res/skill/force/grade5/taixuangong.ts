import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "太玄功";
    id = "taixuangong";
    grade = 5;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 2.1),
                add_sh_per: 8,
                diff_busy: 4000,
                limit_mp: lv * 286,
                desc: "当你命中敌人会造成4000内功伤害，不可招架; 唯一：将你内力的80%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "十步杀一人",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 十步杀一人
                // 对附近敌人进行快速攻击，突破对方40%防御，如果命中增加攻击次数，无视忙乱
                me.send_room("$N使出「十步杀一人」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对附近敌人进行快速攻击，突破对方40%防御，如果命中增加攻击次数，无视忙乱";
            },
        },
        pfm_1: {
            name: "白首太玄",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 白首太玄
                // 将太玄功力运转周身，13秒内太玄功附加伤害加倍，命中后恢复自己攻击力40%的气血
                me.send_room("$N使出「白首太玄」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将太玄功力运转周身，13秒内太玄功附加伤害加倍，命中后恢复自己攻击力40%的气血";
            },
        },
    };
}
