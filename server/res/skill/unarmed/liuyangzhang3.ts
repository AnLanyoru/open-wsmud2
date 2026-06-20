import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天山六阳掌";
    id = "liuyangzhang3";
    grade = 6;
    family = FAMILIES.XIAOYAO;
    desc = "逍遥派的天山六阳掌，绝招生死符让人谈虎色变。";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '生死符释放时间减少1秒',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '白虹掌力额外附加10%内力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 3000,
                mz: 3000,
                dex: 1002,
                desc: "你对种了生死符的敌人伤害增加50%",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "生死符",
            distime: 28500,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 生死符
                // 逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后11秒后爆发，如果你的最大气血大于敌方当前气血，敌人气血将降为1，否则将受到你当前气血20%的伤害。不可招架
                me.send_room("$N使出「生死符」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后11秒后爆发，如果你的最大气血大于敌方当前气血，敌人气血将降为1，否则将受到你当前气血20%的伤害。不可招架";
            },
        },
        pfm_1: {
            name: "阳关三叠",
            distime: 11400,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 阳关三叠
                // 以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击83%，否则增加83%命中
                me.send_room("$N使出「阳关三叠」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击83%，否则增加83%命中";
            },
        },
        pfm_2: {
            name: "白虹贯日",
            distime: 14250,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 白虹贯日
                // 提起全身真气对敌人造成你攻击力附加你最大内力20%(182489)的伤害。
                me.send_room("$N使出「白虹贯日」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "提起全身真气对敌人造成你攻击力附加你最大内力20%(182489)的伤害。";
            },
        },
    };
}
