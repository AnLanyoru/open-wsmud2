import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "蒙古军枪";
    desc = "蒙古铁骑的制式长枪，枪身粗犷，一枪刺出势不可挡。";
    unit = "杆";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;

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
                this.prop = { gj: 60, zj: 60 };
                this.desc = "蒙古探马的短枪，简单粗陋。";
                break;
            case 3:
                this.prop = { gj: 145, str: 22, zj: 150 };
                this.desc = "蒙古轻骑的长枪，草原驰骋的利器。";
                break;
            case 4:
                this.prop = { gj: 350, diff_fy_per: 5, str: 35, zj: 320 };
                this.desc = "蒙古精锐骑兵的制式长枪，骑战利器。";
                break;
            case 5:
                this.prop = { gj: 590, zj: 500, zj_per: 10, str: 55, diff_fy_per: 10 };
                this.desc = "蒙古铁骑的制式长枪，枪身粗犷，一枪刺出势不可挡。";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
