import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "条";
    name = "鲢鱼";
    desc = "一条活蹦乱跳的鲢鱼";
    value = 100;
    transable = true;
    otype = 3;

    on_create(path, par) {
    if (!par) {
        par = 0;
    } else
        par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv >= 0 && lv < 18)) return;
    this.name = ["鲢鱼", "草鱼", "鲤鱼", "鳊鱼", "鲮鱼", "鲂鱼", "黄颡鱼", "黄金鳉",
        "太湖银鱼", "反天刀", "虹鳟", "孔雀鱼", "罗汉鱼", "银龙鱼", "黑龙鱼", "七星刀鱼",
        "巨骨舌鱼", "帝王老虎魟"][lv];
    this.grade = Math.floor(lv / 3);
    this.value = [500, 1000, 5000, 10000, 50000, 100000, 680000][this.grade];
    this.desc = "一条活蹦乱跳的" + this.name;
}
}
