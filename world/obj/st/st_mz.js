import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    name: "白虎之魂",
    desc: "传说为白虎残魂所化，非金非石非木，隐隐有白虎虚影，主杀伐，镇四方",
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
            this.prop = { gj: 500 };
            this.desc += "\n攻击：+500";
            break;
        case 2:
            this.prop = { mz: 500 };
            this.desc += "\n命中：+500";
            break;
        case 3:
            this.prop = { gj_per: 1, mz_per: 1 };
            this.desc += "\n攻击：+1%\n命中：+1%";
            break;
        case 4:
            this.prop = { gj_per: 2 };
            this.desc += "\n攻击：+2%";
            break;
        case 5:
            this.prop = { mz_per: 2 };
            this.desc += "\n命中：+2%";
            break;
        default:
            this.prop = { gj: 300, mz: 300 };
            this.desc += "\n命中：+300\n攻击：+300";
            break;
    }
}
}
