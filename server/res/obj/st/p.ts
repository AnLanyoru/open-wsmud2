import { OBJ } from '../../../core/item/obj.js';
import { CUSTOM_PROPS, query_material_name } from '../../cmd/obj/reforge.js';

export default class extends OBJ {
    unit = '块';
    value = 100000;
    combined = true;
    transable = true;
    grade = 5;
    otype = 2;

    on_create(_path: string, par?: string): void {
        const key = par?.substring(1) ?? '';
        if (!CUSTOM_PROPS[key]) {
            this.name = '无效属性石';
            this.desc = '这块属性石已经失去了作用。';
            return;
        }
        this.name = query_material_name(key);
        this.desc = '蕴含' + this.name + '力量的材料，可用于重铸自制装备。';
    }
}
