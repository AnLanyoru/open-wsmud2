import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "贪狼";
    desc = "一颗神秘的宝石";
    unit = "块";
    value = 10000000;
    transable = true;
    combined = true;
    is_stone = true;
    grade = 6;
    prop = {
        str: 1
    };
    otype = 2;

    on_create(path, par) {
    var lv = 0;
    if (par != undefined) {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv >= 0 && lv < 4)) return;
    }
    let val = 120;
    switch (lv) {
        case 0:
            this.name = "真武";
            this.prop = { str: val };
            this.desc = "一颗神秘的宝石\n臂力：+" + val;
            break;
        case 1:
            this.name = "元始";
            this.prop = { con: val };
            this.desc = "一颗神秘的宝石\n根骨：+" + val;
            break;
        case 2:
            this.name = "太清";
            this.prop = { dex: val };
            this.desc = "一颗神秘的宝石\n身法：+" + val;
            break;
        case 3:
            this.name = "天枢";
            this.prop = { int: val };
            this.desc = "一颗神秘的宝石\n悟性：+" + val;
            break;
        default:
            return;
    }
}
}
