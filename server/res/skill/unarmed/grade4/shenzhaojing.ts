import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import type {LearnCondition} from "../../../../types/events.js";

/** 完成度 30 */
export default class extends SKILL {
    name = "神照经";
    id = "shenzhaojing";
    grade = 4;

    force_rad = 0.8;
    
    desc = "连城诀中记载的绝世内功心法，乃是武林中至高无上的玄门正宗，神照所至，气血盈贯";
    can_enables = ["unarmed","force"];
    attack_actions = [
        "$N深吸一口气，内力澎湃而出，一拳平平无奇却又威势惊人地击向$n的$l",
        "$N双掌交错，内劲如潮，一招一式间暗含神照经的无上心法",
        "$N运起神照经，掌风凌厉，真气凝而不散，直取$n的$l",
        "$N内力流转，一拳击出竟带起呼啸风声，正是神照经的上乘功夫",
        "$N身形微动，一掌拍出，看似缓慢实则快如闪电，直击$n的$l",
        "$N神照功运于双掌，掌力未到，一股炽热真气已扑面而至",
    ];
    learn_condition: LearnCondition = {
      "str1": 30,
      "con1": 30
    };

    slots = [
        {
            prop: 'int',
            value: (lv: number) => 210,
            format: (val: number) => '额外增加' + val + '点悟性',
        },
        {
            prop: 'szj_jing_qx',
            value: (lv: number) => 30,
            format: (val: number) => '拳经附加的额外气血增加' + val + '%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                str: 10 + Math.floor(lv / 6),
                con: 10 + Math.floor(lv / 6),
                dex: 10 + Math.floor(lv / 6),
                int: 10 + Math.floor(lv / 6),
                limit_mp: lv * 150,
                desc: "唯一：将你内力的80%转化为气血",
            },
            unarmed: {
                gj: 100 + Math.floor(lv * 1.6),
                mz: 100 + Math.floor(lv * 1.6),
                str: 10 + Math.floor(lv / 5),
                con: 10 + Math.floor(lv / 5),
            },
        };
    }

    pfm_set: PerformData = {
        zhao: {
            name: "神照",
            distime: 60000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var duration = 21000 + lv * 9;
                var attrBonus = Math.floor(30 + lv * 0.18);

                me.send_room("<HIC>$N一声长啸，神照经真气透体而出，周身霞光万道，气势暴涨！</HIC>", target);
                me.add_status({
                    id: "force",
                    name: "神照",
                    duration: duration,
                    prop: {
                        str: attrBonus,
                        con: attrBonus,
                        dex: attrBonus,
                    },
                    finish_msg: "<HIW>$N身上的神照真气渐渐消散。</HIW>",
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var attrBonus = Math.floor(30 + lv * 0.18);
                return "神照护体，在30秒内增加你" + attrBonus + "点根骨，臂力，身法";
            },
        },
        jing: {
            name: "拳经",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var strDmg = Math.floor(me.str * 5);
                var shieldHp = Math.floor(1512 + lv * 1.5);
                const qxSh = me.query_prop("szj_jing_qx");
                shieldHp = Math.floor(shieldHp * (1 + qxSh / 100));

                me.send_room("<HIC>$N沉腰坐马，一式直拳缓缓推出，看似平淡无奇，实则蕴含神照经无上内力！</HIC>", target);
                me.do_attack({ target, gj: Math.floor(me.gj * 0.01) + strDmg, mz: me.mz });

                if (target.hp > 0) {
                    me.add_status({
                        id: "weapon",
                        name: "拳经",
                        duration: 15000,
                        prop: {
                            shield: shieldHp,
                        },
                        finish_msg: "<HIW>$N周身的拳经护盾渐渐消散。</HIW>",
                    });
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                const qxSh = me.query_prop("szj_jing_qx");
                var shieldHp = Math.floor(1512 + lv * 1.5);
                shieldHp = Math.floor(shieldHp * (1 + qxSh / 100));
                return "一式直拳对敌人造成伤害，你臂力越高造成的伤害越大，命中后给自己增加一个吸收" + shieldHp + "伤害的护盾。";
            },
        },
    };
}
