import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "混天蓑衣";
    desc = "丐帮镇派蓑衣，看似破旧实则坚韧无比，历经风雨而不坏。";
    unit = "件";
    eq_type = EQUIP_TYPE.CLOTH;

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
                this.prop = { fy: 120, str: 5 };
                this.desc = "丐帮正式弟子的蓑衣，遮风挡雨。";
                break;
            case 3:
                this.prop = { fy: 220, str: 15, con: 10 };
                this.desc = "丐帮精英弟子的厚蓑衣，结实耐穿。";
                break;
            case 4:
                this.prop = { fy: 320, gj: 80, con: 20, str: 25 };
                this.desc = "丐帮长老的铁蓑衣，内衬金丝，攻防一体。";
                this.group_name = "huntian4";
                break;
            case 5:
                this.prop = { fy: 420, fy_per: 5, gj: 180, con: 30, str: 35 };
                this.desc = "丐帮镇派蓑衣，看似破旧实则坚韧无比，历经风雨而不坏。";
                this.group_name = "huntian5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { str: 50 };
            if (count == 5) return { con: 50, diff_sh_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { str: 100 };
            if (count == 5) return { con: 100, diff_sh_per: 10 };
        }
    }
}
