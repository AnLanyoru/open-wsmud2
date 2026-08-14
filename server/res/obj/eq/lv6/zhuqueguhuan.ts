import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends EQUIPMENT {
    unit = '只';
    name = '朱雀骨环';
    desc = '妖神朱雀的遗骨所制的手环，环身火焰缭绕，锋芒毕露';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WRIST;
    distime = 30000;
    prop: PropMap = {
        int: 200,
        diff_fy_per: 14,
        mz_per: 14,
        expend_mp_per: -10,
        add_sh_per: 10,
        desc: '释放积蓄在手环中的朱雀神力',
    };

    on_use(me: CHARACTER): boolean {
        // 文档原文只作为面板描述；伤害规则在此处实现。
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) return me.notify_fail('附近没有可以承受朱雀神力的敌人。');
        const percent = 10 + this.level;
        me.send_room('<hir>$N腕间的朱雀骨环化作烈焰，朱雀虚影振翅横扫四方！</hir>');
        for (const enemy of enemies) {
            const damage = Math.floor((enemy.max_hp - enemy.hp) * percent / 100);
            if (damage <= 0) continue;
            enemy.damage3(damage, me);
            enemy.send_combat('<hir>朱雀神火造成了' + damage + '点伤害！</hir>\n');
            if (enemy.hp <= 0) {
                enemy.die(me);
                enemy.end_fight();
            }
        }
        return true;
    }
}
