import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    name = "青龙之魂";
    desc = "传说为青龙残魂所化，非金非石非木，隐隐有青龙虚影，主统御，镇八荒";
    unit = "块";
    value = 10000000;
    transable = true;
    is_stone = true;
    grade = 6;
    otype = 2;

    on_create(path, par) {
    var lv = 5;
    if (!par) {
        lv = 5 - parseInt(Math.log(this.random(400) + 1));
    } else {
        lv = parseInt(par.substr(1));
    }
    this.path = path + "#" + lv;
    switch (lv) {
        case 1:
            this.prop = { zj: 1000 };
            this.desc += "\n招架：+1000";
            break;
        case 2:
            this.prop = { ds: 1000 };
            this.desc += "\n躲闪：+1000";
            break;
        case 3:
            this.prop = { gj_per: 1, ds_per: 1 };
            this.desc += "\n攻击：+1%\n躲闪：+1%";
            break;
        case 4:
            this.prop = { zj_per: 2 };
            this.desc += "\n招架：+2%";
            break;
        case 5:
            this.prop = { ds_per: 2 };
            this.desc += "\n躲闪：+2%";
            break;
        default:
            this.prop = { ds: 500, zj: 500 };
            this.desc += "\n躲闪：+500\n招架：+500";
            break;
    }
}
}
