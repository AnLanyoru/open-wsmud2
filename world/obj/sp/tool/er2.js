import { OBJ } from "../../../../os/item/obj.js";

export default class extends OBJ {
    unit = "包";
    name = "鱼饵";
    desc = "一些钓鱼用到的鱼饵，可能有50-100个同品质鱼饵";
    value = 100;
    transable = true;

    on_create(path, par) {
    if (!par) return;
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 6)) return;
    this.grade = lv;
    this.value = lv * 10000;
}
    on_open(me) {

    var result = [
        {
            obj: 'sp/tool/er#' + this.grade, min: 50, max: 100
        }
    ];

    return OBJ.create_by_odds(result);
}
}
