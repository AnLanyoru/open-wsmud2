import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

// ============================================================
// 玄虚步 — 公共绝世武功（侠客岛）
// ============================================================

export default class extends SKILL {
    name = '玄虚步';
    id = 'xuanxubu';
    grade = 4;

    desc = '这是龙木二岛主在侠客岛的石室中领悟到一式轻功';
    can_enables = ['dodge'];

    dodge_actions = [
        '$n足踏玄虚，步法如太虚真气流转不定，$N的攻势触及$n衣角时已偏离数寸。\n',
        '$n身形忽虚忽实，一式「虚步蹑太清」，如仙人蹑空般飘然荡开，$N顿时扑空。\n',
        '只见$n身如云中龙影，步法玄奥莫测，倏忽间已在$N攻势之外，$N收招不及。\n',
        '$n两袖轻拂，足下步法虚实相生，$N只觉眼前一花，$n已如镜花水月般不可触及。\n',
        '$n面带微笑，一足踏前、一足虚点，整个人仿佛融入虚空，$N的招式透影而过。\n',
        '$n使出一式「玄之又玄」，步法中蕴含天地至理，$N攻势虽猛却如泥牛入海，全无消息。\n',
    ];

    slots = [
        {
            prop: 'xxb_per',
            value: (_lv: number) => 8,
            format: (val: number) => '幻影的附加的躲闪和免伤额外增加' + val + '%',
        },
        {
            prop: 'xxb_fj',
            value: (_lv: number) => 150,
            format: (val: number) => '玄虚步的反击伤害增加' + val + '%',
        },
    ];

    pfm_set: PerformData = {
        huanying: {
            name: '幻影',
            distime: 45000,
            enable_skill: 'dodge',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_xxb_duration(lv);
                const basePer = query_xxb_per(lv);
                const extraPer = me.query_prop('xxb_per');
                const totalPer = basePer + extraPer;

                me.send_room(
                    '<HIC>$N步踏玄虚，身形一化为数道幻影，虚实莫辨，宛如镜花水月般令人无从捉摸！</HIC>',
                    target,
                );

                me.add_status({
                    id: 'dodge',
                    name: '幻影',
                    duration: duration,
                    prop: {
                        ds_per: totalPer,
                        diff_sh_per: totalPer,
                    },
                    finish_msg: '$N周身幻影逐一消散，身形重新凝实。',
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_xxb_duration(lv);
                const per = query_xxb_per(lv);
                return (
                    toSec(duration) +
                    '秒' +
                    '内提高你' +
                    per +
                    '%的躲闪，使用幻影迷惑敌人减少你受到的伤害' +
                    per +
                    '%。'
                );
            },
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 2 + 100,
                dex: Math.floor(lv / 4) + 1,
                ds_per: query_xxb_enable_ds_per(lv),
                desc: '当你躲闪成功后顺势反击敌人',
            },
        };
    }

    /** 躲闪成功后顺势反击敌人 */
    on_dodge_over(me: CHARACTER, attacker: CHARACTER, par: DoAttackPar): void {
        if (par.is_dodged && !me.query_temp('sk_xxb_fj', 0)) {
            const lv: number = me.query_skill('xuanxubu', 0);
            if (!lv) return;
            const fjPer: number = me.query_prop('xxb_fj');
            me.send_room('<HIC>$N足踏玄虚，身形一晃，借着$n招数落空之势反手一击！</HIC>', attacker);
            me.do_attack({
                target: attacker,
                gj: Math.floor((me.gj * (100 + fjPer)) / 100),
                mz: me.mz,
                no_append: true,
                no_append_target: true,
            });
            me.end_attack(attacker);
            me.set_temp('sk_xxb_fj', 1, 7000);
        }
    }
}

// ============================================================
// 玄虚步 — 公共计算函数
// ============================================================

/** 基础 ds 百分比加成 */
function query_xxb_enable_ds_per(lv: number): number {
    return Math.floor(lv / 300) + 1;
}

/** 幻影：持续时间（毫秒），上限 15000ms */
function query_xxb_duration(lv: number): number {
    return Math.min(15000, 3000 + lv * 5);
}

/** 幻影：躲闪与免伤百分比加成，上限 30% */
function query_xxb_per(lv: number): number {
    return Math.min(30, 5 + Math.floor(lv / 100));
}
