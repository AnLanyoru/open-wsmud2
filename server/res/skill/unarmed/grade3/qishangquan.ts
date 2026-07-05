import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "七伤拳";
    id = "qishangquan";
    grade = 3;

    // 原始描述：崆峒派镇派绝学，金毛狮王谢逊习自崆峒派的绝技，伤敌一百自损八十。一拳七伤，七者皆伤，损心伤肺摧肝肠。
    desc = "金毛狮王谢逊习自崆峒派的绝技，伤敌一百自损八十";
    can_enables = ["unarmed","parry"];
    attack_actions = [
        "$N深吸一口气，面上忽青忽红，正是七伤拳运功之兆，猛然一拳「<HIC>损心</HIC>」直捣$n心口",
        "$N双拳交错，劲分七股，一股刚猛拳风裹挟着凛冽杀意，正是「<HIC>伤肺</HIC>」的精妙招数",
        "$N低喝一声，拳势如雷霆般轰出，暗藏七道劲力，正是「<HIC>摧肝</HIC>」的绝杀之式",
        "$N身形疾转，左右双拳连环击出，每一拳皆含摧心断肠之力，招式名为「<HIC>裂肠</HIC>」",
        "$N跨步上前，一拳看似平平无奇，实则蕴含七伤拳的七道暗劲，正是「<HIC>藏离</HIC>」",
        "$N拳风虎虎，劲力层层叠叠，如山洪暴发般涌向$n，此招名为「<HIC>精失</HIC>」",
        "$N双拳齐出，左拳刚猛右拳阴柔，两道截然不同的劲力交错成网，正是「<HIC>意迷</HIC>」",
        "$N大喝一声，全身骨节噼啪作响，一拳当胸捣出，七道劲力合而为一，正是「<HIC>魂摇</HIC>」",
        "$N纵身一跃，双拳自半空砸落，拳劲如山崩地裂，正是「<HIC>七伤总诀</HIC>」的起手式",
        "$N拳法展开，招招抢攻，一拳快似一拳，七伤拳的威力渐渐发挥到极致"
    ];
    parry_actions = [
        "$N双拳交错，劲分七股，以七伤拳劲将$P的攻势一一化解",
        "$N大喝一声，七伤拳劲力合一，竟用硬桥硬马的方式震开了$P的攻击",
    ];
    slots = [
        {
            prop: 'qs_sh',
            value: (lv: number) => 10,
            format: (val: number) => '七伤前六拳附加的伤害增加20%',
        },
        {
            prop: 'qs_fy',
            value: (lv: number) => 10,
            format: (val: number) => '七伤总诀触发时忽视对方50%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 10 + Math.floor(lv * 8 / 5),
                str: Math.floor(lv / 8),
                max_hp: lv * 10,
            },
            parry: {
                zj: 10 + Math.floor(lv * 8 / 5),
                fy: 200 + lv,
            },
        };
    }

    pfm_set: PerformData = {
        shang:
            {
                name: "七伤",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 100,
                release_time: 7000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var self_dmg = 20;
                    var extra_sh = me.query_prop('qs_sh');
                    if (extra_sh) extra_sh = extra_sh / 100;
                    else extra_sh = 0;
                    var hit_count = 0;
                    me.send_room("<HIR>$N面色一白，随即转红，一口鲜血喷出，双拳携风雷之势向$n轰去！</HIR>", target);
                    for (var i = 0; i < 7; i++) {
                        var gj = me.gj * (1 + extra_sh);
                        if (i === 6) {
                            var diff_fy = me.query_prop('qs_fy');
                            if (diff_fy) diff_fy = 50;
                            var sh = me.do_attack({
                                target: target,
                                attack_msg: "<hir>$N第七拳「七伤总诀」猛然轰出，七道劲力合为一体，威力惊天动地！</hir>",
                                damage_msg: "<red>$n被$N的「七伤总诀」击中，七道劲力在体内同时爆发！</red>",
                                miss_msg: "<cyn>$n拼尽全力，以精妙身法闪过了这致命一击</cyn>",
                                gj: gj,
                                mz: me.mz,
                                no_weapon: true,
                                diff_fy: diff_fy
                            });
                            if (sh) hit_count++;
                        } else {
                            var sh = me.do_attack({
                                target: target,
                                attack_msg: "<hir>$N第" + (i + 1) + "拳已至，拳劲中蕴含摧心裂肺之力！</hir>",
                                miss_msg: "<cyn>$n竭尽全力闪避这石破天惊的一拳</cyn>",
                                gj: gj,
                                mz: me.mz,
                                no_weapon: true
                            });
                            if (sh) hit_count++;
                        }
                    }
                    me.add_hp(-me.hp * self_dmg / 100);
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    return "先伤己，再伤人，一拳七伤，七者皆伤，损心伤肺摧肝肠，每拳自身受到20%伤害，每命中一拳增加总诀式50%伤害";
                },
            },
    };
}
