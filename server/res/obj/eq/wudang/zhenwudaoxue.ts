import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "真武道靴";
    desc = "武当派镇派之靴，轻便灵动，踏雪无痕，登萍渡水如履平地。";
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
                this.prop = { fy: 67, con: 8 };
                this.desc = "武当派正式弟子的制式布靴，结实耐磨。";
                break;
            case 3:
                this.prop = { fy: 156, con: 15, int: 12 };
                this.desc = "武当派精英弟子的皮靴，轻便舒适，久行不倦。";
                break;
            case 4:
                this.prop = { fy: 231, dex: 20, int: 20, con: 20 };
                this.desc = "武当派长老的云履，以特殊材质制成，行走间有踏云之感。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { fy: 320, dex: 30, int: 30, con: 30, diff_sh_per: 5 };
                this.desc = "武当派镇派之靴，轻便灵动，踏雪无痕，登萍渡水如履平地。";
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
