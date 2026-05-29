import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "朱果",
    desc: "一颗红色果子，吃了增加500经验，500潜能",
    grade: 1,
    exp: 500,
    pot: 500,
    value: 1000
});
this.transable = true;
this.on_use = function (me) {
    me.notify("你吞下一颗" + this.color_name + "。");
    me.add_exp(this.exp, this.pot);
    return true;
}
this.on_create = function (path, par) {
    if (!par) {
        this.path = path + "#0";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 5)) return;
    switch (lv) {
        case 1:
            this.name = "朱果";
            this.exp = 6000;
            this.pot = 5000;
            this.value = 5000;
            this.desc = "一颗红色果子，吃了增加6000经验，5000潜能";
            break;
        case 2:
            this.name = "朱果";
            this.exp = 15000;
            this.pot = 10000;
            this.value = 10000;
            this.desc = "一颗红色果子，吃了增加15000经验，10000潜能";
            break;
        case 3:
            this.name = "朱果";
            this.exp = 50000;
            this.pot = 20000;
            this.value = 50000;
            this.desc = "一颗红色果子，吃了增加50000经验，20000潜能";
            break;
        case 4:
            this.name = "朱果";
            this.exp = 120000;
            this.pot = 40000;
            this.value = 120000;
            this.desc = "一颗红色果子，吃了增加120000经验，40000潜能";
            break;
        default:
            this.name = "朱果";
            this.exp = 500;
            this.pot = 500;
            this.value = 1000;
            this.desc = "一颗红色果子，吃了增加500经验，500潜能";
            break;
    }
    this.grade = lv + 1;
}
}
