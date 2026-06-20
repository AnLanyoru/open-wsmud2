import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "清心咒";
    id = "qingxinzhou";
    grade = 4;
    
    desc = "以心为器、以气为弦，音藏于息、韵生于神。可定心神，清邪祟";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+105000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '破妄曲附加自身55%攻击力的伤害，昏迷中受到伤害会立即清醒(60秒冷却)',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '安神曲降低55%防御的伤害，昏迷中受到伤害会立即清醒(60秒冷却)',
        },
        {
            prop: 'slot_3',
            value: (lv: number) => 10,
            format: (val: number) => '共鸣持续时间增加4秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                int: Math.floor(lv * 0.176),
                diff_downside_per: 10,
                limit_mp: lv * 175,
                desc: "唯一将你内力的82%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "破妄曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破妄曲
                // 引气成音，每次攻击附加2000点伤害。
                me.send_room("$N使出「破妄曲」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "引气成音，每次攻击附加2000点伤害。";
            },
        },
        pfm_1: {
            name: "安神曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 安神曲
                // 凝音成障，受到的伤害减少2000点。
                me.send_room("$N使出「安神曲」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "凝音成障，受到的伤害减少2000点。";
            },
        },
        pfm_2: {
            name: "共鸣",
            distime: 45000,
            enable_skill: "force",
            mp: 128,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 共鸣
                // 引音波共鸣，你和周围队友增加1000点攻击力与1000点命中，持续9秒。
                me.send_room("$N使出「共鸣」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "引音波共鸣，你和周围队友增加1000点攻击力与1000点命中，持续9秒。";
            },
        },
    };
}
