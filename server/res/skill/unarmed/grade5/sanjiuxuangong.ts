import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 10 */
export default class extends SKILL {
    name = '三九玄功';
    id = 'sanjiuxuangong';
    grade = 5;

    force_rad = 0.95;

    // 原始描述：玄门正宗内功，融炼气、护体、降妖于一体，真气护体可御万邪
    desc = '玄门正宗内功，融炼气、护体、降妖于一体，真气护体可御万邪。';
    can_enables = ['unarmed', 'force'];
    attack_actions = [
        '$N运起三九玄功，真气流转间一掌拍出，正是「<HIC>玄门正气</HIC>」，罡风凛冽袭向$n的$l',
        '$N内息勃发，三九真气凝而不散，一式「<HIC>三花聚顶</HIC>」浩浩荡荡地涌向$n的$l',
        '$N双手划圆，真气化作无形漩涡，「<HIC>九转玄功</HIC>」带动周遭气流卷向$n的$l',
        '$N一声清啸，三九玄功催动掌力，「<HIC>降妖除魔</HIC>」带着煌煌天威罩向$n的$l',
        '$N双掌齐出，真气如龙，「<HIC>真气化形</HIC>」化作一道罡风席卷$n的$l',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        var dr = 50 + Math.floor(lv / 200);
        if (dr > 75) dr = 75;
        return {
            force: {
                fy: 120 + Math.floor(lv * 3.2),
                fy_per: 12,
                diff_sh_per: dr,
                hp_per: 10,
                limit_mp: lv * 300,
                desc: '进入战斗后减少' + dr + '%伤害，被命中后降低\n唯一：将你内力的95%转化为气血',
            },
            unarmed: {
                gj: 120 + Math.floor(lv * 3.2),
                mz: 120 + Math.floor(lv * 2.2),
                gj_per: 9,
                mz_per: 8,
            },
        };
    }

    on_disenable(me: CHARACTER, type: string): void {
        me.remove_temp('sk/sj_dr');
    }

    // 三九玄功被动：进入战斗后获得减伤，被命中后降低
    on_beginfight(me: CHARACTER): void {
        if (!me.fight_type) {
            var lv = me.query_skill('sanjiuxuangong', 0);
            var dr = 50 + int(lv / 200);
            if (dr > 75) dr = 75;
            me.set_temp('sk/sj_dr', dr);
        }
    }

    on_damage(me: CHARACTER, sh: number): number {
        // 被命中后降低减伤效果
        var dr = me.query_temp('sk/sj_dr', 0);
        if (dr > 0) {
            sh = int(sh * (100 - dr) / 100);
            me.send_room('<hiy>$N玄功护体，阵阵金光抵挡了攻势</hiy>');
            me.set_temp('sk/sj_dr', int(dr * 0.95));
        }
        return sh;
    }

    pfm_set: PerformData = {
        shu: {
            name: '仙体术',
            distime: 55000,
            enable_skill: 'unarmed',
            mp: 25,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = xiantiTime(lv);
                var dr = xiantiDr(lv);
                me.send_room(
                    '<hiy>$N深吸一口气，玄功运转周身，真气如泉涌般自丹田蔓延至四肢百骸，浑身灵光闪烁恍若<HIC>仙体</HIC>！</hiy>',
                    target,
                );
                me.add_status({
                    id: 'force',
                    name: '仙体',
                    duration: time,
                    prop: {
                        diff_sh_per2: dr,
                    },
                    ig_control: true,
                    desc: '仙体状态，获得' + dr + '%伤害减免，免疫负面状态',
                    start_msg: '<hiz>$N周身笼上一层氤氲仙气，万法不侵！</hiz>',
                    finish_msg: '<cyn>$N周身仙气缓缓散去。</cyn>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var time = xiantiTime(lv);
                var dr = xiantiDr(lv);
                return (
                    '传闻出自仙人体术，' +
                    toSec(time) +
                    '秒内进入仙体状态，获得' +
                    dr +
                    '%伤害减免，免疫负面状态'
                );
            },
        },
        zhou: {
            name: '酒神咒',
            distime: 28000,
            enable_skill: 'unarmed',
            mp: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var hp_cost = Math.floor(me.hp * 0.25);
                me.add_hp(-hp_cost);
                me.send_room(
                    '<hiz>$N的气息陡然暴涨，一股毁天灭地的力量自$P体内爆发而出！</hiz>',
                    target,
                );
                var dr = me.query_prop('diff_sh_per') || 0;
                var extra_dmg = Math.floor(dr * 10);
                var enemies = me.get_nearby_enemies();
                if (enemies.length === 0) enemies = [target];
                for (var i = 0; i < enemies.length; i++) {
                    var enemy = enemies[i];
                    if (enemy.hp <= 0) continue;
                    var sh = me.do_attack({
                        target: enemy,
                        gj: Math.floor((me.gj * (100 + extra_dmg)) / 100),
                        mz: me.mz,
                        attack_msg: '<hiy>一股狂暴无匹的气劲以$N为中心向四周横扫而出！</hiy>',
                        miss_msg: '<cyn>$n被这股气浪震得连连后退，幸好未被正面击中。</cyn>',
                        damage_msg: '<hir>$n被这股毁灭性的力量击中，狂喷鲜血，倒飞出去！</hir>',
                    });
                    if (sh > 0 && enemy.hp / enemy.max_hp < 0.15) {
                        enemy.add_status(
                            {
                                id: 'faint',
                                name: '昏迷',
                                duration: 6000,
                                is_faint: true,
                                downside: true,
                                desc: '你被酒神咒所伤，气血衰败，昏迷不醒',
                            },
                            me,
                        );
                    }
                    me.end_attack(enemy);
                }
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '消耗自身25%当前气血，对附近敌人造成自身免伤增幅的直接伤害，当敌人气血少于15%将昏迷6秒。';
            },
        },
    };
}

function xiantiTime(lv: number): number {
    var time = 5000 + lv;
    if (time > 6000) time = 6000;
    return time;
}

function xiantiDr(lv: number): number {
    var dr = 30 + Math.floor(lv / 100);
    if (dr > 35) dr = 35;
    return dr;
}
