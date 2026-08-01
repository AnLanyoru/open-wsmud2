import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '曙光剑';
    desc = '峨眉派镇派宝剑，剑身映照晨光，如曙光初现，破暗除魔。';
    unit = '把';
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;

    on_create(path, par) {
        let lv = 5;
        if (par) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv >= 1 && lv <= 5)) return;
        }
        this.grade = lv;
        this.hole_count = Math.max(0, lv - 1);
        switch (lv) {
            case 1:
                this.prop = { gj: 10 };
                break;
            case 2:
                this.prop = { gj: 55, mz: 35 };
                this.desc = '峨眉弟子的青锋剑，剑走轻灵，锋芒初现。';
                break;
            case 3:
                this.prop = { gj: 132, con: 15, mz: 120 };
                this.desc = '峨眉入室弟子的佩剑，剑光如秋水，寒而不戾。';
                break;
            case 4:
                this.prop = { gj: 300, con: 25, mz: 320, diff_fy_per: 5 };
                this.desc = '峨眉执事的佩剑，剑含佛光，斩业护生。';
                break;
            case 5:
                this.prop = { gj: 490, con: 35, mz: 500, mz_per: 10, diff_fy_per: 6 };
                this.desc = '峨眉长老的佩剑，剑映晨光，如曙光初现，破暗除魔。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
