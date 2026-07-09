import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '鲲鹏靴';
    desc = '逍遥派镇派之靴，踏云而行，如鲲鹏遨游九天。';
    unit = '双';
    eq_type = EQUIP_TYPE.SHOES;

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
                this.prop = { fy: 67, dex: 5 };
                this.desc = '逍遥弟子的快靴，轻便舒适，身随意动。';
                break;
            case 3:
                this.prop = { fy: 156, dex: 15, ds: 100 };
                this.desc = '逍遥入室弟子的流云靴，身若流云，无拘无束。';
                break;
            case 4:
                this.prop = { fy: 231, dex: 20, ds: 180, ds_per: 2 };
                this.desc = '逍遥护法的扶风靴，御风而行，万里瞬息。';
                this.group_name = 'kunpeng4';
                break;
            case 5:
                this.prop = { fy: 320, dex: 40, ds: 280, ds_per: 5, diff_busy_per: 10 };
                this.desc = '逍遥长老之靴，踏云而行，如鲲鹏遨游九天。';
                this.group_name = 'kunpeng5';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { dex: 50 };
            if (count == 5) return { ds_per: 8, distime_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { dex: 100 };
            if (count == 5) return { ds_per: 10, distime_per: 10 };
        }
    }
}
