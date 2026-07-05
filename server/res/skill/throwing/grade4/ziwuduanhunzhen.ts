import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "子午断魂针";
    id = "ziwuduanhunzhen";
    grade = 4;

    // 原始描述：药王谷秘传暗器手法，专打周身大穴，中者经脉受损，功力难复
    desc = "药王谷秘传暗器手法，专打周身大穴，中者经脉受损。";
    can_enables = ["throwing"];
    attack_actions = [
        "$N手腕轻抖，一枚$T无声无息地射向$n的$l",
        "$N指尖寒光一闪，$T已破空而出，直取$n周身要穴",
        "$N反手一探，$T自袖底飞出，轨迹刁钻诡异",
        "$N屈指一弹，$T化作一道细不可察的寒芒，直刺$n的$l",
        "$N双手交错，两枚$T分取$n左右大穴",
        "$N冷哼一声，$T后发先至，瞬间已到$n面前",
    ];

    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '子午断魂针忽视对方10%防御',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '子午断魂针降低对方伤害的效果额外增加12',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 9 / 5),
                mz: 4 + Math.floor(lv * 9 / 5),
                mz_per: 1 + int(lv / 500),
                add_sh_per: 1 + int(lv / 500),
            },
        };
    }

    pfm_set: PerformData = {
        duan: {
            name: "断魂",
            distime: 25000,
            enable_skill: "throwing",
            mp: 60,
            release_time: 1800,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIR>$N面罩寒霜，扬手间两道乌光破空而出，直取$n胸前大穴！</HIR>", target);
                for (var i = 0; i < 2; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz });
                }

                if (target.hp > 0) {
                    target.add_status({
                        id: "duanhun_jiangshang",
                        name: "断魂",
                        desc: "经脉受损，伤害降低",
                        duration: 15000,
                        downside: true,
                        no_diff: true,
                        prop: {
                            add_sh_per: -25,
                        },
                        finish_msg: "<HIG>$n经脉中的断魂针劲渐渐消散。</HIG>",
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "发射2枚子午针攻击目标，命中后使对方经脉受损，伤害降低25%。";
            },
        },
    };
}
