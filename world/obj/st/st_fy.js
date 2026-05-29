import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "玄武之魂",
    desc: "传说为玄武残魂所化，非金非石非木，隐隐有玄武虚影，主守护，镇阴阳",
    unit: "块",
    value: 10000000,
    transable: true,
    is_stone: true,
    grade: 6
});
this.otype = 2;
this.on_create = function (path, par) {
    var lv = 5;
    if (!par) {
        lv = 5 - parseInt(Math.log(this.random(400) + 1));
    } else {
        lv = parseInt(par.substr(1));
    }
    this.path = path + "#" + lv;
    switch (lv) {
        case 1:
            this.prop = { fy: 1000 };
            this.desc += "\n防御：+1000";
            break;
        case 2:
            this.prop = { fy: 500, hp_per: 1 };
            this.desc += "\n防御：+500\n气血：+1%";
            break;
        case 3:
            this.prop = { fy_per: 1, hp_per: 1 };
            this.desc += "\n防御：+1%\n气血：+1%";
            break;
        case 4:
            this.prop = { fy_per: 2 };
            this.desc += "\n防御：+2%";
            break;
        case 5:
            this.prop = { hp_per: 2 };
            this.desc += "\n气血：+2%";
            break;
        default:
            this.prop = { fy: 500, max_hp: 5000 };
            this.desc += "\n防御：+500\n气血：+5000";
            break;
    }
}
}
