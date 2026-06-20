import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "纵横术";
    id = "zonghengshu";
    grade = 1;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门的招架功法，以纵横之术为基础发展而来，对其研究的越深入则越强";
    can_enables = ["parry"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '开合之道招架次数增加1次',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: 1300,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "开合之道",
            distime: 60000,
            enable_skill: "parry",
            mp: 6630,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 开合之道
                // 你将抵挡即将到来的1次攻击
                me.send_room("$N使出「开合之道」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "你将抵挡即将到来的1次攻击";
            },
        },
    };
}
