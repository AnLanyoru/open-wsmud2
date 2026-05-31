/**
 * FAMILY_AREA 门派区域类 - 继承自AREA
 */
import { AREA } from "./area.js";
import { WORLD } from "../world.js";
import { FAMILIES } from "../skill/family.js";

export class FAMILY_AREA extends AREA {

    constructor() {
        super();
    }

    // ============ 门派区域扩展(由extends合并) ============

    /**
     * 查询门派区域操作按钮 — 返回练功/后勤/战场/请安等标准操作
     * @param me - 玩家对象
     * @returns 操作按钮列表 [[cmd, name, desc], ...]
     */
    query_actions(me: any): any[] {
        let actions: any[] = [];
        for (let item of stand_actions) {
            actions.push([
                item[0] + " " + this.family, item[1], item[2]
            ]);
        }
        let fam = FAMILIES[this.family!];
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

    /**
     * 通知客户端门派区域数据更新
     */
    notify_update(): void {
        this.json = null;
        WORLD.send(`{type:"dialog",dialog:"jh",t:"fam",refresh:${this.index}}`);
    }
}

/**
 * 门派区域标准操作按钮
 * [命令前缀, 按钮名, 描述文本]
 */
const stand_actions: [string, string, string][] = [
    ['goto fam1', '练功', '回到你所在门派师父所在位置学习武功'],
    ['goto fam2', '后勤', '前往当前门派后勤管理的位置']
];
