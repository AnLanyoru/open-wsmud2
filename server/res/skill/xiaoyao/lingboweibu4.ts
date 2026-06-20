import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "神游太虚";
    id = "lingboweibu4";
    grade = 6;
    family = FAMILIES.XIAOYAO;
    is_ultimate = true;
    desc = "上古逍遥门所传，凌波踏四方，逍遥游天下";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                dex: lv * 1,
                ds: lv * 3,
                mz: lv * 3,
                ds_per: 10,
                mz_per: 10,
                desc: "无相：躲闪成功后模仿对方的技能绝招",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "凌波",
            distime: 60000,
            enable_skill: "dodge",
            mp: 1690,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 凌波
                // 施展凌波微步，在15秒内全力躲闪敌方攻击，提高命中率。
                me.send_room("$N使出「凌波」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "施展凌波微步，在15秒内全力躲闪敌方攻击，提高命中率。";
            },
        },
        pfm_1: {
            name: "化蝶",
            distime: 60000,
            enable_skill: "dodge",
            mp: 2180,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 化蝶
                // 如果你的血量比例+5%不小于对方的异常抵抗则颠倒梦境和现实，将自身状态(气血内力比例)和敌方互换，
                me.send_room("$N使出「化蝶」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "如果你的血量比例+5%不小于对方的异常抵抗则颠倒梦境和现实，将自身状态(气血内力比例)和敌方互换，";
            },
        },
    };
}
