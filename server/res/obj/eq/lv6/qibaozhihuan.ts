import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '七宝指环';
    desc = '逍遥至宝，七宝指环';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        gj_per: 10,
        mz_per: 10,
        bj_per: 10,
        releasetime: 2000,
        distime: 2000,
        desc: '每5秒恢复你5%的内力',
    };

    on_eq(me: CHARACTER): void {
        me.add_event('on_heart_beat', this.on_heart_beat_qi_bao);
    }

    on_uneq(me: CHARACTER): void {
        me.remove_event('on_heart_beat', this.on_heart_beat_qi_bao);
    }
    on_heart_beat_qi_bao(this: CHARACTER, dt: number): void {
        if (this.hp <= 0) return;
        const mp = this.add_mp(int(this.max_mp * 0.05));
        if (mp > 0) {
            this.send_room('<ds-hib>$N的七宝指环发散出阵阵柔光，精神看上去好了许多</ds-hib>');
            this.notify('<hig>你恢复了' + mp + '点内力。</hig>');
        }
    }
}
