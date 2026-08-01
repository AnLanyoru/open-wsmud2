import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '君子青衫';
    desc = '华山派镇派青衫，以天蚕丝织就，飘逸如风，君子如玉。';
    unit = '件';
    eq_type = EQUIP_TYPE.CLOTH;

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
                this.prop = { fy: 12 };
                break;
            case 2:
                this.prop = { fy: 120, dex: 10 };
                this.desc = '华山弟子的青衫，简洁利落，君子初成。';
                break;
            case 3:
                this.prop = { fy: 220, dex: 15, str: 10 };
                this.desc = '华山入室弟子的青衫，衣袂轻扬，风度翩翩。';
                break;
            case 4:
                this.prop = { fy: 320, dex: 20, str: 25, releasetime_per: 5 };
                this.desc = '华山护法的青衫，气韵飘逸，出招收放随心。';
                this.group_name = 'junzi4';
                break;
            case 5:
                this.prop = {
                    fy: 420,
                    dex: 35,
                    str: 35,
                    diff_sh: 500,
                    releasetime_per: 10,
                };
                this.desc = '华山长老的青衫，天蚕丝织就，飘逸如风，君子如玉。';
                this.group_name = 'junzi5';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { dex: 50 };
            if (count == 5) return { mz_per: 8, diff_busy_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { dex: 100 };
            if (count == 5) return { mz_per: 10, diff_busy_per: 10 };
        }
    }
}
