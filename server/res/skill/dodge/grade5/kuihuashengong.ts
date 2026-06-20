import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "葵花神功";
    id = "kuihuashengong";
    grade = 5;
    
    desc = "欲练神功，必先自宫，据说由前朝一位大太监所创，狠辣诡异。";
    can_enables = ["dodge","force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 4.1),
                mz: Math.floor(lv * 2.91),
                limit_mp: lv * 560,
                desc: "唯一将你内力的70%转化为气血",
            },
            dodge: {
                ds: 12 + lv * 4,
                dex: Math.floor(lv * 0.4),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "鬼魅",
            distime: 28500,
            enable_skill: "dodge",
            mp: 40,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 鬼魅
                // 如鬼魅般使敌人难以捕捉，飘忽不定，使用后清除自身的负面状态，在23秒内无视控制技能，（忙乱可用）
                me.send_room("$N使出「鬼魅」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "如鬼魅般使敌人难以捕捉，飘忽不定，使用后清除自身的负面状态，在23秒内无视控制技能，（忙乱可用）";
            },
        },
    };
}
