import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '邪帝舍利';
    desc =
        '传说中「邪极宗」一脉相传的黄色晶体，为历代魔门圣君于临死前，将毕生元精灌注其中，所以蕴含了数代魔君元精及元气。';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        con: 100,
        dazuo_per: 13,
        limit_mp: 30000,
    };
}
