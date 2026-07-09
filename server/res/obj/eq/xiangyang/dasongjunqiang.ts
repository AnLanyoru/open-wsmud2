import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '大宋军枪';
    desc = '大宋禁军统帅的配枪，枪尖寒光凛冽，一枪出则破敌胆。';
    unit = '杆';
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;

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
                this.prop = { gj: 60, mz: 50 };
                this.desc = '大宋厢军的制式长枪，朴实耐用。';
                break;
            case 3:
                this.prop = { gj: 145, str: 22, mz: 140 };
                this.desc = '大宋边军的精制长枪，久经沙场。';
                break;
            case 4:
                this.prop = { gj: 350, bj_per: 5, str: 35, mz: 320 };
                this.desc = '大宋精锐部队的制式长枪，枪出如龙。';
                break;
            case 5:
                this.prop = { gj: 590, mz: 500, mz_per: 10, str: 55, add_bjsh_per: 10 };
                this.desc = '大宋禁军统帅的配枪，枪尖寒光凛冽，一枪出则破敌胆。';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
