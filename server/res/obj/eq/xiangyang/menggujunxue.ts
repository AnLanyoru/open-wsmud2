import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '蒙古军靴';
    desc = '蒙古铁骑的制式马靴，牛皮为面，马鬃为衬，踏遍草原如履平地。';
    unit = '双';
    eq_type = EQUIP_TYPE.SHOES;

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
                this.prop = { fy: 8, con: 1 };
                this.desc = '蒙古士兵穿的旧皮靴，沾满了草原尘土。';
                break;
            case 2:
                this.prop = { fy: 67, con: 5 };
                this.desc = '蒙古牧民的旧皮靴，缝缝补补。';
                break;
            case 3:
                this.prop = { fy: 160, con: 10, dex: 12 };
                this.desc = '蒙古轻骑的马靴，久经磨损。';
                break;
            case 4:
                this.prop = { fy: 290, str: 21, con: 18, ds: 220 };
                this.desc = '蒙古精锐骑兵的马靴，结实耐磨。';
                break;
            case 5:
                this.prop = { gj: 456, fy_per: 8, zj: 320, str: 32, con: 35 };
                this.desc = '蒙古铁骑的制式马靴，牛皮为面，马鬃为衬，踏遍草原如履平地。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
