import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '昊天靴';
    desc = '华山至宝，追风踏月';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.SHOES;
    distime = 60000;
    prop: PropMap = {
        fy: 380,
        str: 100,
        dex: 100,
        diff_busy_per: 20,
        ds_per: 10,
    };

    on_use(me: CHARACTER): boolean {
        me.clear_downside(true);
        me.send_room('<hig>$N脚下清风骤起，昊天靴涤尽周身邪祟，身形再不受拘束！</hig>');
        me.add_status({
            id: 'eq/haotian',
            name: '追风',
            desc: '昊天靴护持自身，免疫控制效果',
            duration: 10000,
            ig_control: true,
            override: 2,
        });
        return true;
    }
}
