import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "圣火令法";
    id = "shenghuojianfa";
    grade = 2;

    desc = "明教的一门记载在圣火令上的剑法";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一振，但见一道<HIR>赤焰</HIR>冲天而起，圣火令法夹带着灼热之气，直取$n$l",
        "$N凌空一跃，$w自上而下划出一道<HIY>金光</HIY>，如圣火燎原般劈向$n的$l",
        "$N身形疾转，$w左穿右插，正是<HIR>「火舞九天」</HIR>，顷刻间已罩向$n全身要穴",
        "$N$w翻飞，招式诡异莫测，圣火令上的<HIY>烈火神光</HIY>忽隐忽现，令$n目不暇接",
        "$N暴喝一声，$w化作<HIR>火龙</HIR>般盘旋飞舞，一招「烈焰腾空」直刺$n$l"
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 1.4),
                mz: 20 + Math.floor(lv * 1.4),
            },
        };
    }

    pfm_set: PerformData = {
        sheng: {
            name: "圣火焚烧",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIR>$N手中$w陡然升起一道圣火，烈焰腾腾，$N长啸一声，圣火四处迸射，席卷八方！</HIR>");
                var enemies = me.get_nearby_enemies();
                if (!enemies.length) {
                    enemies = [target];
                }
                for (var e = 0; e < enemies.length; e++) {
                    var enemy = enemies[e];
                    for (var i = 0; i < 3; i++) {
                        me.do_attack({
                            target: enemy,
                            gj: me.gj,
                            mz: me.mz,
                            attack_before: i > 0 ? "<HIR>圣火未熄，紧跟着又一道烈焰袭来</HIR>" : undefined,
                        });
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "圣火焚天，对附近所有敌人每人连续攻击三次，势不可挡。";
            },
        },
    };
}
