import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "松风剑法";
    id = "songfengjianfa";
    grade = 3;

    desc = "青城派绝学：如松之劲，如风之迅。剑法讲究快且劲，走的是灵巧一脉的剑法。";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N手中$w一振，剑势如<HIG>青松</HIG>挺拔，劲力暗蓄，直刺$n的$l",
        "$N$w疾挥，剑风<HIG>呼啸</HIG>，如疾风骤雨般连绵不绝地攻向$n",
        "$N身形如风，$w化作<HIG>数道青光</HIG>，虚实相生，令$n难以分辨",
        "$N$w一抖，剑光如<HIG>松涛</HIG>阵阵，层层叠叠涌向$n周身",
        "$N足尖轻点，$w顺势斜劈，剑势如<HIG>风卷残云</HIG>，转瞬间已攻至$n面前"
    ];
    parry_actions = [
        "$N$w一圈，剑势如<HIG>青松迎客</HIG>，以柔克刚将$P的攻势引偏",
        "$N身法如风，$w疾点$P手腕，以快制快迫使其变招",
        "$N$w横胸一立，剑势如<HIG>松涛壁立</HIG>，稳稳架住$P的进攻"
    ];
    slots = [
        {
            prop: 'sywx_sf',
            value: (lv: number) => 10,
            format: (val: number) => '松月无影出招后保留松风状态，脱战后消失',
        },
        {
            prop: 'sywx_mz',
            value: (lv: number) => 10,
            format: (val: number) => '每层松风额外增加松月无影10%命中',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 20 + Math.floor(lv * 1.5),
                mz: 20 + Math.floor(lv * 1.4),
                dex: Math.floor(lv * 0.127),
            },
            parry: {
                zj: 10 + Math.floor(lv * 1.4),
                max_hp: 10 + lv * 5,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        ying: {
            name: "松月无影",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var stacks: number = me.query_temp("songfeng", 0);
                var count = 1 + stacks;
                me.send_room("<HIG>$N深吸一口气，$W倏然刺出，剑影如松间明月，<HIG>无声无息</HIG>却又迅疾无伦！</HIG>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "<HIG>松风未止，紧跟着又是一剑</HIG>" : undefined,
                    });
                }
                me.set_temp("songfeng", 0);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗你积累的速度，瞬间出剑，每层松风增加你一次攻击次数";
            },
        },
    };
}
