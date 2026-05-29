/**
 * FAMILY_AREA 门派区域类 - 继承自AREA
 * @extends {AREA}
 */
import { AREA } from "./area.js";
import { WORLD } from "../world.js";
import { FAMILIES } from "../skill/family.js";

export class FAMILY_AREA extends AREA {

    constructor() {
        super();
    }

    // ============ 门派区域扩展(由extends合并) ============

    /** @param {CHARACTER} me @returns {Array} */
    query_actions(me) {
        let actions = [];
        for (let item of stand_actions) {
            actions.push([
                item[0] + " " + this.family, item[1], item[2]
            ]);
        }
        let fam = FAMILIES[this.family];
        if (fam.battle_family) {
            let target_fam = FAMILIES[fam.battle_family];
            actions.push([
                'goto fam3 ' + this.family, '进入战场', target_fam.name + "正在进攻" + fam.name
            ]);
        }
        if (fam.first_npc) {
            actions.push([
                'sx greet', '请安', fam.name + "首席弟子：" + fam.first_npc.name
            ]);
        }
        return actions;
    }

    /** 通知区域更新 */
    notify_update() {
        this.json = null;
        WORLD.send(`{type:"dialog",dialog:"jh",t:"fam",refresh:${this.index}}`);
    }
}

const stand_actions = [
    ['goto fam1', '练功', '回到你所在门派师父所在位置学习武功'],
    ['goto fam2', '后勤', '前往当前门派后勤管理的位置']
];

