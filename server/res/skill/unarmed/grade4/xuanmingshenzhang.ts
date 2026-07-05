import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "玄冥神掌";
    id = "xuanmingshenzhang ";
    grade = 4;
    
    desc = "玄冥二老鹿杖客、鹤笔翁的独门绝学，掌力阴寒歹毒，中者经脉尽冻，血肉凝冰(未完善)";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 2.32),
                mz: Math.floor(lv * 2.22),
                add_sh_per: 5,
                diff_fy_per: 5,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "寒毒",
            distime: 5000,
            enable_skill: "unarmed",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 寒毒
                // 对敌人造成200%的伤害，附加玄冥寒毒状态：每5秒受到阴寒伤害
                me.send_room("$N使出「寒毒」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%的伤害，附加玄冥寒毒状态：每5秒受到阴寒伤害";
            },
        },
    };
}
