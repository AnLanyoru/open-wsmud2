import { OBJ } from "../../../core/item/obj.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends OBJ {
    unit = "枚";
    name = "养精丹";
    desc = "一枚丹药，吃了后会增加10点精力，但是吃多了会伤肝。";
    ad_jl = 10;
    grade = 1;
    value = 10000;
    max_count = 10;

    on_use(me) {
    //if (this.grade==1&& me.query_temp("jing" + this.grade) >= 10) {
    //    me.notify("<yel>你已经吃太多养精丹了，要注意身体。</yel>");
    //    return false;
    //}
    if (this.grade < 3) return me.notify_fail('养精丹已无法使用。');

    //me.add_temp("jing" + this.grade, 1, UTIL.diff_time());
    me.add_temp("ad_jl", this.ad_jl);
    me.notify("<hiy>你增加了" + this.ad_jl + "点精力。</hiy>");

    return true;
}
    on_create(path, par) {
    if (!par) return;
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 5)) return;
    switch (lv) {
        case 1:
            this.name = "养精丹";
            this.ad_jl = 20;
            this.desc = "一枚丹药，吃了后会增加20点精力，但是吃多了会伤肝。";
            break;
        case 2:
            this.name = "养精丹";
            this.ad_jl = 30;
            this.desc = "一枚丹药，吃了后会增加30点精力，但是吃多了会伤肝。";
            break;
        case 3:
            this.name = "养精丹";
            this.ad_jl = 50;
            this.desc = "一枚丹药，吃了后会增加50点精力，但是吃多了会伤肝。";
            break;
        case 4:
            this.name = "养精丹";
            this.ad_jl = 100;
            this.desc = "一枚丹药，吃了后会增加100点精力，但是吃多了会伤肝。";
            break;
        default:
            this.name = "养精丹";
            this.ad_jl = 10;
            this.desc = "一枚丹药，吃了后会增加10点精力，但是吃多了会伤肝。";
            break;
    }
    this.grade = lv + 1;
}
}

