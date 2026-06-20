import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "鲲鹏长袍";
    desc = "逍遥派镇派长袍，衣袂飘飘如鲲鹏展翅，潇洒不羁。";
    unit = "件";
    eq_type = EQUIP_TYPE.CLOTH;

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
                this.prop = { fy: 120, ds: 50 };
                this.desc = "逍遥弟子的长袍，自在飘逸，初悟逍遥之道。";
                break;
            case 3:
                this.prop = { fy: 220, ds: 150, dex: 10 };
                this.desc = "逍遥入室弟子的长袍，身法灵动，如风拂柳。";
                break;
            case 4:
                this.prop = { fy: 320, ds: 200, dex: 25, con: 20, releasetime_per: 5 };
                this.desc = "逍遥护法的长袍，乘风而行，踪影难觅。";
                this.group_name = "kunpeng4";
                break;
            case 5:
                this.prop = { fy: 420, ds_per: 5, dex: 35, con: 30, releasetime_per: 10 };
                this.desc = "逍遥长老的长袍，衣袂如鲲鹏展翅，潇洒不羁。";
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
