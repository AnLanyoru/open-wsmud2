import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '曙光护腕';
    desc = '峨眉派镇派护腕，白金光华闪耀，攻时如雷霆万钧。';
    unit = '对';
    eq_type = EQUIP_TYPE.WRIST;

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
                this.prop = { fy: 50, mz: 20 };
                this.desc = '峨眉弟子的布腕，轻巧贴身，不碍出招。';
                break;
            case 3:
                this.prop = { fy: 115, mz: 40, zj: 45 };
                this.desc = '峨眉入室弟子的银腕，腕动如风，招招精准。';
                break;
            case 4:
                this.prop = { fy: 210, mz: 100, zj: 100, bj_per: 2 };
                this.desc = '峨眉执事的护腕，出手如电，直取要害。';
                this.group_name = 'shuguang4';
                break;
            case 5:
                this.prop = { fy: 310, mz: 180, zj: 200, bj_per: 4, add_bjsh_per: 20 };
                this.desc = '峨眉长老的护腕，白金光华闪耀，攻如雷霆万钧。';
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
