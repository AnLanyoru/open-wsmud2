import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "梯云纵";
    id = "tiyunzong2";
    source_skill = "tiyunzong";
    grade = 4;
    family = FAMILIES.WUDANG;
    desc = "无";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '梯云纵最大可叠加层数+2',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '梯云纵的内置冷却减少1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 5 + lv * 2,
                dex: Math.floor(lv * 0.25),
                fy_per: 8,
                desc: "当成功躲闪对方攻击时增加1000躲闪，命中，可叠加",
            },
        };
    }
}
