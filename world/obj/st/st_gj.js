import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    name = "朱雀之魂";
    desc = "传说为朱雀残魂所化，非金非石非木，隐隐有朱雀虚影，主毁灭，镇邪祟";
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
            this.prop = { add_sh_per: 1, mz: 300 };
            this.desc += "\n最终伤害：+1%\n命中：+300";
            break;
        case 2:
            this.prop = { add_bjsh_per: 5 };
            this.desc += "\n暴击伤害：+5%";
            break;
        case 3:
            this.prop = { add_bjsh_per: 3, add_sh_per: 1 };
            this.desc += "\n暴击伤害：+3%\n最终伤害：+1%";
            break;
        case 4:
            this.prop = { bj_per: 1 };
            this.desc += "\n暴击：+1%";
            break;
        case 5:
            this.prop = { add_sh_per: 2 };
            this.desc += "\n最终伤害：+2%";
            break;
        default:
            this.prop = { mz: 300, add_bjsh_per: 3 };
            this.desc += "\n暴击伤害：+3%\n命中：+300";
            break;
    }
}
}
