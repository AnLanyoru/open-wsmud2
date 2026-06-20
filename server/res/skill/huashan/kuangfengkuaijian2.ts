import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "狂风快剑";
    id = "kuangfengkuaijian2";
    source_skill = "kuangfengkuaijian";
    grade = 5;
    family = FAMILIES.HUASHAN;
    desc = "华山派的剑宗的立宗剑法，以快闻名";
    can_enables = ["sword","dodge"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 10 + lv * 2,
                dex: Math.floor(lv * 0.25),
                gjsd: 250,
                bj_per: 4,
            },
            dodge: {
                ds: 16 + Math.floor(lv * 1.9),
                dex: 3 + Math.floor(lv * 0.33),
                gjsd: 250,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "夺命连环",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 夺命连环
                // 夺命连环三仙剑是剑宗狂风剑法的精髓，瞬间攻出三剑，如果三剑全部命中下次攻击后会继续触发夺命连环
                me.send_room("$N使出「夺命连环」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "夺命连环三仙剑是剑宗狂风剑法的精髓，瞬间攻出三剑，如果三剑全部命中下次攻击后会继续触发夺命连环";
            },
        },
    };
}
