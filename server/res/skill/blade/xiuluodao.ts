import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "修罗刀";
    id = "xiuluodao";
    grade = 6;
    
    desc = "舍刀之外，再无他物";
    can_enables = ["blade"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: Math.floor(lv * 3.2),
                mz_per: 8,
                gj_per: 8,
                add_sh_per: 8,
                diff_fy_per: 8,
                desc: "当你命中敌人后使敌人流血，更容易受到伤害",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "修罗炼狱",
            distime: 28500,
            enable_skill: "blade",
            mp: 1280,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 修罗炼狱
                // 对敌人造成的伤害附加1%对方当前气血，每层修罗增加出招一次，最多6次，如果敌人被击杀则重置冷却
                me.send_room("$N使出「修罗炼狱」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成的伤害附加1%对方当前气血，每层修罗增加出招一次，最多6次，如果敌人被击杀则重置冷却";
            },
        },
        pfm_1: {
            name: "六道轮回",
            distime: 57000,
            enable_skill: "blade",
            mp: 1380,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 六道轮回
                // 重置敌人身上的修罗，每层修罗造成150%伤害，吸收为自身增益
                me.send_room("$N使出「六道轮回」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "重置敌人身上的修罗，每层修罗造成150%伤害，吸收为自身增益";
            },
        },
    };
}
