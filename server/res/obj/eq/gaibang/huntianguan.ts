import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "混天冠";
    desc = "丐帮镇派之冠，虽看似随意，实则蕴含丐帮千年武学精华。";
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
                this.desc = "丐帮弟子的头巾，随性洒脱。";
                break;
            case 3:
                this.prop = { fy: 142, str: 15, mz: 35 };
                this.desc = "丐帮执事的混天巾，不羁豪放。";
                break;
            case 4:
                this.prop = { fy: 248, max_hp: 3500, con: 20, str: 25 };
                this.desc = "丐帮护法的头冠，坚韧不屈。";
                this.group_name = "huntian4";
                break;
            case 5:
                this.prop = { fy: 355, fy_per: 5, str: 35, con: 30, hp_per: 5 };
                this.desc = "丐帮长老的头冠，虽看似随意，实则蕴含丐帮千年武学精华。";
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
