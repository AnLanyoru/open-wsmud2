import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "子午断魂针";
    id = "ziwuduanhunzhen";
    grade = 4;
    
    desc = "药王谷秘传暗器手法，专打周身大穴，中者经脉受损。";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '子午断魂针忽视对方10%防御',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '子午断魂针降低对方伤害的效果额外增加12',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.8),
                mz: 4 + Math.floor(lv * 1.8),
                mz_per: 3,
                add_sh_per: 3,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "断魂",
            distime: 25000,
            enable_skill: "throwing",
            mp: 60,
            release_time: 1800,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 断魂
                // 发射2枚子午针攻击目标，命中后使对方经脉受损，伤害降低25%。
                me.send_room("$N使出「断魂」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "发射2枚子午针攻击目标，命中后使对方经脉受损，伤害降低25%。";
            },
        },
    };
}
