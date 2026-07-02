import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "混天棍";
    desc = "丐帮镇派之棍，以千年玄铁打造，一棍出而天地动。";
    unit = "根";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;

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
                this.prop = { gj: 65, dex: 5 };
                this.desc = "丐帮正式弟子的制式长棍，坚实耐用。";
                break;
            case 3:
                this.prop = { gj: 152, dex: 15, zj: 120 };
                this.desc = "丐帮精英弟子的铁棍，沉稳有力。";
                break;
            case 4:
                this.prop = { gj: 380, dex: 25, str: 25, zj: 320 };
                this.desc = "丐帮长老的玄铁棍，横扫千军。";
                break;
            case 5:
                this.prop = { gj: 560, gj_per: 10, str: 35, dex: 35, zj_per: 5 };
                this.desc = "丐帮镇派之棍，以千年玄铁打造，一棍出而天地动。";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
