import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "罗汉腰带";
    desc = "少林寺镇派腰带，以金丝编成，束于腰间内力源源不绝。";
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
                this.prop = { fy: 76, con: 5 };
                this.desc = "少林沙弥的布腰带，朴实无华，束身修心。";
                break;
            case 3:
                this.prop = { fy: 142, con: 15, dazuo_per: 5 };
                this.desc = "少林武僧的腰带，内蕴禅静，气沉丹田。";
                break;
            case 4:
                this.prop = { fy: 248, max_hp: 3500, con: 20, dazuo_per: 8 };
                this.desc = "少林首座的束带，打坐入定，事半功倍。";
                this.group_name = "luohan4";
                break;
            case 5:
                this.prop = { fy: 355, limit_mp: 4500, str: 35, con: 30, dazuo_per: 10 };
                this.desc = "少林长老的腰带，金丝编成，束于腰间内力源源不绝。";
                this.group_name = "luohan5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { hp_per: 5 };
            if (count == 5) return { fy_per: 8, diff_sh_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { hp_per: 10 };
            if (count == 5) return { fy_per: 10, diff_sh_per: 10 };
        }
    }
}
