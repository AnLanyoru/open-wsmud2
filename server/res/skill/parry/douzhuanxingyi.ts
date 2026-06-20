import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "斗转星移";
    id = "douzhuanxingyi";
    grade = 5;
    
    desc = "姑苏慕容的绝技，以彼之道还施彼身";
    can_enables = ["parry"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: 2200,
                fy: 2200,
                diff_bj: 4,
                dex: 333,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "星移",
            distime: 30000,
            enable_skill: "parry",
            mp: 2550,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 星移
                // 10秒内，增加你40%的招架，招架成功后将伤害的150%转移给敌人
                me.send_room("$N使出「星移」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内，增加你40%的招架，招架成功后将伤害的150%转移给敌人";
            },
        },
        pfm_1: {
            name: "斗转",
            distime: 30000,
            enable_skill: "parry",
            mp: 4590,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 斗转
                // 使用前一个攻击你的武器或拳脚绝招攻击敌人，效果是你斗转星移等级的100%
                me.send_room("$N使出「斗转」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用前一个攻击你的武器或拳脚绝招攻击敌人，效果是你斗转星移等级的100%";
            },
        },
    };
}
