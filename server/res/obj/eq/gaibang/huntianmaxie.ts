import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "混天麻鞋";
    desc = "丐帮镇派麻鞋，以天蚕丝混编麻绳制成，看似简陋实则轻便无比。";
    unit = "双";
    eq_type = EQUIP_TYPE.SHOES;

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
                this.prop = { fy: 67, str: 5 };
                this.desc = "丐帮正式弟子的麻鞋，粗糙耐用。";
                break;
            case 3:
                this.prop = { fy: 156, str: 15, con: 15 };
                this.desc = "丐帮精英弟子的草鞋，走遍天涯。";
                break;
            case 4:
                this.prop = { fy: 231, max_hp: 3500, dex: 20, con: 25 };
                this.desc = "丐帮长老的行路鞋，跋山涉水如履平地。";
                this.group_name = "huntian4";
                break;
            case 5:
                this.prop = { fy: 320, str: 45, dex: 40, max_hp: 3500, hp_per: 5 };
                this.desc = "丐帮镇派麻鞋，以天蚕丝混编麻绳制成，看似简陋实则轻便无比。";
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
