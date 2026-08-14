import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '方';
    name = '和氏璧';
    desc = '一方纯白无瑕，宝光闪烁的玉玺， 玺上镌雕上五龙交纽的纹样，手艺巧夺天工，但却旁缺一角，补上黄金。';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.JEWELS;
    distime = 60000;
    prop: PropMap = {
        gj_per: 5,
        fy_per: 5,
        mz_per: 5,
        zj_per: 5,
        desc: '激发和氏璧蕴含的能量减少敌人攻击',
    };

    on_use(me: CHARACTER): boolean {
        const target = me.query_enemy();
        if (!target) return me.notify_fail('你现在没有战斗目标。');
        me.send_room('<hic>$N激发和氏璧，一股刺骨寒气侵入$n经脉！</hic>', target);
        target.add_status({
            id: 'eq/heshibi',
            name: '寒气',
            desc: '和氏璧寒气侵体，攻击下降',
            duration: 10000,
            prop: { gj_per: -20 },
            downside: true,
            override: 2,
        }, me);
        return true;
    }
}
