import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '条';
    name = '缚神索';
    desc = '丐帮至宝，缚神灭鬼';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WAIST;
    distime = 60000;
    prop: PropMap = {
        desc: '使用后束缚附近敌人10秒',
    };

    on_use(me: CHARACTER): boolean {
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) return me.notify_fail('附近没有可以束缚的敌人。');
        me.send_room('<hiy>$N抖开缚神索，万千金光如游龙般缠向四周敌人！</hiy>');
        for (const enemy of enemies) {
            enemy.add_status({
                id: 'busy',
                name: '忙乱',
                desc: '你被缚神索牢牢束缚',
                duration: 10000,
                is_busy: true,
                downside: true,
                override: 2,
            }, me);
        }
        return true;
    }
}
