import { OBJ } from "../../../../os/item/obj.js";
import { WORLD } from "../../../../os/world.js";
import { EVENTS } from "../../../../os/task/events.js";
import { COMMAND } from "../../../../os/command.js";

export default class extends OBJ {
    unit = "本";
    name = "挖矿指南";
    desc = "一本书，里面记载的挖矿的方法，提高你的挖矿效率";
    grade = 1;
    value = 10000;

    on_use(me) {
    me.notify("你打开这本挖矿指南仔细研究起来....");
    COMMAND.DO('sys', me.name + '捡到一本挖矿指南，学会了里面记载的挖矿技巧，所有人的挖矿效率都提高了。');

    let lv = WORLD.DATA.query_temp("kuang_exp", 0);
    let value = this.grade * 10;
    if (lv > value) return;
    WORLD.DATA.set_temp("kuang_exp", value, 600000);

    EVENTS.add({
        id: "wkzn",
        name: "挖矿指南",
        desc: me.name + '学会了新的挖矿技巧，所有人的挖矿效率都提高了，获得经验+' + value + '。',
        time: Date.now() + 600000,
        grade: this.grade
    });
    return true;
}
    on_create(path, par) {
    if (!par) {
        this.path = path + "#1";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 6)) return;
    this.grade = lv;
}
}

