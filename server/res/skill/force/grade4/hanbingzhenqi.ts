import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { LearnCondition } from '../../../../types/events.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '寒冰真气';
    id = 'hanbingzhenqi';
    grade = 4;
    force_rad = 0.7;

    desc = '嵩山派的绝学寒冰真气，至阴至寒，真气散发一股冰入骨髓的寒气。';
    can_enables = ['force'];

    learn_condition: LearnCondition = {
        skill: { force: 400 },
        max_mp: 5000,
    };

    slots = [
        {
            prop: 'limit_mp',
            value: (lv: number) => 135 * lv,
            format: (val: number) => '内力上限：+' + val,
            query_needs: function (_lv: number) {
                return [
                    {
                        path: 'book/wudao',
                        count: 10,
                    },
                    {
                        path: 'book/bc#hanbingzhenqi',
                        count: 25,
                    },
                ];
            },
        },
        {
            prop: 'hbzq_hb_sh',
            value: (lv: number) => hanbing_add_sh(lv),
            format: (val: number) => `附加寒冰真气时，额外造成${val}伤害`,
        },
        {
            prop: 'hbzq_dy_sh',
            value: (lv: number) => hanbing_add_sh(lv),
            format: (val: number) => `附加寒冰真气时，可抵挡${val}伤害`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 56 + Math.floor(lv * 1.7),
                max_hp: lv * 20,
                limit_mp: lv * 145,
                desc: '唯一：将你内力的70%转化为气血',
            },
        };
    }

    /**
     * 寒冰真气 — 被动减伤与反伤
     * 当处于「寒冰」状态时，受到的伤害降低，且攻击你的敌人会被冻结，攻击速度大幅降低。
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (me.query_temp('sk_hb', 0)) {
            const lv = me.query_skill('hanbingzhenqi', 0);
            sh = sh - me.query_prop('hbzq_dy_sh');
            if (sh < 0) sh = 0;
            if (from && from.hp > 0)
                from.add_status(
                    {
                        id: 'slow',
                        name: '寒气',
                        duration: hanbing_dongjie_duration(lv),
                        downside: true,
                        prop: {
                            gjsd_per: hanbing_dongjie_gjsd_per(lv),
                        },
                        desc: '被寒冰真气冻结，攻击速度减慢',
                        start_msg:
                            '<hib>$n只觉一股彻骨寒气自$N身上涌来，经脉瞬间冰封，动作变得迟滞无比！</hib>',
                    },
                    me,
                );
        }
        return sh;
    }

    pfm_set: PerformData = {
        bing: {
            name: '寒冰',
            distime: 40000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = hanbing_buff_duration(lv);
                const addSh = hanbing_add_sh(lv) + me.query_prop('hbzq_hb_sh');
                me.send_room(
                    '<hib>$N运起寒冰真气，周身寒气大盛，一层冰霜凝结在皮肤之上，散发出刺骨的寒意！</hib>',
                    target,
                );
                me.add_status({
                    id: 'force',
                    name: '寒冰',
                    duration: duration,
                    prop: {
                        add_sh: addSh,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp('sk_hb', 1, duration),
                    on_expire: (p: CHARACTER) => p.remove_temp('sk_hb'),
                    finish_msg: '<hib>$N周身的寒气渐渐散去，寒冰真气收回丹田。</hib>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur = toSec(hanbing_buff_duration(lv));
                const addSh = hanbing_add_sh(lv) + me.query_prop('hbzq_hb_sh');
                const dongjieDur = toSec(hanbing_dongjie_duration(lv));
                const gjsdPer = -hanbing_dongjie_gjsd_per(lv);
                return `运起全身真气，在${dur}秒内，使自己的伤害附加${addSh}寒冰伤害，并使攻击你的敌人冻结，在${dongjieDur}秒内减慢${gjsdPer}%攻击速度。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 寒冰真气 — 公共计算函数
// ═══════════════════════════════════════════

/** 寒冰真气buff附加伤害 */
function hanbing_add_sh(lv: number): number {
    return 800 + Math.floor(lv * 3.2);
}

/** 寒冰buff持续时间（毫秒） */
function hanbing_buff_duration(lv: number): number {
    return Math.min(20000, 10000 + lv * 10);
}

/** 冻结debuff持续时间（毫秒） */
function hanbing_dongjie_duration(lv: number): number {
    return Math.min(15000, 5000 + lv * 10);
}

/** 冻结debuff攻击速度降低百分比 */
function hanbing_dongjie_gjsd_per(lv: number): number {
    return -(30 + Math.floor(lv / 200));
}
