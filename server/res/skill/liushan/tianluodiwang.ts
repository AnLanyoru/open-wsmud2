import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天罗地网";
    id = "tianluodiwang";
    grade = 4;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门的暗器武功，使用时如天罗地网难以逃脱而得名";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '血滴子增加110%的伤害',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '天网增加110%的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.8),
                mz: 4 + Math.floor(lv * 1.8),
                mz_per: 3,
                diff_fy_per: 3,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "血滴子",
            distime: 16000,
            enable_skill: "throwing",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 血滴子
                // 攻击敌方头部，当敌人血量低于10%时，如果产生暴击则斩杀敌人
                me.send_room("$N使出「血滴子」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "攻击敌方头部，当敌人血量低于10%时，如果产生暴击则斩杀敌人";
            },
        },
        pfm_1: {
            name: "天网",
            distime: 60000,
            enable_skill: "throwing",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天网
                // 使用大量暗器攻击敌人，命中后使对方忙乱8秒，如果已经是已被天网忙乱的状态则昏迷4秒
                me.send_room("$N使出「天网」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用大量暗器攻击敌人，命中后使对方忙乱8秒，如果已经是已被天网忙乱的状态则昏迷4秒";
            },
        },
    };
}
