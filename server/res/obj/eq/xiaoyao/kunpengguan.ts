import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "鲲鹏冠";
    desc = "逍遥派镇派之冠，形如鲲鹏展翅，佩戴后内力充盈如海。";
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
                this.prop = { fy: 76, dex: 7 };
                this.desc = "逍遥弟子的布冠，简朴雅致，不拘俗礼。";
                break;
            case 3:
                this.prop = { fy: 142, dex: 17, per: 2 };
                this.desc = "逍遥入室弟子的羽冠，飘逸出尘，灵思泉涌。";
                break;
            case 4:
                this.prop = { fy: 248, dex: 27, per: 2, limit_mp: 3000 };
                this.desc = "逍遥护法的灵冠，内力如江河奔流，取之不竭。";
                this.group_name = "kunpeng4";
                break;
            case 5:
                this.prop = { fy: 355, dex: 40, per: 2, limit_mp: 6000, expend_mp_per: 10 };
                this.desc = "逍遥长老之冠，形如鲲鹏展翅，内力充盈如海。";
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
