import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "灵蛇杖法";
    id = "lingshezhangfa";
    grade = 4;
    
    desc = "白驼山的杖法";
    can_enables = ["staff","parry"];
    attack_actions = SKILL.get("staff")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '你的每次出招必定出现毒蛇攻击',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            staff: {
                gj: Math.floor(lv * 1.21),
                mz: lv * 1,
                dex: Math.floor(lv * 0.1),
                zj: lv * 1,
                desc: "你的攻击会使敌人受到3356点蛇毒伤害",
            },
            parry: {
                zj: 5 + Math.floor(lv * 1.6),
                fy: 10 + lv * 2,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "灵蛇出洞",
            distime: 10000,
            enable_skill: "staff",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 灵蛇出洞
                // 灵蛇出洞，瞬间攻击3次，攻击中必定触发毒蛇攻击
                me.send_room("$N使出「灵蛇出洞」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "灵蛇出洞，瞬间攻击3次，攻击中必定触发毒蛇攻击";
            },
        },
    };
}
