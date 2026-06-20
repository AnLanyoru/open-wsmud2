import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "曙光佛衣";
    desc = "峨眉派镇派佛衣，佛光萦绕，身着如沐晨光，护体疗伤。";
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
        switch (lv) {
            case 2:
                this.prop = { fy: 120, max_hp: 500 };
                this.desc = "峨眉派正式弟子的佛衣，素洁大方。";
                break;
            case 3:
                this.prop = { fy: 230, max_hp: 1200, con: 15 };
                this.desc = "峨眉派精英弟子的佛衣，慈悲为怀。";
                break;
            case 4:
                this.prop = { fy: 340, max_hp: 2800, con: 25, hp_per: 3 };
                this.desc = "峨眉派长老的佛衣，佛光普照，气血充盈。";
                this.group_name = "shuguang4";
                break;
            case 5:
                this.prop = { fy: 450, max_hp: 4500, con: 36, hp_per: 10, diff_sh_per: 5 };
                this.desc = "峨眉派镇派佛衣，佛光萦绕，身着如沐晨光，护体疗伤。";
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
