import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "天魔策";
    id = "tianmoce";
    grade = 6;
    
    desc = "魔门一系最高深的功法";
    can_enables = ["unarmed","dodge","force","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: lv * 3,
                mz: lv * 3,
                add_sh_per: 4,
                diff_sh_per: 4,
                desc: "唯一：将你内力的135%转化为气血",
            },
            dodge: {
                ds: lv * 3,
                dex: Math.floor(lv * 0.6),
                ds_per: 4,
                mz_per: 4,
            },
            parry: {
                zj: lv * 3,
                hp_per: 6,
                con: Math.floor(lv * 0.6),
                str: Math.floor(lv * 0.6),
            },
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                con: Math.floor(lv * 0.6),
                str: Math.floor(lv * 0.6),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "种魔",
            distime: 42750,
            enable_skill: "unarmed",
            mp: 1940,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 种魔
                // 消除对方的内功，压制敌方使对方降低20%的伤害和免伤
                me.send_room("$N使出「种魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消除对方的内功，压制敌方使对方降低20%的伤害和免伤";
            },
        },
        pfm_1: {
            name: "道心",
            distime: 42750,
            enable_skill: "unarmed",
            mp: 1880,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 道心
                // 大幅提升战斗力
                me.send_room("$N使出「道心」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "大幅提升战斗力";
            },
        },
        pfm_2: {
            name: "鬼影",
            distime: 38000,
            enable_skill: "unarmed",
            mp: 1560,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 鬼影
                // 5秒内鬼影相随，攻击必中
                me.send_room("$N使出「鬼影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "5秒内鬼影相随，攻击必中";
            },
        },
        pfm_3: {
            name: "拳罡",
            distime: 9500,
            enable_skill: "unarmed",
            mp: 970,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 拳罡
                // 刚猛威烈的一拳，命中后会增加自己的伤害和破防，可叠加
                me.send_room("$N使出「拳罡」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "刚猛威烈的一拳，命中后会增加自己的伤害和破防，可叠加";
            },
        },
        pfm_4: {
            name: "补天道",
            distime: 42750,
            enable_skill: "unarmed",
            mp: 1980,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 补天道
                // 增加你的招架几率，招架成功后吸收对方功力转为自身气血
                me.send_room("$N使出「补天道」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "增加你的招架几率，招架成功后吸收对方功力转为自身气血";
            },
        },
    };
}
