import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "松风剑法";
    id = "songfengjianfa";
    grade = 3;
    
    desc = "青城派绝学：如松之劲，如风之迅。剑法讲究快且劲，走的是灵巧一脉的剑法。";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '松月无影出招后保留松风状态，脱战后消失',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '每层松风额外增加松月无影10%命中',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.42),
                dex: Math.floor(lv * 0.127),
            },
            parry: {
                zj: Math.floor(lv * 1.41),
                max_hp: 10 + lv * 5,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "松月无影",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 松月无影
                // 消耗你积累的速度，瞬间出剑，每层松风增加你一次攻击次数
                me.send_room("$N使出「松月无影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗你积累的速度，瞬间出剑，每层松风增加你一次攻击次数";
            },
        },
    };
}
