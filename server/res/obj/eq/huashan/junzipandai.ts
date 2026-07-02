import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "君子鞶带";
    desc = "华山派镇派鞶带，青玉为扣，束腰后身形如风，来去自如。";
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
        this.hole_count = Math.max(0, lv - 1);
        switch (lv) {
            case 2:
                this.prop = { fy: 76, dex: 5 };
                this.desc = "华山弟子的布带，束腰而立，气度初显。";
                break;
            case 3:
                this.prop = { fy: 142, dex: 15, dazuo_per: 5 };
                this.desc = "华山入室弟子的皮带，灵动自如，身法更捷。";
                break;
            case 4:
                this.prop = { fy: 248, dex: 25, dazuo_per: 10, diff_busy: 1000 };
                this.desc = "华山护法的玉带，身似闲云，来去无碍。";
                this.group_name = "junzi4";
                break;
            case 5:
                this.prop = { fy: 355, dex: 45, dazuo_per: 15, diff_busy: 3000, int: 30 };
                this.desc = "华山长老的鞶带，青玉为扣，束腰后身形如风，来去自如。";
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
