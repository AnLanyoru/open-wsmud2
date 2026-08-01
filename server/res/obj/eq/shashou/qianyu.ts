import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '千羽';
    desc = '杀手楼秘制暗器，薄如蝉翼，出手时千影纷飞，令人防不胜防。';
    unit = '匣';
    eq_type = EQUIP_TYPE.THROWING;
    weapon_type = WEAPON_TYPE.THROWING;

    on_create(path: string, par?: string) {
        let grade = 5;
        if (par) grade = parseInt(par.slice(1));
        if (!(grade >= 1 && grade <= 5)) grade = 1;

        this.grade = grade;
        this.hole_count = Math.max(0, grade - 1);
        switch (grade) {
            case 1:
                this.prop = { gj: 20, mz: 10 };
                break;
            case 2:
                this.prop = { gj: 40, mz: 30, bj_per: 1 };
                break;
            case 3:
                this.prop = { gj: 100, mz: 80, bj_per: 3 };
                break;
            case 4:
                this.prop = { gj: 200, mz: 150, bj_per: 5, add_bjsh_per: 10 };
                break;
            case 5:
                this.prop = { gj: 320, mz: 210, dex: 30, bj_per: 8, add_bjsh_per: 16 };
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }
}
