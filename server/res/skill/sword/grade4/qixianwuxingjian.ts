import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "七弦无形剑";
    id = "qixianwuxingjian";
    grade = 4;
    
    desc = "梅庄大庄主黄钟公所创绝技，以琴音为剑，无形无质却暗藏杀机，可伤人于无形之中";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '每次攻击和七绝音时，必定打出音波',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '魔音贯耳无法躲闪和招架',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.32),
                mz: Math.floor(lv * 1.62),
                dex: 8 + Math.floor(lv * 0.1),
                desc: "唯一：攻击时有概率打出音波伤人",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "七绝音",
            distime: 36000,
            enable_skill: "sword",
            mp: 60,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 七绝音
                // 发出七道弦音攻击目标心脉。
                me.send_room("$N使出「七绝音」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "发出七道弦音攻击目标心脉。";
            },
        },
        pfm_1: {
            name: "魔音贯耳",
            distime: 47000,
            enable_skill: "sword",
            mp: 80,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 魔音贯耳
                // 以魔音侵入目标心脉，命中后使其防御躲闪降低30%，持续12秒。
                me.send_room("$N使出「魔音贯耳」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以魔音侵入目标心脉，命中后使其防御躲闪降低30%，持续12秒。";
            },
        },
    };
}
