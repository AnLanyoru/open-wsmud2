import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "君子剑";
    desc = "华山派镇派宝剑，剑身通体青碧，如君子之德温润而锋锐内敛。";
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
                this.desc = "华山派正式弟子的制式配剑，剑身轻盈。";
                break;
            case 3:
                this.prop = { gj: 132, str: 25, mz: 120 };
                this.desc = "华山派精英弟子的佩剑，以青钢锻造，锋锐灵动。";
                break;
            case 4:
                this.prop = { gj: 300, add_sh_per: 3, str: 35, mz: 320 };
                this.desc = "华山派长老的佩剑，剑气如虹，招招致命。";
                this.group_name = "junzi4";
                break;
            case 5:
                this.prop = { gj: 490, str: 55, mz: 500, mz_per: 10, add_sh_per: 6 };
                this.desc = "华山派镇派宝剑，剑身通体青碧，如君子之德温润而锋锐内敛。";
                this.group_name = "junzi5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { dex: 50 };
            if (count == 5) return { mz_per: 8, diff_busy_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { dex: 100 };
            if (count == 5) return { mz_per: 10, diff_busy_per: 10 };
        }
    }
}
