import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "真武道簪";
    desc = "武当派镇派之簪，以玄铁为骨，白玉为表，通体散发清冷道韵，佩戴后灵台清明。";
    unit = "支";
    eq_type = EQUIP_TYPE.HEAD;

    on_create(path, par) {
        let lv = 5;
        if (par) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv >= 2 && lv <= 5)) return;
        }
        this.grade = lv;
        this.hole_count = Math.max(0, lv - 1);
        switch (lv) {
            case 2:
                this.prop = { fy: 76, int: 5 };
                this.desc = "武当道童的木簪，质朴无华，束发修心。";
                break;
            case 3:
                this.prop = { fy: 142, int: 15, con: 10 };
                this.desc = "武当入室弟子的玉簪，温润养神，气定心闲。";
                break;
            case 4:
                this.prop = { fy: 248, int: 25, con: 20, distime_per: 5 };
                this.desc = "武当执事的道簪，灵玉雕琢，灵台清明，招不应心。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { fy: 355, int: 35, con: 35, distime_per: 10, distime: 1000 };
                this.desc = "武当长老之簪，玄铁为骨白玉为表，散发清冷道韵，灵台清明。";
                this.group_name = "zhenwu5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { int: 50 };
            if (count == 5) return { mz_per: 8, zj_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { int: 100 };
            if (count == 5) return { mz_per: 10, zj_per: 10 };
        }
    }
}
