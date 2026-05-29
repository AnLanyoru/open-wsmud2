import { OBJ } from "../../../../os/item/obj.js";

export default class extends OBJ {
    unit = "个";
    name = "师门令牌";
    desc = "可以用来完成师门交给你的任务，限制30难度以前";
    grade = 1;
    value = 0;

    on_create(path, par) {
    if (!par) {
        this.path = path + "#1";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 6)) return;
    this.grade = lv;
    this.desc = "可以用来完成师门交给你的任务，限制" + (10 + this.grade * 20) + "难度以前";
}
}
