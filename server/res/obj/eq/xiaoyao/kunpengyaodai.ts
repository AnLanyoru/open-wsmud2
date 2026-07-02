import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "鲲鹏腰带";
    desc = "逍遥派镇派腰带，灵兽筋鞣制，束于腰间内力如北冥之海，深不可测。";
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
                this.prop = { limit_mp: 500, fy: 76 };
                this.desc = "逍遥弟子的布腰带，朴实耐用，束腰养气。";
                break;
            case 3:
                this.prop = { fy: 142, limit_mp: 1500, dazuo_per: 5 };
                this.desc = "逍遥入室弟子的皮带，吐纳顺畅，气走周天。";
                break;
            case 4:
                this.prop = { fy: 248, limit_mp: 2500, dazuo_per: 10, dex: 25 };
                this.desc = "逍遥护法的束带，气息如北冥之水，深不可测。";
                this.group_name = "kunpeng4";
                break;
            case 5:
                this.prop = { fy: 355, limit_mp: 4500, dazuo_per: 15, dex: 35, releasetime_per: 10 };
                this.desc = "逍遥长老的腰带，灵兽筋鞣制，内力如北冥之海，深不可测。";
                this.group_name = "kunpeng5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { dex: 50 };
            if (count == 5) return { ds_per: 8, distime_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { dex: 100 };
            if (count == 5) return { ds_per: 10, distime_per: 10 };
        }
    }
}
