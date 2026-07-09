import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '大宋军服';
    desc = '大宋禁军的制式军服，内衬锁子甲，外罩红袍，威武不凡。';
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
                this.desc = '大宋厢军的布甲，聊胜于无。';
                break;
            case 3:
                this.prop = { fy: 220, con: 15, ds: 110 };
                this.desc = '大宋边军的皮甲，轻便实用。';
                break;
            case 4:
                this.prop = { fy: 340, ds: 201, con: 25, str: 25 };
                this.desc = '大宋精锐步兵的制式军服，厚实耐用。';
                break;
            case 5:
                this.prop = { fy: 450, ds: 301, ds_per: 10, str: 36, con: 69 };
                this.desc = '大宋禁军的制式军服，内衬锁子甲，外罩红袍，威武不凡。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
