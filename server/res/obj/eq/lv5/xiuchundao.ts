import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '对';
    name = '绣春刀';
    desc = '这是同一刀鞘的两把短刀，刀身短弯而精悍，双刀柄分别刻着【东厂】二字';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 520,
        dex: 55,
        gjsd_per: 10,
        releasetime_per: 10,
        desc: '增加双刀流武功威力，并将双刀流攻速上限提高到0.25秒',
    };
}
