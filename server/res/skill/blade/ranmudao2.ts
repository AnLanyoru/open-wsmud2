import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "燃木刀法";
    id = "ranmudao2";
    grade = 5;
    family = FAMILIES.SHAOLIN;
    desc = "少林寺七十二绝技之燃木刀法";
    can_enables = ["blade","parry"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: 2010,
                str: 500,
                mz: 1510,
                fy: 2010,
                desc: "燃木真焰你的攻击会附加自身120%防御力的伤害",
            },
            parry: {
                zj: 2100,
                fy: 2100,
                con: 500,
                max_hp: 11000,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "护体真焰",
            distime: 30000,
            enable_skill: "blade",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 护体真焰
                // 真焰护体，增加你30%的防御，被敌人命中后对敌人造成3800的真实伤害，招架成功伤害翻倍。
                me.send_room("$N使出「护体真焰」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "真焰护体，增加你30%的防御，被敌人命中后对敌人造成3800的真实伤害，招架成功伤害翻倍。";
            },
        },
        pfm_1: {
            name: "焚尽八荒",
            distime: 20000,
            enable_skill: "blade",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 焚尽八荒
                // 燃木刀法绝学「焚尽八荒」，瞬间用罡气攻击敌方8次，每次攻击造成100%伤害
                me.send_room("$N使出「焚尽八荒」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "燃木刀法绝学「焚尽八荒」，瞬间用罡气攻击敌方8次，每次攻击造成100%伤害";
            },
        },
    };
}
