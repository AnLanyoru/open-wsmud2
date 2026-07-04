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
    attack_actions = [
        "$N口宣佛号，$W上梵光流转，一剑挥出如佛光普照，直指$n的$l",
        "$N面露慈悲，手中$W却裹挟着渡魔之力，剑锋过处虚空震颤，斩向$n的$l",
        "$N双手举剑过顶，$W上浮现诸天梵文，一道金色剑罡轰然劈向$n的$l",
        "$N低吟密咒，$W化作漫天金光，每一道光芒都是一道剑气，笼罩$n的$l",
        "$N身与剑合，$W上绽放无量佛光，如金刚怒目般斩向$n的$l",
        "$N剑指苍穹，$W引动九天梵音，一道贯穿天地的剑柱直落$n的$l",
    ];

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
     * 超渡 — 击杀敌人时恢复全部气血、清理异常状态
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
                const heavens = [
                    "<ord>-----须弥天！-----</ord>\n$N脚踏须弥，$W引动诸天之力，第一重天魔劫降临！",
                    "<ord>-----仞利天！-----</ord>\n$N剑指苍穹，$W光华暴涨，第二重天魔劫劈空而落！",
                    "<ord>-----焰摩天！-----</ord>\n$N低诵真言，$W上烈焰梵光交织，第三重天魔劫焚尽万物！",
                    "<ord>-----兜率天！-----</ord>\n$N身与剑合，$W化作弥勒净土之光，第四重天魔劫普照世间！",
                    "<ord>-----化乐天！-----</ord>\n$N面露慈悲，$W裹挟着化度众生之力，第五重天魔劫变幻莫测！",
                    "<ord>-----他化天！-----</ord>\n$N剑势一转，$W引动他化自在之力，第六重天魔劫颠倒乾坤！",
                    "<ord>-----梵摩天！-----</ord>\n$N宝相庄严，$W绽放无量梵光——第七重天魔劫灭神渡魔！",
                ];
                const damageMsgs = [
                    "<ord>$n被须弥天之力镇压，周身剧震！</ord>",
                    "<ord>$n被仞利天之力贯穿，气血翻涌！</ord>",
                    "<ord>$n被焰摩天之力焚灼，痛彻骨髓！</ord>",
                    "<ord>$n被兜率天之力净化，灵肉分离！</ord>",
                    "<ord>$n被化乐天之力笼罩，五感俱失！</ord>",
                    "<ord>$n被他化天之力碾碎，防御崩溃！</ord>",
                    "<ord>$n被梵摩天之力渡化——堕入无间！</ord>",
                ];

                let gj = me.gj;
                let mz = me.mz;
                let slain = false;

                for (let i = 0; i < 7; i++) {
                    const nowTarget = me.query_enemy() || target;
                    if (!nowTarget || slain) break;

                    if (
                        me.do_attack({
                            target: nowTarget,
                            attack_msg: heavens[i],
                            damage_msg: damageMsgs[i],
                            gj: gj,
                            mz: mz,
                        })
                    ) {
                        // 每命中一重天，下一击的倍率翻升
                        gj = Math.floor(gj * (100 + per) / 100);
                        mz = Math.floor(mz * (100 + per) / 100);
                        // 若此击毙敌，记录并终止后续攻击
                        if (nowTarget.hp <= 0) {
                            slain = true;
                        }
                    }
                }

                if (slain) {
                    me.clear_distime("sword/du");
                    me.send_room(
                        "<ord>$n于七重梵光中化作梦幻泡影，渡尽劫波，剑光复照！</ord>",
                        target,
                    );
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
