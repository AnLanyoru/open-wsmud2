import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "六脉神剑";
    id = "liumaishenjian";
    grade = 5;
    is_public = true;
    
    desc = "大理段氏所藏有的超强剑气绝学，能够以指尖激荡出破体剑气伤人于无形";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N食指连弹，一式「<HIC>少商剑</HIC>」剑气纵横，凌厉无匹地射向$n的$l",
        "$N轻抬食指，一道「<HIC>商阳剑</HIC>」剑气破空而出，巧妙无比地刺向$n的$l",
        "$N屈指一弹，中冲剑诀运起，「<HIC>中冲剑</HIC>」大开大阖，气势雄迈地涌向$n的$l",
        "$N无名指轻轻一挑，「<HIC>关冲剑</HIC>」剑气拙扑古拙，却暗藏杀机地袭向$n的$l",
        "$N小指轻挥，「<HIC>少冲剑</HIC>」轻灵迅捷，变幻莫测地刺向$n的$l",
        "$N右手小指一捺，「<HIC>少泽剑</HIC>」剑气忽来忽去，变化精微地射向$n的$l",
        "$N双手齐出，六脉剑气纵横交错，织成一道密不透风的剑网罩向$n的$l",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                add_sh_per: 4,
                diff_fy_per: 4,
                desc: "当你命中敌人后会对附近一名敌人产生溅射伤害",
            },
        };
    }

    query_prop(lv: number, me: CHARACTER) {
        return {
            add_sh_per: 1 + Math.floor(lv / 250),
            diff_fy_per: 1 + Math.floor(lv / 250),
        };
    }

    pfm_set: PerformData = {
        wuxingjianqi: {
            name: "无形剑气",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var time = wuxingFaintTime(lv);
                var is_parried = false;
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<hib>$N深吸一口气，内力自丹田澎湃而出，尽数贯注指尖，一道凌厉绝伦的「<HIC>无形剑气</HIC>」破空激射！</hib>",
                    miss_msg: "<cyn>$n见$N指尖剑气纵横，不敢硬接，足尖一点倒纵出数丈之外！</cyn>",
                    damage_msg: "<hir>只听「嗤」的一声，无形剑气已洞穿$n的护体真气，带起一蓬血雨！</hir>",
                    on_parry: function(_t: CHARACTER, ispa: boolean) {
                        is_parried = ispa;
                        return false;
                    },
                });
                if (sh && !is_parried) {
                    target.add_status({
                        id: "liumai_faint",
                        name: "昏迷",
                        duration: time,
                        is_faint: true,
                        downside: true,
                        desc: "你被无形剑气所伤，昏迷不醒",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var time = wuxingFaintTime(lv);
                return "以强劲的内力贯于指尖，将内力化为无形剑气伤敌。如果敌方招架成功只受到伤害，否则使敌人昏迷" + toSec(time) + "秒。";
            },
        },
        liumaimzongheng: {
            name: "六脉纵横",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var mz_reduce = liumaiMzReduce(lv);
                var count = liumaiCount(lv);
                var gj = Math.floor(me.gj * 0.8);
                me.send_room("<hiy>$N双指齐出，六脉剑气纵横交错，少商、商阳、中冲、关冲、少冲、少泽六道剑气如狂风暴雨般席卷而出！</hiy>", target);
                for (var i = 0; i < count; i++) {
                    var now_target = me.query_enemy();
                    if (!now_target || now_target.hp <= 0) break;
                    var enemies = me.get_nearby_enemies();
                    if (enemies.length > 0) {
                        now_target = enemies[me.random(enemies.length)];
                    }
                    var hit = me.do_attack({
                        target: now_target,
                        gj: gj,
                        mz: me.mz,
                        attack_before: "<hic>第" + (i + 1) + "剑——</hic>",
                        no_append: true,
                    });
                    if (hit) {
                        now_target.add_status({
                            id: "liumai_pojia",
                            name: "破甲",
                            duration: 10000,
                            downside: true,
                            override: 1,
                            prop: {
                                fy_per: -mz_reduce,
                            },
                            desc: "防御降低" + mz_reduce + "%",
                        }, me);
                    }
                    me.end_attack(now_target);
                }
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var mz_reduce = liumaiMzReduce(lv);
                var count = liumaiCount(lv);
                return "六脉齐射，随机攻击你的敌人，连续" + count + "次攻击，命中一次减少对方" + mz_reduce + "%防御，持续10秒";
            },
        },
    };
}

function wuxingFaintTime(lv: number): number {
    var time = 2500 + lv * 4.5;
    if (time > 7000) time = 7000;
    return time;
}

function liumaiMzReduce(lv: number): number {
    var mz_reduce = 2 + Math.floor(lv / 500);
    if (mz_reduce > 4) mz_reduce = 4;
    return mz_reduce;
}

function liumaiCount(lv: number): number {
    var count = 3 + Math.floor(lv / 500);
    if (count > 6) count = 6;
    return count;
}
