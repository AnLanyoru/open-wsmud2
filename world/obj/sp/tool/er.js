import { OBJ } from "../../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "个",
    name: "鱼饵",
    desc: "一些钓鱼用到的鱼饵",
    value: 100,
    consume: 5000
});
this.transable = true;
//this.value = [500, 1000, 5000, 10000, 50000, 100000, 680000][this.grade];
this.on_create = function (path, par) {
    if (!par) return;
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 6)) return;
    this.grade = lv;
    switch (lv) {
        case 2:
            this.value = 200;
            this.consume = 15000;
            break;
        case 3:
            this.value = 300;
            this.consume = 20000;
            break;
        case 4:
            this.value = 400;
            this.consume = 25000;
            break;
        case 5:
            this.value = 500;
            this.consume = 30000;
            break;
        default:
            this.value = 100;
            this.consume = 10000;
            break;
    }
}
}
