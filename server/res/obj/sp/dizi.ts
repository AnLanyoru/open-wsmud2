import { OBJ } from '../../../core/item/obj.js';
import { FAMILIES, FAMILY } from '../../../core/skill/family.js';

export default class extends OBJ {
    unit = '个';
    name = '首席弟子称号';
    desc = '';
    grade = 1;
    value = 1000;
    family: FAMILY;

    on_create(path: string, par: string) {
        if (!par) return;
        this.family = FAMILIES[par.slice(1)];
    }

    on_receive(me) {
        if (!this.family || !this.family.top_name) return;
        me.add_title(this.family.top_name, 'family');
        me.notify('<hig>你获得了称号：' + this.family.top_name + '</hig>。');
    }
}
