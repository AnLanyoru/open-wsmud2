import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '罗汉僧鞋';
    desc = '少林寺镇派僧鞋，以灵兽皮制成，轻便坚韧，踏石留印。';
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
                this.prop = { fy: 8 };
                break;
            case 2:
                this.prop = { fy: 67, str: 5 };
                this.desc = '少林沙弥的粗布僧鞋，结实耐磨，脚踏实地。';
                break;
            case 3:
                this.prop = { fy: 156, str: 15, max_hp: 2000 };
                this.desc = '少林武僧的僧鞋，内衬软皮，千里不倦。';
                break;
            case 4:
                this.prop = { fy: 231, max_hp: 3500, dex: 20, str: 25 };
                this.desc = '少林首座的僧鞋，步步生根，稳如泰山。';
                this.group_name = 'luohan4';
                break;
            case 5:
                this.prop = { fy: 320, fy_per: 5, str: 45, dex: 40, hp_per: 5 };
                this.desc = '少林长老的僧鞋，灵兽皮制成，轻便坚韧，踏石留印。';
                this.group_name = 'luohan5';
                break;
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    group_prop(count: number) {
        if (this.grade == 4) {
            if (count == 3) return { hp_per: 5 };
            if (count == 5) return { fy_per: 8, diff_sh_per: 8 };
        } else if (this.grade == 5) {
            if (count == 3) return { hp_per: 10 };
            if (count == 5) return { fy_per: 10, diff_sh_per: 10 };
        }
    }
}
