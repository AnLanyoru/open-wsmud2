import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "罗汉帽";
    desc = "少林寺镇派僧帽，形如罗汉顶戴，庄严肃穆。";
    unit = "顶";
    eq_type = EQUIP_TYPE.HEAD;

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
                this.desc = "少林寺正式弟子的僧帽，灰布缝制。";
                break;
            case 3:
                this.prop = { fy: 142, str: 15, max_hp: 1500 };
                this.desc = "少林寺精英弟子的僧帽，厚实软和。";
                break;
            case 4:
                this.prop = { fy: 248, max_hp: 3500, con: 20, str: 25 };
                this.desc = "少林寺长老的毗卢帽，绣有梵文真言。";
                this.group_name = "luohan4";
                break;
            case 5:
                this.prop = { fy: 355, fy_per: 5, str: 35, con: 30, hp_per: 5 };
                this.desc = "少林寺镇派僧帽，形如罗汉顶戴，庄严肃穆。";
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
