import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '曙光束腰';
    desc = '峨眉派镇派束腰，金丝玉缕，束腰而立如青松。';
    unit = '条';
    eq_type = EQUIP_TYPE.WAIST;

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
                this.prop = { fy: 45, dex: 6 };
                this.desc = '峨眉弟子的素带，束腰而立，初具风骨。';
                break;
            case 3:
                this.prop = { fy: 120, dex: 12, int: 12 };
                this.desc = '峨眉入室弟子的飘带，轻灵飘逸，身如拂柳。';
                break;
            case 4:
                this.prop = { fy: 235, con: 21, int: 21, diff_busy_per: 5 };
                this.desc = '峨眉执事的束腰，外柔内刚，邪魔不侵。';
                this.group_name = 'shuguang4';
                break;
            case 5:
                this.prop = {
                    fy: 356,
                    con: 32,
                    int: 30,
                    diff_busy_per: 10,
                    dazuo_per: 10,
                };
                this.desc = '峨眉长老的束腰，金丝玉缕，束腰而立如青松。';
                this.group_name = 'shuguang5';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { con: 50 };
            if (count == 5) return { hp_per: 5, diff_fy_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { con: 100 };
            if (count == 5) return { hp_per: 10, diff_fy_per: 10 };
        }
    }
}
