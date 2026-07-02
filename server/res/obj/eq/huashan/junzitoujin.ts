import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "君子头巾";
    desc = "华山派镇派头巾，青丝织就，束发后神清气爽，过目不忘。";
    unit = "条";
    eq_type = EQUIP_TYPE.HEAD;

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
                this.prop = { fy: 76, study_per: 5 };
                this.desc = "华山弟子的青布巾，束发正冠，初入剑门。";
                break;
            case 3:
                this.prop = { fy: 142, study_per: 15, per: 2 };
                this.desc = "华山入室弟子的儒巾，儒雅清隽，过目不忘。";
                break;
            case 4:
                this.prop = { fy: 248, study_per: 15, max_hp: 3000, per: 2 };
                this.desc = "华山护法的逍遥巾，博学广识，剑理通明。";
                this.group_name = "junzi4";
                break;
            case 5:
                this.prop = { fy: 355, study_per: 25, max_hp: 6000, distime_per: 10, per: 2 };
                this.desc = "华山长老的头巾，青丝织就，束发后神清气爽，过目不忘。";
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
