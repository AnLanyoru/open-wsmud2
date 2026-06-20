import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "杀生决";
    id = "shashengjue2";
    grade = 4;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的高级内功";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+120000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '斩杀持续时间增加2秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 2 + lv * 2,
                mz: 1 + lv * 2,
                add_bjsh_per: 4,
                limit_mp: lv * 160,
                desc: "唯一将你内力的75%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "斩杀",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 斩杀
                // 全力战斗，15秒内增加自己30%攻击力，33%暴击几率
                me.send_room("$N使出「斩杀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "全力战斗，15秒内增加自己30%攻击力，33%暴击几率";
            },
        },
        pfm_1: {
            name: "隐杀",
            distime: 45000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 隐杀
                // 脱离战斗，迅速隐入其他房间
                me.send_room("$N使出「隐杀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "脱离战斗，迅速隐入其他房间";
            },
        },
    };
}
