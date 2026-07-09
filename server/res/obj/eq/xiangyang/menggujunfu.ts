import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '蒙古军服';
    desc = '蒙古铁骑的制式皮甲，以草原兽皮鞣制，轻便而坚韧。';
    unit = '件';
    eq_type = EQUIP_TYPE.CLOTH;

    on_create(path, par) {
        let lv = 5;
        if (par) {
            par = par.slice(1);
            lv = parseInt(par);
            if (!(lv >= 2 && lv <= 5)) return;
        }
        this.grade = lv;
        this.hole_count = Math.max(0, lv - 1);
        switch (lv) {
            case 2:
                this.prop = { fy: 120, con: 8 };
                this.desc = '蒙古牧民穿的简陋皮袄。';
                break;
            case 3:
                this.prop = { fy: 220, con: 15, max_hp: 1800 };
                this.desc = '蒙古轻骑的皮甲，狼皮制成。';
                break;
            case 4:
                this.prop = { fy: 340, max_hp: 4800, con: 25, str: 25 };
                this.desc = '蒙古精锐骑兵的皮甲，驰骋草原的标配。';
                break;
            case 5:
                this.prop = { fy: 450, zj: 430, hp_per: 10, str: 36, con: 69 };
                this.desc = '蒙古铁骑的制式皮甲，以草原兽皮鞣制，轻便而坚韧。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
