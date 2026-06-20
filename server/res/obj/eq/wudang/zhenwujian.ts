import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "真武剑";
    desc = "武当派镇派宝剑，剑身修长，剑柄刻有太极八卦图案，剑出如龙吟。";
    unit = "把";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;

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
                this.prop = { gj: 55, zj: 40 };
                this.desc = "武当派正式弟子的制式配剑，剑身轻盈灵动。";
                break;
            case 3:
                this.prop = { gj: 132, str: 25, zj: 120 };
                this.desc = "武当派精英弟子的配剑，以精钢百炼而成，锐利异常。";
                break;
            case 4:
                this.prop = { gj: 290, str: 35, zj: 320, busy: 1000 };
                this.desc = "武当派长老的佩剑，剑身隐现太极流光，出剑可扰敌心神。";
                this.group_name = "zhenwu4";
                break;
            case 5:
                this.prop = { gj: 460, str: 55, zj: 500, zj_per: 10, busy: 3000 };
                this.desc = "武当派镇派宝剑，剑身修长，剑柄刻有太极八卦图案，剑出如龙吟。";
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
