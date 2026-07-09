import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    name = '罗汉僧袍';
    desc = '少林寺镇派僧袍，以金刚丝织就，水火不侵，护身如金刚加身。';
    unit = '件';
    eq_type = EQUIP_TYPE.CLOTH;

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
                this.prop = { fy: 120, str: 5 };
                this.desc = '少林沙弥的灰布僧袍，朴素无华，初悟禅机。';
                break;
            case 3:
                this.prop = { fy: 220, str: 15, max_hp: 2000 };
                this.desc = '少林武僧的厚布僧袍，暗含护体之力，坚如磐石。';
                break;
            case 4:
                this.prop = { fy: 320, max_hp: 4500, con: 20, str: 25 };
                this.desc = '少林首座的袈裟，金刚经文护体，邪魔不侵。';
                this.group_name = 'luohan4';
                break;
            case 5:
                this.prop = { fy: 420, hp_per: 2, str: 35, con: 30, diff_sh_per: 8 };
                this.desc = '少林长老的僧袍，金刚丝织就，水火不侵，如金刚加身。';
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
