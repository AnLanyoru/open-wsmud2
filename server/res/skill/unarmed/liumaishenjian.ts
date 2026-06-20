import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "六脉神剑";
    id = "liumaishenjian";
    grade = 5;
    
    desc = "大理段氏所藏有的超强剑气绝学，能够以指尖激荡出破体剑气伤人于无形";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                add_sh_per: 4,
                diff_fy_per: 4,
                desc: "当你命中敌人后会对附近一名敌人产生溅射伤害",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无形剑气",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无形剑气
                // 以强劲的内力贯于指尖，将内力化为无形剑气伤敌。如果敌方招架成功只受到伤害，否则使敌人昏迷7秒。
                me.send_room("$N使出「无形剑气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以强劲的内力贯于指尖，将内力化为无形剑气伤敌。如果敌方招架成功只受到伤害，否则使敌人昏迷7秒。";
            },
        },
        pfm_1: {
            name: "六脉纵横",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 六脉纵横
                // 六脉齐射，随机攻击你的敌人，命中一次减少对方4%防御，持续10秒
                me.send_room("$N使出「六脉纵横」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "六脉齐射，随机攻击你的敌人，命中一次减少对方4%防御，持续10秒";
            },
        },
    };
}
