import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天山六阳掌";
    id = "liuyangzhang2";
    source_skill = "liuyangzhang";
    grade = 4;
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
                gj: Math.floor(lv * 1.7),
                mz: Math.floor(lv * 1.3),
                dex: Math.floor(lv * 0.2),
                desc: "你对种了生死符的敌人伤害增加50%",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "生死符",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 8000,
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
            distime: 12000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
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
            name: "白虹掌力",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 白虹掌力
                // 提起全身真气对敌人造成你攻击力附加你最大内力20%(5670)的伤害。
                me.send_room("$N使出「白虹掌力」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "提起全身真气对敌人造成你攻击力附加你最大内力20%(5670)的伤害。";
            },
        },
    };
}
