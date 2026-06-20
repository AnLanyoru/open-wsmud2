import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "曙光剑";
    desc = "峨眉派镇派宝剑，剑身映照晨光，如曙光初现，破暗除魔。";
    unit = "把";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;

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
                this.prop = { gj: 55, mz: 35 };
                this.desc = "峨眉派正式弟子的制式配剑，轻盈灵动。";
                break;
            case 3:
                this.prop = { gj: 132, con: 15, mz: 120 };
                this.desc = "峨眉派精英弟子的佩剑，剑光如水。";
                break;
            case 4:
                this.prop = { gj: 300, con: 25, mz: 320, diff_fy_per: 5 };
                this.desc = "峨眉派长老的佩剑，佛光剑气合一，破敌护身。";
                this.group_name = "shuguang4";
                break;
            case 5:
                this.prop = { gj: 490, con: 35, mz: 500, mz_per: 10, diff_fy_per: 6 };
                this.desc = "峨眉派镇派宝剑，剑身映照晨光，如曙光初现，破暗除魔。";
                this.group_name = "shuguang5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { con: 50 };
            if (count == 5) return { hp_per: 5, diff_fy_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { con: 100 };
            if (count == 5) return { hp_per: 10, diff_fy_per: 10 };
        }
    }
}
