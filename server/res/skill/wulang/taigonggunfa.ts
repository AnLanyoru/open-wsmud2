import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太公棍法";
    id = "taigonggunfa";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "此棍法传自太公钓鱼之理，棍法舒展如浪，运使时如临沧海垂钓，能以柔劲卸力，以巧劲制敌";
    can_enables = ["club"];
    attack_actions = SKILL.get("club")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '愿者上钩命中后对方无法躲闪',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '愿者上钩命中后对方无法招架',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '愿者上钩命中后每次造成的伤害增加80%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 8 + Math.floor(lv * 1.2),
                mz: 8 + Math.floor(lv * 1.5),
            },
        };
    }

    pfm_set: PerformData = {
        diao: {
            name: "缠丝钓",
            distime: 32000,
            enable_skill: "club",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 缠丝钓
                // 以缠劲攻击敌人，造成140%攻击力伤害，命中后使敌人忙乱8秒
                me.send_room("$N使出「缠丝钓」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以缠劲攻击敌人，造成140%攻击力伤害，命中后使敌人忙乱8秒";
            },
        },
        gou: {
            name: "愿者上钩",
            distime: 60000,
            enable_skill: "club",
            mp: 100,
            release_time: 10000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 愿者上钩
                // 太公钓鲸棍法绝技，以无上巧劲锁定敌人，命中后使敌人10秒无法行动，每1.5秒造成伤害
                me.send_room("$N使出「愿者上钩」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "太公钓鲸棍法绝技，以无上巧劲锁定敌人，命中后使敌人10秒无法行动，每1.5秒造成伤害";
            },
        },
    };
}
