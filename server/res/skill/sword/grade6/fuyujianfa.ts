import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';
import type { LearnCondition } from '../../../../types/events.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '覆雨剑法';
    id = 'fuyujianfa';
    grade = 6;

    // 原始描述：浪翻云依据洞庭湖水性而自创的剑法，如行云流水，惊涛骇浪，剑势如绵绵春雨，细密无间。
    desc = '浪翻云依据洞庭湖水性而自创的剑法，如行云流水，惊涛骇浪';
    can_enables = ['sword', 'parry'];
    attack_actions = [
        '$N$W轻抖，剑势如细雨绵绵，一招「<HIC>雨丝风片</HIC>」，无数剑丝缠向$n的$l',
        '$N剑势忽急，如暴雨倾盆，正是「<HIB>大雨滂沱</HIB>」，剑光如雨点般洒向$n',
        '$N$W斜指，剑势如长江大河，一招「<HIW>惊涛拍岸</HIW>」，剑气如浪潮般层层叠叠涌向$n',
        '$N$W横挥，化作万点雨滴，正是「<HIG>烟雨朦胧</HIG>」，剑光迷迷蒙蒙罩向$n',
        '$N身形随剑走，一招「<HIC>行云流水</HIC>」，剑势连绵不绝，如江河奔涌向$n的$l',
        '$N$W忽然一转，掀起滔天巨浪，正是「<HIB>翻江倒海</HIB>」，剑气如海啸席卷$n',
        '$N$W疾点，漫天剑雨聚为一线，一招「<HIW>雨过天晴</HIW>」，一道惊天剑气直贯$n',
        '$N长吟一声，剑势如洞庭波涛，正是「<HIC>洞庭秋月</HIC>」，剑光如水中月影笼罩$n',
    ];
    parry_actions = [
        '$n$W轻挥，剑势化作一帘雨幕，将$P的攻势尽数挡在门外\n',
        '$n$W疾转，如水涡般将$P的兵器卷入其中，四两拨千斤\n',
        '$n剑势连绵如雨，以柔克刚，$P只觉剑招如陷入泥沼之中\n',
        '$n$W一圈一引，如洞庭湖面泛起涟漪，将$P的劲力层层化去\n',
    ];
    learn_condition: LearnCondition = {
        max_mp: 60000,
        skill: {
            sword: 500,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 3,
                mz: 20 + lv * 3,
                dex: 2 + Math.floor(lv / 2),
                mz_per: 8,
                gjsd_per: 10,
            },
            parry: {
                zj: 10 + Math.floor(lv * 2.3),
                diff_sh_per: 4,
                zj_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        yu: {
            name: '剑雨',
            distime: 28500,
            enable_skill: 'sword',
            mp: 1900,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var count = calcJianyuCount(lv);
                me.send_room(
                    '<hib>$N$W一引，剑光化作漫天细雨，绵绵密密，无孔不入。</hib>\n',
                    target,
                );
                var time = calcJiangangTime(lv);
                me.add_status({
                    id: 'weapon',
                    name: '剑雨',
                    duration: time,
                    on_attach(me) {
                        me.set_temp('fyj_r', count, time)
                    },
                    on_expire(me) {
                        me.remove_temp('fyj_r')
                    },
                    desc: '覆雨剑法之剑雨，攻击变为多次，增加穿透防御的几率',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var count = calcJianyuCount(lv);
                return '化剑为雨，攻击变为' + count + '次，增加穿透防御的几率';
            },
        },
        gang: {
            name: '剑罡',
            distime: 19000,
            enable_skill: 'sword',
            mp: 1140,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const bounsDmg = 2 + int(lv/1000)
                me.set_temp('fyj_g', 1, 100)
                me.send_room(
                    '<hiw>$N深吸一口气，$W骤然爆发出万丈剑罡，剑气如实质般凝结，一股可怖的罡气直冲$n面门！</hiw>\n',
                    target,
                );
                me.do_attack({
                    target,
                    gj: me.gj * bounsDmg,
                    mz: me.mz * 2,
                });
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, _lv: number) {
                return '极致的剑法，大幅度增加命中和伤害，必定触发穿透';
            },
        },
    };

    on_before_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        let rate = 1 + (me.query_skill('fuyujianfa') / 200)
        if (me.query_temp('fyj_r', 0)) {
            rate *= 2
        }
        if (me.query_temp('fyj_g', 0)){
            rate = 100
        }
        if (100 - me.random(100) > rate) return;
        par.diff_fy = 100
    }
    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar, sh: number): void {
        if (!target || target.hp <= 0) return;
        const extra_hit = me.query_temp('fyj_r', 0);
        if (!extra_hit) return;
        for (let i = 0; i < extra_hit; i++) {
            if (target.hp <= 0) break;
            me.do_attack({
                target,
                gj: me.gj,
                mz: me.mz,
                no_append: true,
                attack_msg: '<hir>· · · · · 剑雨落下 · · · · ·</hir>',
            });
        }
    }
}

function calcJianyuCount(lv: number): number {
    const c = 2 + Math.floor(lv / 1000);
    if (c > 12) return 12;
    return c;
}

function calcJiangangTime(lv: number): number {
    const t = 5000 + Math.floor(lv * 5);
    if (t > 12000) return 12000;
    return t;
}
