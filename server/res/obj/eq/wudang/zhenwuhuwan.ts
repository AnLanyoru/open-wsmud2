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
                this.desc = "武当道童的布腕，初习拳剑，护身之始。";
                break;
            case 3:
                this.prop = { fy: 72, con: 15, mz: 130 };
                this.desc = "武当入室弟子的皮腕，内衬精铁，柔中带刚。";
                break;
            case 4:
                this.prop = { fy: 168, con: 25, mz: 260, busy_per: 5 };
                this.desc = "武当执事的玄铁护腕，太极之力蕴于腕间，攻守随心。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { fy: 280, con: 38, mz: 320, max_hp: 4000, busy_per: 10 };
                this.desc = "武当长老的护腕，玄铁打造，内嵌太极护符，坚不可摧。";
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
