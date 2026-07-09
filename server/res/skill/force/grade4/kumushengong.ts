import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '枯木神功';
    id = 'kumushengong';
    grade = 4;
    force_rad = 0.9;

    desc = '天龙寺的高级内功心法';
    can_enables = ['force'];
    slots = [
        {
            prop: 'limit_mp',
            value: (lv: number) => 120 * lv,
            format: (val: number) => '内力上限：+' + val,
            query_needs: function (_lv: number) {
                return [
                    {
                        path: 'book/wudao',
                        count: 10,
                    },
                    {
                        path: 'book/bc#kumushengong',
                        count: 25,
                    },
                ];
            },
        },
        {
            prop: 'kmsg_fc_ms',
            value: (lv: number) => 5 + int(lv / 100),
            format: (val: number) => '枯木逢春使用后8秒内增加自己15%免伤',
        },
        {
            prop: 'kmsg_sm_hf',
            value: (lv: number) => Math.min(100, 30 + int(lv / 100)),
            format: (val: number) => `战斗中首次受到致命伤害时恢复${val}%气血，冷却10分钟`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 10,
                fy: lv * 2,
                con: 4 + Math.floor(lv * 0.25),
                limit_mp: lv * 180,
                desc: '唯一：将你内力的90%转化为气血',
            },
        };
    }

    /**
     * 战斗中首次受到致命伤害时恢复气血（冷却10分钟）
     */
    on_damage(me: CHARACTER, sh: number, _from?: CHARACTER): number {
        const pct = me.query_prop('kmsg_sm_hf');
        if (pct > 0 && sh >= me.hp && !me.query_temp('kmsg_sm_hf_cd', 0)) {
            const heal = Math.floor((me.max_hp * pct) / 100);
            me.set_temp('kmsg_sm_hf_cd', 1, 600000);
            me.send_room(
                '<hiz>$N体内枯木神功于生死一线间迸发出蓬勃生机，伤势瞬间愈合大半！</hiz>\n',
            );
            me.add_hp(heal);
        }
        return sh;
    }

    pfm_set: PerformData = {
        hui: {
            name: '枯木逢春',
            distime: 60000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const hpHeal = kumufengchun_heal(me, lv);

                me.send_room(
                    '<hiz>$N阖目凝神，默运枯木生花之法，体内真气如枯木逢春般勃发，周身泛起淡淡青光。</hiz>\n',
                    target,
                );

                // 治疗自身
                me.add_hp(hpHeal);

                me.send_room('<hiz>$N吐出一口浊气，面色由白转红，伤势已愈大半。</hiz>\n', target);

                // 移除所有负面状态
                me.clear_downside(true);

                me.send_room(
                    '<hiz>青光流转之间，$N所中诸般负面状态如冰雪消融，荡然无存。</hiz>\n',
                    target,
                );

                // 进阶：枯木逢春后附加免伤
                const msPct = me.query_prop('kmsg_fc_ms');
                if (msPct > 0) {
                    me.add_status({
                        id: 'force',
                        name: '逢春',
                        duration: 8000,
                        prop: {
                            diff_sh_per: msPct,
                        },
                        start_msg: '<hiz>枯木逢春之力化作一道青光护住$N周身，免伤大增！</hiz>',
                        finish_msg: '$N周身青光散去，枯木护体之力已然消退。',
                    });
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const hpHeal = kumufengchun_heal(me, lv);
                const pct = 10 + Math.floor(lv / 100);
                let desc =
                    '<hiz>枯木逢春：</hiz>恢复' +
                    hpHeal +
                    '点气血（' +
                    pct +
                    '%最大气血），移除你自身的负面状态';
                const msPct = me.query_prop('kmsg_fc_ms');
                if (msPct > 0) {
                    desc += '，并在8秒内增加' + msPct + '%免伤';
                }
                return desc + '。';
            },
        },
    };
}

// ═══════════════════════════════════════════
// 枯木神功 — 公共计算函数
// ═══════════════════════════════════════════

/** 枯木逢春回血量：20%最大气血 */
function kumufengchun_heal(me: CHARACTER, lv: number): number {
    const pct = 10 + Math.floor(lv / 100);
    return Math.floor((me.max_hp * pct) / 100);
}
