import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "本";
    name = "药王神篇";
    desc = "毒手药王无嗔大师的著作，里面记载了很多药草知识";
    value = 1000;
    eq_type = EQUIP_TYPE.JEWELS;

    on_create(path, par) {
    let lv = 1;
    if (par) {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv > 0 && lv < 7)) return;
    }
    this.grade = lv;
    this.prop = {
        int: [1, 3, 8, 13, 20, 30, 100][lv],
        caiyao1: [1, 5, 10, 15, 20, 25, 30][lv],
        desc: "你更容易采到稀有的药草"
    };
    if (this.grade === 6) {
        this.name = "神农百草经";
        this.desc = "药神神农氏的著作，里面记载了很多药草知识";
    }
    EQUIPMENT.prototype.on_create.apply(this);
}
}

