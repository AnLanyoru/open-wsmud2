import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "空明拳";
    id = "kongmingquan";
    grade = 4;
    is_public = true;
    
    // 原始描述：周伯通在桃花岛自创的一套拳法，以空明为特点，拳法空灵飘忽，似有似无，令人防不胜防
    desc = "周伯通在桃花岛自创的一套拳法";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N左掌虚晃，右拳自空明处击出，直取$n的$l",
        "$N双拳似闭非闭、似开非开，虚实难辨地罩向$n",
        "$N一招「空碗盛雪」，拳到中途忽然变向，击向$n的$l",
        "$N拳法空灵飘忽，身影如幻如真，一拳从绝无可能的角度打向$n",
        "$N双拳齐出，一虚一实，「空谷回音」般轰向$n",
        "$N身形滴溜一转，拳法大开大合却又空若无物，$n完全无法捉摸",
    ];
    learn_condition = {
      "int1": 40
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.72),
                str: Math.floor(lv * 0.167),
                mz: Math.floor(lv * 1.72),
            },
        };
    }

    pfm_set: PerformData = {
        luanquan: {
            name: "乱拳",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var hitCount = 6;
                var allHit = true;

                me.send_room("<HIC>$N哈哈大笑，双拳乱舞，拳影漫天，如狂风暴雨般罩向$n！</HIC>", target);
                for (var i = 0; i < hitCount; i++) {
                    var lastGj = (i === hitCount - 1 && allHit) ? Math.floor(me.gj * 1.3) : me.gj;
                    var isLastHit = (i === hitCount - 1 && allHit);
                    var par: DoAttackPar = { target, gj: lastGj, mz: me.mz };
                    me.do_attack(par);
                    if (par.is_dodged || par.is_parried) {
                        allHit = false;
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "瞬间对敌人攻击6拳，如果全部命中，最后一拳无视对方30%防御";
            },
        },
        zuoyouhubo: {
            name: "左右互搏",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIC>$N左手画方，右手画圆，使出左右互搏之术，双拳齐出攻向$n！</HIC>", target);
                for (var i = 0; i < 2; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz, no_weapon: true });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用左右互搏之术同时攻击敌人两次。";
            },
        },
    };
}
