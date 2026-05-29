import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "粒";
    name = "培元丹";
    grade = 1;
    desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你10点内力上限";
    value = 10000;
    add_mp = 10;
    transable = true;

    on_use(me) {
    me.send_room("<hir>$N吞下了一颗培元丹。</hir>");
    me.limit_mp += this.add_mp;
    me.notify("<hiw>你的内力上限增加了" + this.add_mp + "。</hiw>");
}
    on_create(path, par) {
    if (!par) {
        this.path = path + "#0";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 5)) return;
    switch (lv) {
        case 1:
            this.add_mp = 20;
            this.value = 10000;
            this.desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你20点内力上限";
            break;
        case 2:
            this.add_mp = 50;
            this.value = 25000;
            this.desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你50点内力上限";
            break;
        case 3:
            this.add_mp = 100;
            this.value = 50000;
            this.desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你100点内力上限";
            break;
        case 4:
            this.add_mp = 200;
            this.value = 100000;
            this.desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你200点内力上限";
            break;
        default:
            this.add_mp = 10;
            this.value = 5000;
            this.desc = "江湖中各大门派用来给弟子们拓展经脉的丹药，使用后会增加你10点内力上限";
            break;
    }
    this.grade = lv + 1;
}
}
