import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "大宋军靴";
    desc = "大宋禁军的制式军靴，厚底铁掌，踏阵如飞。";
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
                this.prop = { fy: 67, con: 5 };
                this.desc = "大宋厢军的布靴，粗制滥造。";
                break;
            case 3:
                this.prop = { fy: 160, con: 10, dex: 12 };
                this.desc = "大宋边军的行军靴，轻便耐磨。";
                break;
            case 4:
                this.prop = { fy: 290, str: 21, con: 18, ds: 220 };
                this.desc = "大宋精锐步兵的布靴，轻便实用。";
                break;
            case 5:
                this.prop = { fy: 356, ds: 320, str: 32, con: 35, max_hp: 4500 };
                this.desc = "大宋禁军的制式军靴，厚底铁掌，踏阵如飞。";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
