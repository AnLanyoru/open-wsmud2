import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '鹰刀';
    desc = '破碎虚空后遗留的神器，里面蕴含着无上的武学至理';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 880,
        dex: 200,
        gj_per: 13,
        bj_per: 13,
        diff_fy_per: 15,
        desc: '命中敌人后使对方昏迷3秒，冷却15秒',
    };
    /** 特效冷却（毫秒）。 */
    cd = 15000;
    /** 昏迷持续时间（毫秒） */
    faint_time = 3000;
    /** 高级融合后不可抵抗。 */
    no_diff = false;

    on_create(path?: string, par?: string): void {
        const level = par ? parseInt(par.slice(1), 10) : 1;
        if (level === 2) {
            this.cd = 20000;
            this.no_diff = true;
            this.prop.desc = '命中敌人后使对方昏迷3秒，冷却20秒(不可抵抗)';
        } else if (level === 3) {
            this.cd = 15000;
            this.no_diff = true;
            this.prop.desc = '命中敌人后使对方昏迷3秒，冷却15秒(不可抵抗)';
        } else {
            this.cd = 15000;
            this.no_diff = false;
            this.prop.desc = '命中敌人后使对方昏迷3秒，冷却15秒';
        }
        EQUIPMENT.prototype.on_create.apply(this);
    }

    // 武器钩子只会在当前攻击命中后执行，因此直接昏迷当前目标，不再额外制造群攻伤害。
    do_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
        if (par.no_weapon) return 0;

        // 内置CD，防止高攻速/多目标连续触发
        const cdKey = 'eq/yd_cd';
        if (me.query_temp<number>(cdKey)) return 0;

        me.set_temp(cdKey, 1, this.cd);
        me.send_room(
            '<hir>$N手中的$W沟通天地之力，鹰啸长空，天地之威尽数压向$n！</hir>',
            target,
        );
        target.add_status(
            {
                id: 'eq/yd_faint',
                name: '昏迷',
                desc: '你被鹰刀的天地之力震得昏迷了',
                is_faint: true,
                duration: this.faint_time,
                downside: true,
                no_diff: this.no_diff,
                override: 2,
                start_msg: '<hir>$N只觉得眼前一黑，被天地之力震得昏迷过去...</hir>\n',
                finish_msg: '<hiy>慢慢的$N又恢复了知觉...</hiy>\n',
            },
            me,
        );

        return 0;
    }
}
