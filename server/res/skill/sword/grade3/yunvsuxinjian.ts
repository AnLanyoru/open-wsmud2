import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 90 */
export default class extends SKILL {
    name = '玉女素心剑';
    id = 'yunvsuxinjian';
    grade = 3;

    desc = '古墓派武学，玉女剑法与全真剑法合璧而成';
    can_enables = ['sword'];
    attack_actions = [
        '$N手中$W一振，剑光如<HIW>素练</HIW>横空，清冷绝俗，转瞬间长剑已至$n的$l',
        '$N$W斜引，剑势<HIW>轻盈</HIW>如仙，如姑射仙子凌波微步，剑光缥缈中刺向$n$l',
        '$N剑招<HIW>连绵</HIW>不断，如<HIW>月宫仙子</HIW>翩翩起舞，令人目眩神驰',
        '$N$W一抖，剑光化作<HIW>点点寒星</HIW>，刚柔并济，向$n的$l挥洒而去',
        '$N身形旋转，$W划出一道<HIW>优美</HIW>弧线，如天女凌空，剑光洒向$n的$l',
    ];
    slots = [
        {
            prop: 'sjhb_gj',
            value: (lv: number) => 50,
            format: (val: number) => '双剑合璧附加的基础攻击力提高50%',
        },
        {
            prop: 'sjhb_mz',
            value: (lv: number) => 50,
            format: (val: number) => '双剑合璧附加的基础命中提高50%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 1.5),
                mz: 10 + Math.floor(lv * 1.6),
                dex: 10 + Math.floor(lv / 6),
            },
        };
    }

    pfm_set: PerformData = {
        he: {
            name: '双剑合璧',
            distime: 60000,
            enable_skill: 'sword',
            mp: 100,
            release_time: 1000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const wp_prop = me.query_weapon()?.prop
                if (!wp_prop) return me.notify_fail("你的武器无法进行双剑合璧");
                var duration = calcSJHBDuration(lv);
                me.send_room(
                    '<HIW>$N左手变换玉女剑招，右手使全真剑招，双剑交错，剑光交织如虹</HIW>',
                    target,
                );
                const prop = Object.create(wp_prop);
                const mz_pr = me.query_prop("sjhb_mz");
                const gj_pr = me.query_prop("sjhb_gj");
                if (mz_pr && prop.mz > 0) prop.mz = int(prop.mz * (1 + gj_pr / 100));
                if (gj_pr && prop.gj > 0) prop.gj = int(prop.gj * (1 + gj_pr / 100));
                me.add_status(
                    {
                        id: 'yunvsuxinjian_sjhb',
                        name: '双剑合璧',
                        desc: '剑意交融，获得你武器的属性',
                        duration: duration,
                        prop,
                        start_msg: '<HIW>$N双剑一交，剑光暴涨数倍，$N的剑法威力陡然提升！</HIW>\n',
                        finish_msg: '<HIW>$N双剑分开，剑光渐渐收敛，合璧之势已尽。</HIW>\n',
                    },
                    me,
                );
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var duration = calcSJHBDuration(lv);
                return '你手中的武器将提供双倍增幅效果，持续' + toSec(int(duration)) + '秒。';
            },
        },
    };
}

function calcSJHBDuration(lv: number): number {
    return Math.min(30000, 10000 + lv * 2);
}

