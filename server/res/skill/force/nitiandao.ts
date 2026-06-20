import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "逆天道";
    id = "nitiandao";
    grade = 6;
    
    desc = "岁月轮回，逆天而行";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                hp_per: 15,
                diff_sh_per: 10,
                add_sh_per: 10,
                limit_mp: 1100000,
                desc: "逆转将受到的13.3%伤害转为自己的气血和内力; 唯一将你内力的150%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "一念轮回",
            distime: 57000,
            enable_skill: "force",
            mp: 87720,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 一念轮回
                // 将敌人的技能重置冷却
                me.send_room("$N使出「一念轮回」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将敌人的技能重置冷却";
            },
        },
        pfm_1: {
            name: "一念寂灭",
            distime: 57000,
            enable_skill: "force",
            mp: 100470,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 一念寂灭
                // 压制附近敌人当前内力的12%，加快对方的能力流失，内力消耗增加10000+20%。
                me.send_room("$N使出「一念寂灭」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "压制附近敌人当前内力的12%，加快对方的能力流失，内力消耗增加10000+20%。";
            },
        },
    };
}
