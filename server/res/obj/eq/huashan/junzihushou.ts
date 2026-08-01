import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '君子护手';
    desc = '华山派镇派护手，轻钢打造，灵巧中蕴藏杀机。';
    unit = '对';
    eq_type = EQUIP_TYPE.WRIST;

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
                this.prop = { fy: 5 };
                break;
            case 2:
                this.prop = { fy: 30, gj: 15 };
                this.desc = '华山弟子的轻护手，薄如蝉翼，灵巧自如。';
                break;
            case 3:
                this.prop = { fy: 72, gj: 30, mz: 30 };
                this.desc = '华山入室弟子的精钢护手，攻防兼备，出剑更快。';
                break;
            case 4:
                this.prop = { fy: 168, gj: 60, mz: 60, releasetime_per: 5 };
                this.desc = '华山护法的银丝护手，剑随意动，一瞬制敌。';
                this.group_name = 'junzi4';
                break;
            case 5:
                this.prop = {
                    fy: 280,
                    gj: 120,
                    mz: 120,
                    releasetime_per: 10,
                    add_sh_per: 5,
                };
                this.desc = '华山长老的护手，轻钢为骨，灵巧中暗藏杀机。';
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
