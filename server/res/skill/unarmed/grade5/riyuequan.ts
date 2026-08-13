import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '日月拳法';
    id = 'riyuequan';
    grade = 5;

    family = FAMILIES.MONSTER;
    desc = '日月神教镇教拳法，融日之刚猛与月之阴柔于一体，拳出如日月同辉，威不可挡';
    can_enables = ['unarmed', 'parry'];
    attack_actions = [
        '$N右拳高举，如旭日东升，一招「<HIC>日升月恒</HIC>」带着煌煌之威砸向$n的$l',
        '$N双拳交错，宛若日月同辉，一式「<HIC>日月经天</HIC>」划破长空直击$n的$l',
        '$N身形一旋，左拳如月，右拳似日，「<HIC>日月同辉</HIC>」交替轰向$n的$l',
        '$N拳法陡变，忽刚忽柔，一招「<HIC>日新月异</HIC>」变化万千地罩向$n的$l',
        '$N深吸一口气，拳势如日中天，一式「<HIC>日正中天</HIC>」堂堂正正地压向$n的$l',
        '$N拳招忽收忽放，如月之盈亏，一招「<HIC>月满西楼</HIC>」无声无息地印向$n的$l',
        '$N双拳齐出，一明一暗，正是「<HIC>日月并行</HIC>」，攻势如潮水般涌向$n的$l',
    ];
    parry_actions = [
        '$n双拳交错，以日之刚猛与月之阴柔交替化解$P的攻势\n',
        '$n拳法陡变，以日月经天之势格挡$P的攻击\n',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                add_sh_per: 4,
                diff_fy_per: 4,
            },
            parry: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                con: 10 + Math.floor(lv / 8),
                diff_sh_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        po: {
            name: '击破',
            distime: 16000,
            enable_skill: 'unarmed',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var mz_bonus = 100 + Math.floor(lv / 10);
                if (mz_bonus > 300) mz_bonus = 300;
                me.do_attack({
                    target: target,
                    gj: me.gj * 3,
                    mz: Math.floor((me.mz * mz_bonus) / 100),
                    attack_msg:
                        '<hiy>$N沉肩落胯，右拳凝聚全身之力，一式「<HIC>击破</HIC>」如流星赶月般轰向$n！</hiy>',
                    miss_msg: '<cyn>$n见$N拳势刚猛无俦，不敢樱其锋，当即抽身疾退！</cyn>',
                    damage_msg:
                        '<hir>只听「轰」的一声巨响，$n被$N一拳击实，踉跄退出数步，气血翻涌！</hir>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '造成300%攻击力的伤害，等级越高命中越高。';
            },
        },
        lian: {
            name: '日月连环',
            distime: 28000,
            enable_skill: 'unarmed',
            mp: 25,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var hit_count = 0;
                var total_hits = 3;
                me.send_room(
                    '<hiy>$N长啸一声，双拳幻出重重光影，日之阳刚与月之阴柔交替而出，连环三击如潮水般涌向$n！</hiy>',
                    target,
                );
                for (var i = 0; i < total_hits; i++) {
                    if (!target || target.hp <= 0) break;
                    var msgs = [
                        '<hiy>第一击——「<HIC>旭日初升</HIC>」</hiy>',
                        '<hiy>第二击——「<HIC>月映寒潭</HIC>」</hiy>',
                        '<hiy>第三击——「<HIC>日月交辉</HIC>」</hiy>',
                    ];
                    var hit = me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: msgs[i],
                        no_append: true,
                    });
                    if (hit) hit_count++;
                    me.end_attack(target);
                }
                if (hit_count >= total_hits) {
                    target.send_room(
                        '<hir>$N三击连环，拳拳到肉！$n被这三股截然不同的力道透体而入，顿时眼前一黑，昏迷过去！</hir>',
                        target,
                    );
                    target.add_status(
                        {
                            id: 'faint',
                            name: '昏迷',
                            duration: 8000,
                            is_faint: true,
                            downside: true,
                            desc: '你被日月连环三击命中，昏迷不醒',
                        },
                        me,
                    );
                }
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '连环三击，三下都命中后使对方昏迷8秒。';
            },
        },
    };
}
