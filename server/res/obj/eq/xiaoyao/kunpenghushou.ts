import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "鲲鹏护手";
    desc = "逍遥派镇派护手，轻盈如羽，出手间风云为之变色。";
    unit = "对";
    eq_type = EQUIP_TYPE.WRIST;

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
                this.prop = { fy: 30, dex: 5 };
                this.desc = "逍遥弟子的轻护手，灵巧贴身，挥洒自如。";
                break;
            case 3:
                this.prop = { fy: 72, dex: 15, mz: 30 };
                this.desc = "逍遥入室弟子的护手，出手迅捷，如电光石火。";
                break;
            case 4:
                this.prop = { fy: 168, dex: 22, mz: 60, releasetime_per: 5 };
                this.desc = "逍遥护法的护手，运招如行云流水，不着痕迹。";
                this.group_name = "kunpeng4";
                break;
            case 5:
                this.prop = { fy: 280, dex: 30, mz: 120, releasetime_per: 10, distime: 2000 };
                this.desc = "逍遥长老的护手，轻盈如羽，出手间风云为之变色。";
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
