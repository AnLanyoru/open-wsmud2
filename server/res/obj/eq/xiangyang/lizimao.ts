import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '笠子帽';
    desc = '蒙古铁骑的制式毡帽，宽阔遮阳，驰骋大漠的必备之物。';
    unit = '顶';
    eq_type = EQUIP_TYPE.HEAD;

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
                this.prop = { fy: 76, con: 6 };
                this.desc = '蒙古牧民编的草帽，聊胜于无。';
                break;
            case 3:
                this.prop = { fy: 150, con: 12, gj: 65 };
                this.desc = '蒙古轻骑的毡帽，遮风挡雨。';
                break;
            case 4:
                this.prop = { fy: 290, gj: 128, con: 21, hp_per: 5 };
                this.desc = '蒙古精锐骑兵的毡帽，粗犷实用。';
                break;
            case 5:
                this.prop = { gj: 228, fy: 356, fy_per: 8, con: 32, hp_per: 10 };
                this.desc = '蒙古铁骑的制式毡帽，宽阔遮阳，驰骋大漠的必备之物。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
