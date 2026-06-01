import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";

export default class extends OBJ {
    name = "碎裂的红宝石";
    desc = "一块红色的宝石，里面有些神秘的力量";
    unit = "块";
    value = 100;
    combined = true;
    is_stone = true;
    transable = true;
    combine_count = 10;
    combine_to = "st/st_red#1";
    grade = 1;
    prop = {
        gj: 1
    };
    otype = 2;

    on_create(path, par) {
    var lv = 0;
    if (!par) {
        this.path = path + "#0";
    } else {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;
    }
    this.value = WORLD.DATA.stone_values[lv];
    switch (lv) {
        case 1:
            this.name = "红宝石";
            this.prop = { gj: 10 };
            break;
        case 2:
            this.name = "精致的红宝石";
            this.prop = { gj: 50 };
            break;
        case 3:
            this.name = "完美的红宝石";
            this.prop = { gj: 100 };
            break;
        case 4:
            this.name = "攻击之石";
            this.prop = { gj: 200 };
            break;
        default:
            this.name = "碎裂的红宝石";
            this.prop = { gj: 1 };
            break;
    }

    this.grade = lv + 1;
    if (lv < 4) {
        this.combine_count = 10
        this.combine_to = path + "#" + (lv + 1);
        this.desc = this.desc + "，十块可以合成高级宝石。";

    } else {
        this.combine_to = "st/st_gj";
    }
    this.desc += "\n攻击：+" + this.prop.gj;
}
}

