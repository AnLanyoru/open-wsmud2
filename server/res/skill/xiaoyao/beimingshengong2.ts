import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { LearnCondition } from '../../../types/events.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

export default class extends SKILL {
    name = '北冥神功';
    id = 'beimingshengong2';
    source_skill = 'beimingshengong';
    grade = 4;
    force_rad = 0.8;
    family = FAMILIES.XIAOYAO;
    desc = '逍遥派镇派神功，可吸取他人内力以供己用，是迅速提升功力的捷径功法。';
    can_enables = ['force', 'parry'];

    learn_condition: LearnCondition = {
        skill: {
            force: 500,
        },
    };

    slots = [
        {
            prop: 'bmsg_nl',
            value: (lv: number) => Math.floor(lv / 100),
            format: (val: number) => `每次吸取内力额外增加：+${val}`,
        },
        {
            prop: 'bmsg_cd',
            value: (lv: number) => 1000,
            format: (val: number) => '吸取内力的内置冷却减少1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                con: Math.floor(lv * 0.5) + 10,
                dex: Math.floor(lv / 3) + 1,
                limit_mp: lv * 165,
                desc: '当你命中敌人后，会吸取对方内力增加自身最大内力\n唯一：将你内力的80%转化为气血',
            },
            parry: {
                zj: Math.floor(lv * 1.8) + 20,
                dex: Math.floor(lv / 4) + 2,
                max_hp: lv * 13,
                desc: '当你招架成功后会吸取对方内力增加自身最大内力',
            },
        };
    }

    pfm_set: PerformData = {
        huifu: {
            name: '鲲字诀',
            distime: 30000,
            enable_skill: 'force',
            mp: 0,
            release_time: 0,
            no_auto: true,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const per = 10 + Math.floor(lv / 200);
                const gj = Math.floor((me.max_mp * per) / 100);
                me.send_room(
                    '<him>$N默运北冥神功，周身紫气环绕，转眼间已恢复活力！\n</him>',
                    target,
                );
                me.add_mp(gj);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const per = 10 + Math.floor(lv / 200);
                return '战斗中恢复自己' + per + '%内力。';
            },
        },
        power: {
            name: '凝神诀',
            distime: 30000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            no_auto: true,
            use_type: 2,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                if (me.query_temp('bmsg_add', 0)) return me.notify('你已经附加凝神诀的效果了。');
                me.send_room('<hig>$N神凝丹田，息游紫府，周围灵气如潮水般朝$P汇聚过来。</hig>');

                const time = 60000 + lv * 100;
                const nl = 100 + lv * 15;
                const ts = me.team || [me];
                for (let i = 0; i < ts.length; i++) {
                    const tg = ts[i];
                    if (!tg.is_here(me)) continue;
                    if (tg.query_temp('bmsg_add', 0)) {
                        tg.notify('你已经附加凝神诀的效果了。');
                    }
                    tg.add_status({
                        id: 'force',
                        name: '北冥',
                        desc: '北冥神功之凝神诀，增加你的最大内力',
                        duration: time,
                        prop: {
                            desc: '增加' + nl + '最大内力',
                        },
                        on_attach: function (p: CHARACTER): void {
                            p.max_mp += nl;
                            p.set_temp('bmsg_add', nl);
                            p.recount();
                            p.notify_hp();
                        },
                        on_expire: function (p: CHARACTER): void {
                            p.max_mp -= nl;
                            p.remove_temp('bmsg_add');
                            p.recount();
                            p.notify_hp();
                        },
                    });
                }
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const time = 60000 + lv * 100;
                const nl = 100 + lv * 15;
                return '增加你和你附近队友的最大内力' + nl + '，持续' + time / 1000 + '秒';
            },
        },
    };

    do_force_attack(me: CHARACTER, target: CHARACTER): number {
        if (me.max_mp < me.limit_mp + me.query_prop('limit_mp')) {
            let cd = 4000 - me.query_prop('bmsg_cd');
            if (cd < 1000) cd = 1000;
            if (!me.query_temp('sk_beiming', 0)) {
                me.set_temp('sk_beiming', 1, cd);
                const nl = me.query_prop('bmsg_nl');
                const gj = Math.round(me.query_skill('beimingshengong2', 0) / 10) + nl;
                const mp = Math.floor((gj * 120) / 100);
                if (target.max_mp > mp) {
                    if (target.mp > mp) {
                        target.notify('<hir>你顿觉全身内力如水银般循孔飞泄而出！</hir>');
                        me.notify(
                            '<hir>你觉得' + target.name + '的内力自手掌源源不绝地流了进来。</hir>',
                        );
                        target.mp -= mp;
                        me.max_mp += gj;
                    }
                }
            }
        }
        return 0;
    }

    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (par.is_parried) {
            if (me.max_mp < me.limit_mp + me.query_prop('limit_mp')) {
                const lv = me.query_skill('beimingshengong2', 0);
                let cd = 4000 - me.query_prop('bmsg_cd');
                if (cd < 1000) cd = 1000;
                if (!me.query_temp('sk_beiming_parry', 0)) {
                    me.set_temp('sk_beiming_parry', 1, cd);
                    const nl = me.query_prop('bmsg_nl');
                    const gj = Math.round(lv / 10) + nl;
                    const mp = Math.floor((gj * 120) / 100);
                    if (target.mp > mp) {
                        target.notify('<hib>你顿觉全身内力如江河决堤般奔泻而出！</hib>');
                        me.notify(
                            '<hib>你觉得' +
                                target.name +
                                '的内力透过招架之势源源不绝地涌入丹田。</hib>',
                        );
                        target.mp -= mp;
                        me.max_mp += gj;
                    }
                }
            }
        }
    }
}
