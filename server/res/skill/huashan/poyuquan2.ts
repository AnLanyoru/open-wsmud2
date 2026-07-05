import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/**
 * 劈石破玉拳进阶 (品级4)
 * 完善度50
 */
export default class extends SKILL {
    name = "劈石破玉拳";
    id = "poyuquan2";
    source_skill = "poyuquan";
    grade = 4;
    family = FAMILIES.HUASHAN;
    desc = "华山派拳脚功夫，原为劈石及破玉两路拳法绝学";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    slots: Array<{ prop: string; value: (lv: number) => number; format: (val: number) => string }> = [
        {
            prop: "poyu_mz",
            value: (lv: number) => 10,
            format: (val: number) => "破玉附加的命中增加" + val + "%",
        },
        {
            prop: "poyu_gj",
            value: (lv: number) => 60,
            format: (val: number) => "破玉附加的攻击力增加" + val + "%",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + int(lv * 1.5),
                mz: 10 + int(lv * 1.5),
                str: int(lv / 4),
                dex: int(lv / 4),
            },
            parry: {
                zj: 20 + int(lv * 1.5),
                fy: 10 + int(lv * 1.5),
                con: int(lv / 4),
            },
        };
    }

    pfm_set: PerformData = {
        po: {
            name: "破玉",
            distime: 16000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const zx_lv: number = me.query_skill("zixiashengong", 0);
                const zx_gj: number = zx_lv * 2;
                me.send_room("<HIY>$N沉喝一声，拳锋之上紫气暴涨，凝聚毕生功力——破玉一击，石破天惊！</HIY>", target);
                me.do_attack({
                    target: target,
                    gj: me.gj + lv + zx_gj,
                    mz: me.mz + lv,
                    no_weapon: true,
                    attack_msg: "<HIY>$N拳如硬玉，紫气萦绕，挟万钧之势砸向$n！</HIY>",
                    damage_msg: "<hir>只听砰的一声闷响，$n被$N一拳砸中，紫霞真气贯体而入，$p口喷鲜血倒飞出去！</hir>",
                    miss_msg: "<hic>可是$p奋力闪避，硬生生躲开了$P这石破天惊的一拳。</hic>",
                    parry_msg: "<hic>可是$p拼死招架，勉强挡开了$P这一击，双臂却已酸麻难当。</hic>",
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const zx_lv: number = me.query_skill("zixiashengong", 0);
                const zx_gj: number = zx_lv * 2;
                return "凝聚真气奋力一击，造成200%攻击力<mag>(+" + lv + ")</mag><mag>(紫霞神功+" + zx_gj + ")</mag>的伤害，等级越高命中越高。";
            },
        },
        pi: {
            name: "劈石",
            distime: 38000,
            enable_skill: "unarmed",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const par: DoAttackPar = {
                    gj: me.gj,
                    mz: me.mz + lv,
                    attack_msg: "<HIR>$N沉腰立马，双拳凝千斤之力，一式「劈石」挟裂石开碑之势砸向$n！</HIR>\n",
                    miss_msg: "<hic>$n见势不妙，纵身急退，险险避开了$P势大力沉的劈石一击。</hic>",
                    parry_msg: "<hic>$n拼尽全力格挡，虽挡住这一击，却被震得双臂发麻，气血翻涌。</hic>",
                    no_weapon: true,
                };
                me.do_attack(par);
                if (!par.is_dodged) {
                    let time: number = 5000 + int(lv / 500) * 1000;
                    if (time > 15000) time = 15000;
                    const reduce_per: number = 10 + int(lv / 200);
                    target.add_status({
                        id: "pishi",
                        name: "劈石",
                        desc: "防御和命中大幅降低",
                        downside: true,
                        prop: {
                            fy_per: -reduce_per,
                            mz_per: -reduce_per,
                        },
                        duration: time,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                let time: number = 5000 + int(lv / 500) * 1000;
                if (time > 15000) time = 15000;
                const reduce_per: number = 10 + int(lv / 200);
                return "劈石一击，命中后可降低目标" + reduce_per + "%防御和命中，持续" + toSec(time) + "秒。";
            },
        },
    };
}

// ========== 公共计算函数 ==========

/** 破玉攻击加成（紫霞神功部分） */
export function po_gj_zx(lv: number): number {
    return lv * 2;
}

/** 劈石持续时间 */
export function pi_time(lv: number): number {
    const t: number = 5000 + int(lv / 500) * 1000;
    return t > 15000 ? 15000 : t;
}

/** 劈石降低百分比 */
export function pi_reduce_per(lv: number): number {
    return 10 + int(lv / 200);
}
