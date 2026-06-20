import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "紫霞神功";
    id = "zixiashengong2";
    source_skill = "zixiashengong";
    grade = 4;
    family = FAMILIES.HUASHAN;
    desc = "华山派的内功心法，气宗的立派根本，以修炼时身上紫气环绕而得名";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+120000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '紫气东来招冷却时间减少5秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 1.61),
                mz: Math.floor(lv * 1.51),
                add_sh_per: 4,
                limit_mp: lv * 160,
                desc: "唯一：将你内力的70%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "紫气东来",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 紫气东来
                // 使用紫霞神功提升战力，增加你的最终伤害30%，命中增加30%，持续30秒
                me.send_room("$N使出「紫气东来」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用紫霞神功提升战力，增加你的最终伤害30%，命中增加30%，持续30秒";
            },
        },
    };
}
