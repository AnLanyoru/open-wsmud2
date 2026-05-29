import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "个";
    name = "首席弟子称号";
    desc = "";
    grade = 1;
    value = 1000;

    on_create(path, par) {
    if (!par) return;
    this.family = FAMILIES[par.substr(1)];
}
    on_receive(me) {
    if (!this.family || !this.family.top_name) return;
    me.add_title(this.family.top_name,"family");
    me.notify("<hig>你获得了称号：" + this.family.top_name +"</hig>。");
}
}

const FAMILIES = globalThis.FAMILIES;
