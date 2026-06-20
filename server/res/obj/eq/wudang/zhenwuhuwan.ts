import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "真武护腕";
    desc = "武当派镇派护腕，以玄铁打造，内嵌太极护符，坚不可摧。";
    unit = "对";
    eq_type = EQUIP_TYPE.WRIST;

    on_create(path, par) {
        let lv = 5;
        if (par) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv >= 2 && lv <= 5)) return;
        }
        this.grade = lv;
        switch (lv) {
            case 2:
                this.prop = { fy: 30, con: 5 };
                this.desc = "武当派正式弟子的护腕，以粗布裹铁片制成。";
                break;
            case 3:
                this.prop = { fy: 72, con: 15, mz: 130 };
                this.desc = "武当派精英弟子的护腕，以皮革鞣制，内衬精铁。";
                break;
            case 4:
                this.prop = { fy: 168, con: 25, mz: 260, busy_per: 5 };
                this.desc = "武当派长老的玄铁护腕，攻守兼备，出招更快。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { fy: 280, con: 38, mz: 320, max_hp: 4000, busy_per: 10 };
                this.desc = "武当派镇派护腕，以玄铁打造，内嵌太极护符，坚不可摧。";
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
