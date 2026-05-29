import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    name = "碎裂的贪狼";
    desc = "一颗神秘的宝石";
    unit = "块";
    value = 10000;
    combined = true;
    is_stone = true;
    transable = true;
    grade = 3;
    prop = {
        str: 1
    };
    otype = 2;

    on_create(path, par) {
    var lv = 0;
    if (par != undefined) {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv >= 0 && lv < 8)) return;
    }
    var val = lv % 2 == 0 ? 10 : 40;
    var stype = parseInt(lv / 2);
    switch (stype) {
        case 0:
            this.name = "破军";
            this.prop = { str: val };
            this.desc = "一颗神秘的宝石\n臂力：+" + val;
            break;
        case 1:
            this.name = "贪狼";
            this.prop = { con: val };
            this.desc = "一颗神秘的宝石\n根骨：+" + val;
            break;
        case 2:
            this.name = "七杀";
            this.prop = { dex: val };
            this.desc = "一颗神秘的宝石\n身法：+" + val;
            break;
        case 3:
            this.name = "紫薇";
            this.prop = { int: val };
            this.desc = "一颗神秘的宝石\n悟性：+" + val;
            break;
        default:
            return;
    }
    if (lv % 2 == 0) {
        this.name = "碎裂的" + this.name;
        this.combine_count = 10
        this.combine_to = path + "#" + (lv + 1);
        this.desc = this.desc + "\n十块可以合成高级宝石。";
        this.grade = 4;
        this.value = WORLD.DATA.stone_values[3];
    } else {
        this.value = WORLD.DATA.stone_values[4];
        this.grade = 5;
        this.combine_count = 10
        this.combine_to = "st/st_s2#" + stype;
        this.desc = this.desc + "\n十块可以合成高级宝石。";
    }
}
}

const WORLD = globalThis.WORLD;
