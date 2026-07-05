import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import type {LearnCondition} from "../../../../types/events.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "蛤蟆功";
    id = "hamagong";
    grade = 4;

    force_rad = 0.7;
    
    // 原始描述：白驼山欧阳锋的独门内功，蓄势而发，如蛤蟆鼓气，一击毙敌，江湖谈之色变
    desc = "白驼山的内功心法";
    can_enables = ["unarmed","force"];
    attack_actions = [
        "$N双腿微曲，两臂前伸，状若蛤蟆，猛地一口真气喷出直冲$n的$l",
        "$N趴伏在地，身形鼓胀如球，突然暴起朝$n的$l撞去",
        "$N双掌平推，一股排山倒海般的劲力直袭$n的$l",
        "$N舌绽春雷，$n只觉得一股大力如潮水般涌来",
        "$N身形一缩一放，骤然发力，双掌挟风雷之势拍向$n的$l",
        "$N鼓气一吸，周围草木皆动，随即一口浊气化做利箭射向$n",
    ];
    learn_condition: LearnCondition = {
      "str1": 30,
      "con1": 30
    };

    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '蛤蟆冲击最少次数增加2次',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '蛤蟆吸气期间额外增加8%免伤',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: 100 + Math.floor(lv * 2),
                gj: 35 + Math.floor(lv * 8 / 5),
                limit_mp: lv * 150,
                desc: "唯一：将你内力的70%转化为气血",
            },
            unarmed: {
                gj: 11 + Math.floor(lv * 1.4),
                mz: 11 + Math.floor(lv * 1.4),
                str: Math.floor(lv / 5),
            },
        };
    }

    pfm_set: PerformData = {
        xi: {
            name: "蛤蟆吸气",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var maxCharge = 4.5 + Math.floor(lv / 200) * 1.5;
                var chargeTime = Math.min(maxCharge * 1000, 9000);
                var mianShang = 20 + Math.floor(lv / 100);

                me.send_room("<HIY>$N趴在地上，双腮鼓起如鼓，腹腔中传出沉闷的咕咕声，正在蓄力运功！</HIY>", target);
                me.add_status({
                    id: "xq",
                    name: "蛤蟆吸气",
                    desc: "蓄力中，无法躲闪招架，但减免伤害",
                    duration: chargeTime,
                    prop: {
                        diff_sh_per: mianShang,
                        mz_per: -100,
                        zj_per: -100,
                    },
                    finish_msg: "<HIY>$N腹中咕声渐息，蓄力完毕。</HIY>",
                });
                me.set_temp("hamagong_charge_start", Date.now(), chargeTime + 1000);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "趴在地上蓄力运功，可最多蓄力9秒，蓄力期间增加25%伤害减免，无法躲闪，招架。";
            },
        },
        chong: {
            name: "蛤蟆冲击",
            distime: 5000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var chargeStart = me.query_temp("hamagong_charge_start", 0);
                var chargeDuration = chargeStart ? Date.now() - chargeStart : 0;
                var chargeSeconds = Math.max(0, Math.min(9, chargeDuration / 1000));
                var baseCount = 1;
                var extraCount = Math.floor(chargeSeconds);
                var hitCount = baseCount + extraCount;
                var dmgBonus = 1 + chargeSeconds * 0.15;
                var mzBonus = chargeSeconds * 0.15;

                me.remove_temp("hamagong_charge_start");
                me.remove_status("xq");

                me.send_room("<HIR>$N猛地从地上一跃而起，双掌齐推，一股排山倒海的劲力轰向$n！</HIR>", target);
                for (var i = 0; i < hitCount; i++) {
                    me.do_attack({ target, gj: Math.floor(me.gj * dmgBonus), mz: Math.floor(me.mz * (1 + mzBonus)) });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "蓄力后可冲击敌人，每蓄力多１秒，增加你15％的伤害，15%命中，增加一次攻击";
            },
        },
    };
}
