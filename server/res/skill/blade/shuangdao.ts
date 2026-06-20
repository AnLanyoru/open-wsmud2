import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "双刀流";
    id = "shuangdao";
    grade = 3;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门的刀法，适合锦衣卫的群体战斗功法";
    can_enables = ["blade"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '拖刀术使用其他刀造成伤害也会使对方昏迷',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '滚刀术在使用其他刀时也可以突破攻速上限',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '滚刀术期间造成的伤害增加50%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: 1404,
                gjsd_per: 3,
                mz_per: 3,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "拖刀术",
            distime: 18000,
            enable_skill: "blade",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 拖刀术
                // 拖刀转身，引诱敌人，回首一刀，无法躲闪
                me.send_room("$N使出「拖刀术」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "拖刀转身，引诱敌人，回首一刀，无法躲闪";
            },
        },
        pfm_1: {
            name: "滚刀术",
            distime: 30000,
            enable_skill: "blade",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 滚刀术
                // 8秒内，增加攻速攻击敌人，期间无法被控制，不能释放其他技能
                me.send_room("$N使出「滚刀术」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "8秒内，增加攻速攻击敌人，期间无法被控制，不能释放其他技能";
            },
        },
    };
}
