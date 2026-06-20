import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "一苇渡江";
    id = "shaolinshenfa2";
    grade = 4;
    family = FAMILIES.SHAOLIN;
    desc = "无";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '一苇渡江最大可叠加层数+2',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '一苇渡江的内置冷却减少1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.81),
                str: 4 + Math.floor(lv * 0.25),
                dex: 4 + Math.floor(lv * 0.25),
                desc: "当你躲闪失败会增加你1000防御，可叠加10层",
            },
        };
    }
}
