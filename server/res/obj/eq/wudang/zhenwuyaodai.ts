import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "真武腰带";
    desc = "武当派镇派腰带，以蛟龙筋鞣制而成，束于腰间真气自生，内力如江海不绝。";
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
                this.desc = "武当派正式弟子的布腰带，简单实用。";
                break;
            case 3:
                this.prop = { fy: 142, con: 15, str: 10 };
                this.desc = "武当派精英弟子的腰带，以坚韧兽皮制成。";
                break;
            case 4:
                this.prop = { fy: 248, con: 25, str: 20, zj_per: 5 };
                this.desc = "武当派长老的束带，以灵兽筋鞣制，束腰护身。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { fy: 355, con: 45, str: 30, expend_mp_per: 10, zj_per: 10 };
                this.desc = "武当派镇派腰带，以蛟龙筋鞣制而成，束于腰间真气自生，内力如江海不绝。";
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
