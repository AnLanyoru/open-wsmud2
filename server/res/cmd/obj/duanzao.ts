import { COMMAND } from "../../../core/command.js";
import { WORLD } from "../../../core/world.js";
import { EQUIP_TYPE } from "../../../core/const.js";

/**
 * 属性每级所需材料数（1级=1, 2级=+2, ...）
 */
const NEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20];

export default class extends COMMAND {
    command = "duanzao";

    /**
     * 可锻造的属性定义
     */
    PROPS = {
        gj: { needs: NEEDS, name: "攻击" },
        fy: { needs: NEEDS, name: "防御" },
        mz: { needs: NEEDS, name: "命中" },
        ds: { needs: NEEDS, name: "躲闪" },
        zj: { needs: NEEDS, name: "招架" },
    };

    /**
     * 每种装备类型的默认属性
     */
    DEFAULT_PROPS = {
        [EQUIP_TYPE.WEAPON]: "gj",
        [EQUIP_TYPE.CLOTH]: "fy",
        [EQUIP_TYPE.SHOES]: "ds",
        [EQUIP_TYPE.HEAD]: "fy",
        [EQUIP_TYPE.CAPE]: "fy",
        [EQUIP_TYPE.RING]: "gj",
        [EQUIP_TYPE.NECKLACE]: "fy",
        [EQUIP_TYPE.JEWELS]: "fy",
        [EQUIP_TYPE.WRIST]: "gj",
        [EQUIP_TYPE.WAIST]: "fy",
        [EQUIP_TYPE.THROWING]: "gj",
    };

    /**
     * 计算属性升级到指定等级所需的累计材料数
     */
    sum_needs(prop, level) {
        if (!prop || !prop.needs || level <= 0) return 0;
        let sum = 0;
        for (let i = 0; i < level; i++) {
            sum += prop.needs[i] ?? prop.needs[prop.needs.length - 1];
        }
        return sum;
    }

    /**
     * 为新造的装备设置默认模板
     */
    default_template(obj, eq_type) {
        obj.is_equipment = true;
        obj.eq_type = eq_type;
        obj.no_jinglian = false;
        obj.no_fenjie = false;
        obj.grade = 6;
        obj.level = 0;
        if (!obj.temp) obj.temp = {};
        const def_prop = this.DEFAULT_PROPS[eq_type];
        if (def_prop) {
            obj.set_temp(def_prop, 1);
        }
    }

    /**
     * 命令入口 — 路由到房间内铁匠 NPC 的 on_duanzao 方法
     */
    enter(me, arg) {
        const env = me.environment;
        if (env && env.items) {
            for (const item of env.items) {
                if (item.is_npc && item.on_duanzao) {
                    item.on_duanzao(me, arg);
                    return;
                }
            }
        }
        me.notify("这里没有铁匠可以帮你锻造武器。");
    }
}
