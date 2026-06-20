import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "曙光发簪";
    desc = "峨眉派镇派发簪，白玉凝光，佩戴后心清神明，万法皆通。";
    unit = "支";
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
                this.prop = { fy: 80, con: 6 };
                this.desc = "峨眉派正式弟子的木簪，素净朴实。";
                break;
            case 3:
                this.prop = { fy: 186, con: 12, releasetime_per: 5 };
                this.desc = "峨眉派精英弟子的银簪，清心明智。";
                break;
            case 4:
                this.prop = { fy: 290, con: 21, releasetime_per: 10, lianxi_per: 5 };
                this.desc = "峨眉派长老的玉簪，佛前供奉，灵性十足。";
                this.group_name = "shuguang4";
                break;
            case 5:
                this.prop = { fy: 356, con: 32, releasetime_per: 20, lianxi_per: 10, max_hp: 4000 };
                this.desc = "峨眉派镇派发簪，白玉凝光，佩戴后心清神明，万法皆通。";
                this.group_name = "shuguang5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { con: 50 };
            if (count == 5) return { hp_per: 5, diff_fy_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { con: 100 };
            if (count == 5) return { hp_per: 10, diff_fy_per: 10 };
        }
    }
}
