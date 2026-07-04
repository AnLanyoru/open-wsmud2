import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

export default class extends SKILL {
    name = "诸天剑诀";
    id = "yitianjianfa4";
    grade = 6;
    family = FAMILIES.EMEI;
    is_ultimate = true;
    desc = "上古梵门绝技，灭神魔渡天下";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: lv * 3,
                mz: lv * 3,
                mz_per: 5 + Math.floor(lv / 200),
                diff_fy_per: 5 + Math.floor(lv / 200),
                add_bjsh_per: 10 + Math.floor(lv / 300),
                desc: "超渡：战斗中击杀敌人后恢复自己的全部血量，清理异常状态",
            },
        };
    }

    /**
     * 超渡 — 击杀敌人时恢复全部气血并清理异常状态
     */
    on_enemy_die(me: CHARACTER, target: CHARACTER): void {
        me.add_hp(me.max_hp - me.hp);
        me.clear_downside(true);
        me.send_room(
            "<ord>$N超渡了$n的亡魂，周身佛光普照，伤势痊愈。</ord>",
            target,
        );
    }

    pfm_set: PerformData = {
        du: {
            name: "渡魔",
            distime: 15000,
            enable_skill: "sword",
            mp: 1190,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const per = 20 + Math.floor(lv / 400);
                const count = me.query_status("dumo") || 0;
                const totalPer = 100 + per * count;
                if (
                    me.do_attack({
                        attack_msg:
                            "<ord>$N口宣佛号，手中$W化作漫天梵光——魔渡七重天！</ord>",
                        damage_msg:
                            "<ord>$n被梵光贯穿，七重天魔之力透体而过！</ord>",
                        target: target,
                        gj: Math.floor(me.gj * totalPer / 100),
                        mz: Math.floor(me.mz * totalPer / 100),
                    })
                ) {
                    me.add_status({
                        id: "dumo",
                        name: "渡魔",
                        desc: "渡魔层数",
                        max_count: 7,
                        override: 1,
                        count: 1,
                        prop: {
                            gj_per: per,
                            mz_per: per,
                        },
                        duration: 15000,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const per = 20 + Math.floor(lv / 400);
                return (
                    "魔渡七重天，每层增加" +
                    per +
                    "%伤害和命中，超度敌人后重置绝招CD"
                );
            },
        },
        fo: {
            name: "渡佛",
            distime: 60000,
            enable_skill: "sword",
            mp: 1390,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const ratio = (30 + Math.floor(lv / 200)) / 100;
                // 清除敌人的正面状态
                target.clear_downside(false);
                me.send_room(
                    "<ord>$N高举$W，口诵佛号：魔易渡，佛难超！佛光普照之下，$n的护体真气如冰雪消融。</ord>",
                    target,
                );
                if (
                    me.do_attack({
                        attack_msg:
                            "<ord>$N手中$W佛光大盛，一剑斩向$n！</ord>",
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                    })
                ) {
                    // TODO: 唤出心魔 — 对NPC造成伤害后召唤具有敌人大部分属性和技能的心魔
                    // 心魔使用玩家 ratio 比例的气血内力上限，持续30秒，每分钟可召唤一个
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const ratio = 30 + Math.floor(lv / 200);
                return (
                    "魔易渡，佛难超，清除敌人的正面状态，对敌人(NPC)造成伤害后唤出对方心魔替自己战斗，心魔具有敌人的大部分属性和技能，使用你" +
                    ratio +
                    "%的气血内力上限(每分钟可召唤一个，最多存在30秒)"
                );
            },
        },
    };
}
