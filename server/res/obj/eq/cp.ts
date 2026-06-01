import { EQUIPMENT } from "../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../core/const.js";

const TYPE_INFO = {
    sword: { name: "长剑", desc: "一把手工锻造的长剑", unit: "把", weapon_type: WEAPON_TYPE.SWORD },
    blade: { name: "长刀", desc: "一把手工锻造的长刀", unit: "把", weapon_type: WEAPON_TYPE.BLADE },
    club: { name: "长棍", desc: "一根手工锻造的长棍", unit: "根", weapon_type: WEAPON_TYPE.CLUB },
    staff: { name: "长杖", desc: "一根手工锻造的长杖", unit: "根", weapon_type: WEAPON_TYPE.STAFF },
    whip: { name: "长鞭", desc: "一根手工锻造的长鞭", unit: "根", weapon_type: WEAPON_TYPE.WHIP },
    none: { name: "拳套", desc: "一副手工锻造的拳套", unit: "副", weapon_type: WEAPON_TYPE.NONE },
};

export default class extends EQUIPMENT {
    unit = "把";
    name = "自制武器";
    desc = "一把手工锻造的武器";
    value = 100000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;

    on_create(path, par) {
        if (par) {
            const key = par.substring(1);
            const info = TYPE_INFO[key];
            if (info) {
                this.name = info.name;
                this.desc = info.desc;
                this.unit = info.unit;
                this.weapon_type = info.weapon_type;
            }
        }
    }
}
