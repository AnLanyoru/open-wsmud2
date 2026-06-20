import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "罗汉戒刀";
    desc = "少林寺镇派戒刀，刀身刻有金刚经文，挥动间佛光隐现，降魔伏妖。";
    unit = "把";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;

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
                this.prop = { gj: 65, str: 5 };
                this.desc = "少林寺正式弟子的制式戒刀，刀背厚实，沉稳有力。";
                break;
            case 3:
                this.prop = { gj: 152, str: 25, zj: 120 };
                this.desc = "少林寺精英弟子的戒刀，以百炼精钢铸就，削铁如泥。";
                break;
            case 4:
                this.prop = { gj: 380, max_hp: 3500, str: 35, zj: 320 };
                this.desc = "少林寺长老的戒刀，刀身泛着淡淡佛光，斩妖除魔。";
                this.group_name = "luohan4";
                break;
            case 5:
                this.prop = { gj: 560, gj_per: 10, str: 55, zj: 500, zj_per: 10 };
                this.desc = "少林寺镇派戒刀，刀身刻有金刚经文，挥动间佛光隐现，降魔伏妖。";
                this.group_name = "luohan5";
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { hp_per: 5 };
            if (count == 5) return { fy_per: 8, diff_sh_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { hp_per: 10 };
            if (count == 5) return { fy_per: 10, diff_sh_per: 10 };
        }
    }
}
