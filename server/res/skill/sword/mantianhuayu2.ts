import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "漫天花雨";
    id = "mantianhuayu2";
    grade = 5;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的暗器武功，使用的时候如漫天星光而得名";
    can_enables = ["sword","throwing"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.5),
                mz: 4 + Math.floor(lv * 1.5),
                mz_per: 9,
                add_sh_per: 9,
                diff_fy_per: 9,
            },
            sword: {
                gj: 4 + Math.floor(lv * 1.5),
                mz: 4 + Math.floor(lv * 1.5),
                bj_per: 10,
                diff_busy_per: 9,
                add_bjsh_per: 9,
            },
            // Global/base properties:
            // {"bj_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "落花",
            distime: 20000,
            enable_skill: "sword",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 落花
                // 漫天暗器攻击敌人，每5%暴击增加一次攻击和5%的命中，最多10次
                me.send_room("$N使出「落花」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "漫天暗器攻击敌人，每5%暴击增加一次攻击和5%的命中，最多10次";
            },
        },
        pfm_1: {
            name: "定影",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 定影
                // 使用暗器攻击敌人，如果命中则使敌人定身8秒
                me.send_room("$N使出「定影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器攻击敌人，如果命中则使敌人定身8秒";
            },
        },
    };
}
