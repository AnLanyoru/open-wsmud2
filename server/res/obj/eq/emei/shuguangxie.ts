import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '曙光鞋';
    desc = '峨眉派镇派之履，步履轻盈，踏光而行。';
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
                break;
            case 2:
                this.prop = { fy: 80, dex: 6 };
                this.desc = '峨眉弟子的布履，轻便无声，踏雪无痕。';
                break;
            case 3:
                this.prop = { fy: 186, dex: 12, con: 12 };
                this.desc = '峨眉入室弟子的云履，步履轻盈，如行云端。';
                break;
            case 4:
                this.prop = { fy: 290, dex: 21, con: 18, int: 20 };
                this.desc = '峨眉执事的莲履，步步生莲，心定神闲。';
                this.group_name = 'shuguang4';
                break;
            case 5:
                this.prop = { fy: 356, dex: 32, con: 35, int: 35, max_hp: 3500 };
                this.desc = '峨眉长老之履，步履轻盈，踏光而行。';
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
