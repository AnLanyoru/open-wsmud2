import { OBJ } from "../../../os/item/obj.js";

const PROP_NAMES = {
    gj: "攻击之魂",
    fy: "防御之魂",
    mz: "命中精华",
    ds: "闪避精华",
    zj: "招架精华",
};

const PROP_DESCS = {
    gj: "蕴含攻击之力的精华，可用于锻造装备。",
    fy: "蕴含防御之力的精华，可用于锻造装备。",
    mz: "蕴含命中玄机的精华，可用于锻造装备。",
    ds: "蕴含闪避灵动的精华，可用于锻造装备。",
    zj: "蕴含招架之道的精华，可用于锻造装备。",
};

export default class extends OBJ {
    unit = "块";
    value = 100000;
    combined = true;
    transable = true;
    is_stone = true;
    grade = 5;
    otype = 2;

    on_create(path, par) {
        if (par) {
            const key = par.substring(1);
            this.name = PROP_NAMES[key] || (key + "之魂");
            this.desc = PROP_DESCS[key] || ("蕴含" + key + "属性的精华，可用于锻造装备。");
        }
    }
}
