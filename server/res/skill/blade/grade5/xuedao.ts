import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "血刀";
    id = "xuedao";
    grade = 5;
    
    desc = "血刀门的看家本领，以出招角度刁钻诡异威力强大著称";
    can_enables = ["blade"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: Math.floor(lv * 2.2),
                mz: Math.floor(lv * 2.2),
                add_sh_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "嗜血",
            distime: 60000,
            enable_skill: "blade",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 嗜血
                // 消耗你的生命，在15秒内提升你的攻击速度，命中，攻击力40%，每次攻击减少自己1%的当前气血
                me.send_room("$N使出「嗜血」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗你的生命，在15秒内提升你的攻击速度，命中，攻击力40%，每次攻击减少自己1%的当前气血";
            },
        },
        pfm_1: {
            name: "血海魔刀",
            distime: 20000,
            enable_skill: "blade",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 血海魔刀
                // 对敌人瞬间攻击6次，攻击结束后吸收你造成的总伤害恢复你的气血
                me.send_room("$N使出「血海魔刀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人瞬间攻击6次，攻击结束后吸收你造成的总伤害恢复你的气血";
            },
        },
    };
}
