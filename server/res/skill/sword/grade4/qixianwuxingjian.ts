import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "七弦无形剑";
    id = "qixianwuxingjian";
    grade = 4;
    is_public = true;
    
    // 原始描述：梅庄大庄主黄钟公所创绝技，以琴音为剑，无形无质却暗藏杀机，可伤人于无形之中。
    desc = "梅庄大庄主黄钟公所创绝技，以琴音为剑，无形无质却暗藏杀机，可伤人于无形之中";
    can_enables = ["sword"];
    attack_actions = [
        "$N轻拨琴弦，一道无形剑气激射而出，正是「<HIM>宫商角徵</HIM>」，音波如刀割向$n的$l",
        "$N指法突变，五弦齐振，发出「<HIC>五音乱神</HIC>」，音波化作无形利刃切割$n周身",
        "$N左手按弦，右手急拨，一道「<HIG>高山流水</HIG>」剑音如瀑布般倾泻向$n",
        "$N琴音倏转低沉，一招「<HIB>幽谷寒泉</HIB>」，阴寒刺骨的音波直侵$n的$l",
        "$N十指翻飞，琴音激越，正是「<HIY>金戈铁马</HIY>」，剑气音波如万马奔腾冲向$n",
        "$N忽而一弦独响，正是「<HIM>凤鸣九皋</HIM>」，一道尖锐剑气破空刺向$n的$l",
        "$N双手按住琴弦，骤然一放，使出「<RED>弦断惊雷</RED>」，霹雳般的音波炸向$n",
        "$N微微一笑，指法轻柔，一曲「<HIG>阳春白雪</HIG>」，音波剑意如春风化雨笼罩$n"
    ];
    learn_condition = {
        max_mp: 15000,
        skill: {
            sword: 300
        }
    };
    slots = [
        {
            prop: 'qx_yinbo',
            value: (lv: number) => 10,
            format: (val: number) => '每次攻击和七绝音时，必定打出音波',
        },
        {
            prop: 'qx_moyin',
            value: (lv: number) => 10,
            format: (val: number) => '魔音贯耳无法躲闪和招架',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.32),
                mz: Math.floor(lv * 1.62),
                dex: 8 + Math.floor(lv * 0.1),
                desc: "唯一：攻击时有概率打出音波伤人",
            },
        };
    }

    pfm_set: PerformData = {
        qijue: {
            name: "七绝音",
            distime: 36000,
            enable_skill: "sword",
            mp: 60,
            release_time: 4000,
            attack_msgs: [
                "<him>「宫」弦一振，低沉音波如闷雷滚滚涌向$n</him>",
                "<him>「商」弦激荡，杀伐之音化作无形剑气斩向$n的$l</him>",
                "<him>「角」弦颤鸣，音波如春风化雨渗透$n周身大穴</him>",
                "<him>「徵」弦高亢，炽烈音波如烈焰燎原席卷$n</him>",
                "<him>「羽」弦清越，冷冽音波如寒冰刺骨直侵$n心脉</him>",
                "<him>$N指法忽变，二弦齐响，阴阳二音交错缠绕攻向$n</him>",
                "<him>$N七弦齐振，天地为之失色，一道无形巨音轰向$n</him>",
            ],
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var self = this as PERFORM;
                var count = 7;
                me.send_room("<him>$N盘膝而坐，$w横于膝上，十指拨弦，琴音如剑，无形剑气破空而出！</him>\n", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        attack_msg: self.attack_msgs![i] || self.attack_msgs!.random(),
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "发出七道弦音攻击目标心脉，七音齐鸣，摧心裂肺。";
            },
        },
        moyin: {
            name: "魔音贯耳",
            distime: 47000,
            enable_skill: "sword",
            mp: 80,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var time = calcMoyinTime(lv);
                var sh = me.do_attack({
                    target: target,
                    attack_msg: "<red>$N面容肃穆，指尖凝聚一道无形魔音，猛然弹出，直贯$n双耳！</red>",
                    miss_msg: "<cyn>$n察觉有异，急忙运功封住耳脉，险险避过这道魔音。</cyn>",
                    damage_msg: "<hir>$n被魔音贯耳，只觉得头脑嗡鸣，气血翻涌，防御与身法大打折扣！</hir>",
                });
                if (sh) {
                    target.add_status({
                        id: "moyin",
                        name: "魔音",
                        duration: time,
                        downside: true,
                        prop: {
                            fy_per: -30,
                            ds_per: -30,
                        },
                        desc: "被魔音贯耳所扰，耳中轰鸣不绝，防御与躲闪大幅降低",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var time = calcMoyinTime(lv);
                return "以魔音侵入目标心脉，命中后使其防御躲闪降低30%，持续" + toSec(int(time)) + "秒。";
            },
        },
    };
}

function calcMoyinTime(lv: number): number {
    const t = 12000 + Math.floor(lv * 2);
    if (t > 20000) return 20000;
    return t;
}
