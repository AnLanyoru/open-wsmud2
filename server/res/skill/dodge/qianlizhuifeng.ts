import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "千里追风";
    id = "qianlizhuifeng";
    grade = 2;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门轻功绝技，千里追捕，无往不胜";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '追风额外增加0.2秒攻速',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '追风的持续时间额外增加2秒',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '追风额外减少0.5秒释放速度',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 1700,
                gjsd: 200,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "追风",
            distime: 45000,
            enable_skill: "dodge",
            mp: 1530,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 追风
                // 7秒内增加你1.1秒的攻击速度和释放速度
                me.send_room("$N使出「追风」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "7秒内增加你1.1秒的攻击速度和释放速度";
            },
        },
    };
}
