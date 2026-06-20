import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "混天腰带";
    desc = "丐帮镇派腰带，以打狗棒法之真意织就，束腰后敌人难近身。";
    unit = "条";
    eq_type = EQUIP_TYPE.WAIST;

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
                this.prop = { fy: 76, str: 5 };
                this.desc = "丐帮正式弟子的布带，简单实用。";
                break;
            case 3:
                this.prop = { fy: 142, str: 15, con: 15 };
                this.desc = "丐帮精英弟子的皮带，结实有力。";
                break;
            case 4:
                this.prop = { fy: 248, max_hp: 3500, con: 20, str: 25 };
                this.desc = "丐帮长老的缠腰带，护身有术。";
                this.group_name = "huntian4";
                break;
            case 5:
                this.prop = { fy: 355, max_hp: 3500, str: 35, con: 30, diff_busy: 2000 };
                this.desc = "丐帮镇派腰带，以打狗棒法之真意织就，束腰后敌人难近身。";
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
