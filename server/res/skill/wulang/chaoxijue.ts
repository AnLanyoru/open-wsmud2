import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "潮汐诀";
    id = "chaoxijue";
    grade = 3;
    family = FAMILIES.WULANG;
    force_rad = 0.85;
    desc = "无浪门镇派内功，以潮汐起落为纲，融阴阳二气为用，可聚浪劲于内，化潮汐于外。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'cxj_gm',
            value: (lv: number) => Math.floor(lv / 5),
            format: (val: number) => `潮起时每层潮汐额外增加${val}点攻击和命中`,
        },
        {
            prop: 'cxj_fq',
            value: (lv: number) => Math.floor(lv / 5),
            format: (val: number) => `潮落期间每层潮汐额外增加${val}防御和${val * 5}气血`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 1.2) + 20,
                fy: Math.floor(lv * 1.2) + 20,
                limit_mp: lv * 105,
                desc: "潮汐：命中后增加自身潮汐层数\n唯一：将你内力的85%转化为气血",
            },
        };
    }

    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_dodged && !par.is_parried) {
            me.add_status({
                id: "chaoxi",
                name: "潮汐",
                desc: "潮汐之力在体内涌动，攻击与内力逐渐增强",
                duration: 30000,
                override: 1,
                count: 1,
                max_count: 10
            });
        }
    }

    pfm_set: PerformData = {
        qi: {
            name: "潮起",
            distime: 25000,
            enable_skill: "force",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const layers = me.query_status("chaoxi");
                if (layers <= 0) {
                    me.notify("你没有积累任何潮汐层数。");
                    return;
                }
                me.remove_status("chaoxi", true);
                const duration = query_cx_duration(lv);
                me.set_temp("chaoxi_layers", layers, duration);
                const perGj = query_qi_per(lv, me);
                const totalGj = perGj * layers;
                me.send_room("<hic>$N默运潮汐诀，体内潮汐之力骤然澎湃，浪劲层层翻涌，尽数化作凌厉攻势！</hic>", target);
                me.add_status({
                    id: "chaoxi_up",
                    name: "潮起",
                    desc: `潮起之势：攻击+${totalGj}，命中+${totalGj}`,
                    duration: duration,
                    prop: {
                        gj: totalGj,
                        mz: totalGj,
                    },
                    finish_msg: "$N周身浪劲徐徐退去，潮起之势如落潮般渐归平静。",
                });
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const duration = query_cx_duration(lv) / 1000;
                const per = query_qi_per(lv, me);
                return `消耗所有潮汐层数，${duration}秒内每一层潮汐提升${per}攻击与命中`;
            },
        },
        luo: {
            name: "潮落",
            distime: 25000,
            enable_skill: "force",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const layers = me.query_status("chaoxi");
                if (layers <= 0) {
                    me.notify("你没有积累任何潮汐层数。");
                    return;
                }
                me.remove_status("chaoxi", true);
                const duration = query_cx_duration(lv);
                me.set_temp("chaoxi_layers", layers, duration);
                const perFy = query_luo_per(lv, me);
                const perHp = perFy * 5;
                const totalFy = perFy * layers;
                const totalHp = perHp * layers;
                me.send_room("<hic>$N默运潮汐诀，体内潮汐之力沉凝如渊，暗劲绵绵回流，尽数化作沉稳守势！</hic>", target);
                me.add_status({
                    id: "chaoxi_down",
                    name: "潮落",
                    desc: `潮落之势：防御+${totalFy}，气血+${totalHp}`,
                    duration: duration,
                    prop: {
                        fy: totalFy,
                        max_hp: totalHp,
                    },
                    finish_msg: "$N周身暗劲徐徐退去，潮落之势如退潮般渐归平静。",
                });
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const duration = query_cx_duration(lv) / 1000;
                const perFy = query_luo_per(lv, me);
                const perHp = perFy * 5;
                return `消耗所有潮汐层数，${duration}秒内每一层潮汐提升${perFy}防御和${perHp}气血`;
            },
        },
    };
}

/** 潮起/潮落 — 持续时间（毫秒） */
function query_cx_duration(lv: number): number {
    return Math.min(30, 10 + Math.floor(lv / 100)) * 1000;
}

/** 潮起 — 每层攻击与命中（含进阶加成） */
function query_qi_per(lv: number, me: CHARACTER): number {
    const base = 10 + Math.floor(lv / 2);
    const extra = me.query_prop("cxj_gm");
    return base + extra;
}

/** 潮落 — 每层防御（含进阶加成） */
function query_luo_per(lv: number, me: CHARACTER): number {
    const base = 10 + Math.floor(lv / 2);
    const extra = me.query_prop("cxj_fq");
    return base + extra;
}
