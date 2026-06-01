import { SKILL } from "../../../core/skill/skill.js";
import type { EnablePropMap, LearnCondition } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "劈石破玉拳";
    id = "poyuquan";
    grade = 1;
    family = FAMILIES.HUASHAN;
    attack_actions = [
        "$N右脚立定、左脚虚点，一式「起手式」，左右手一高一低，击向$n的$l",
        "$N左脚虚踏，全身右转，一招「石破天惊」，右拳猛地击向$n的$l",
        "$N双手大开大阖，宽打高举，使一招「铁闩横门」，双拳向$n的$l打去",
        "$N左掌圈花扬起，屈肘当胸，右手虎口朝上，一招「千斤坠地」打向$n的$l",
        "$N使一招「傍花拂柳」，上身前探，双拳划了个半圈，击向$n的$l",
        "$N双拳划弧，一记「金刚挚尾」，掌出如电，一下子切到$n的手上",
        "$N施出「封闭手」，双拳拳出如风，同时打向$n头，胸，腹三处要害",
        "$N左脚内扣，右腿曲坐，一式「粉石碎玉」，双拳齐齐捶向$n的胸口"
    ];
    desc = "华山派拳脚功夫，原为劈石及破玉两路拳法绝学";
    can_enables = ["unarmed", "parry"];
    learn_condition: LearnCondition = {
        max_mp: 700,
        skill: {
            unarmed: 50
        }
    };
    pfm_set = {
        po: {
            name: "破玉",
            distime: 16000,
            enable_skill: "unarmed",
            weapon_type: WEAPON_TYPE.UNARMED,
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    no_weapon: true,
                    attack_msg: "<HIY>$N大喝一声，握紧的拳头蒙上一层淡淡的紫色雾气，闪电般重重的击向$n</HIY>",
                    damage_msg: "<hir>只见$P的紫拳如同硬玉般砸得$p飞了出去，重重的摔在地上，吐血不止！</hir>",
                    miss_msg: "<hic>可是$p奋力闪避，硬生生的躲开了$P这一招。</hic>",
                    parry_msg: "<hic>可是$p奋力招架，硬生生的挡开了$P这一招。</hic>"
                });
                me.end_attack(target);
            },
            query_desc: function (me, lv) {
                return "凝聚真气奋力一击，造成" + me.gj + "<hir>(+" + lv + ")</hir><mag>(+" + (me.query_skill("zixiashengong", 0) * 2) + ")</mag>点伤害。";
            }
        },
        pi: {
            name: "劈石",
            distime: 38000,
            enable_skill: "unarmed",
            weapon_type: WEAPON_TYPE.UNARMED,
            mp: 25,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                let par: DoAttackPar = {
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<HIR>$N沉腰立马，双拳凝聚千斤之力，一声怒喝使出「劈石」绝招，带着裂石之势砸向$n！</HIR>\n",

                    miss_msg: "<hic>$n见势不妙，纵身急退，险险避开了$P势大力沉的劈石一击。</hic>",
                    parry_msg: "<hic>$n拼尽全力格挡，虽挡住了这一击，却被震得双臂发麻，气血翻涌。</hic>",
                    no_weapon: true
                };
                me.do_attack(par);
                if (!par.is_dodge) {
                    let time = 5000 + parseInt(lv / 2);
                    if (time > 15000) time = 15000;
                    let fy = lv * 2 + 600;
                    target.add_status({
                        id: "pishi",
                        name: "劈石",
                        desc: "降低防御和招架",
                        downside: true,
                        prop: {
                            fy: -fy
                        },
                        duration: time
                    });

                }
                me.end_attack(target);

            },
            query_desc: function (me, lv) {
                let time = Math.floor(5 + lv / 500);
                if (time > 15) time = 15;
                let fy = lv + 600;
                return `劈石一击，命中后可降低目标${fy}点防御，持续${time}秒。`;
            }
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: lv + 20
            },
            parry: {
                zj: lv + 20
            }
        };
    }
}

