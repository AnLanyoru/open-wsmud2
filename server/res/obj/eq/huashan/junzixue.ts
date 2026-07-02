import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "君子靴";
    desc = "华山派镇派之靴，轻若鸿毛，追风逐电。";
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
        this.hole_count = Math.max(0, lv - 1);
        switch (lv) {
            case 2:
                this.prop = { fy: 67, dex: 5 };
                this.desc = "华山弟子的布靴，轻便耐磨，踏石无声。";
                break;
            case 3:
                this.prop = { fy: 156, dex: 15, diff_busy_per: 2 };
                this.desc = "华山入室弟子的快靴，身轻如燕，来去如风。";
                break;
            case 4:
                this.prop = { fy: 231, dex: 20, diff_busy_per: 5, ds_per: 1 };
                this.desc = "华山护法的踏云靴，步若流云，追风逐电。";
                this.group_name = "junzi4";
                break;
            case 5:
                this.prop = { fy: 320, dex: 40, diff_busy_per: 10, ds_per: 5, mz_per: 5 };
                this.desc = "华山长老之靴，轻若鸿毛，追风逐电。";
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
