import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "先天太极";
    id = "taijishengong2";
    grade = 5;
    family = FAMILIES.WUDANG;
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                fy: lv * 2,
                zj: lv * 2,
                fy_per: 6,
                limit_mp: lv * 298,
                desc: "唯一：将你内力的100%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "真武除邪",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 真武除邪
                // 将太极真气运转周身，20秒内增加你32%气血,招架增加32%,受到的伤害减少32%
                me.send_room("$N使出「真武除邪」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将太极真气运转周身，20秒内增加你32%气血,招架增加32%,受到的伤害减少32%";
            },
        },
        pfm_1: {
            name: "一气化三清",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 一气化三清
                // 每隔8秒化为三清之一使用你目前装备的技能绝招攻击对方，持续4次。
                me.send_room("$N使出「一气化三清」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "每隔8秒化为三清之一使用你目前装备的技能绝招攻击对方，持续4次。";
            },
        },
    };
}
