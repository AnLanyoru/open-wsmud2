import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

// ========== 公共计算函数 ==========

/** 鲲字诀 — 恢复百分比 */
function kunPer(lv: number): number {
    return 15 + Math.floor(lv / 200);
}


/** 吸取内力 — 内置冷却（毫秒） */
function absorbCd(me: CHARACTER): number {
    let cd = 4000;
    if (cd < 1000) cd = 1000;
    return cd;
}

// ========== 技能类 ==========

export default class extends SKILL {
    name = "北冥神功";
    id = "beimingshengong3";
    grade = 6;
    is_hidden = true;
    family = FAMILIES.XIAOYAO;
    source_skill = "beimingshengong2";
    force_rad = 0.85;

    desc = "逍遥派镇派神功，可吸取他人内力以供己用，是迅速提升功力的捷径功法。";
    can_enables = ["force", "parry"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                con: Math.floor(lv * 0.51),
                dex: 1 + Math.floor(lv * 0.5),
                limit_mp: lv * 245,
                desc: "当你命中敌人后，会吸取对方内力增加自身最大内力\n唯一：将你内力的85%转化为气血",
            },
            parry: {
                zj: Math.floor(lv * 1.82),
                dex: 2 + Math.floor(lv * 0.25),
                max_hp: lv * 13,
                desc: "当你招架成功后会吸取对方内力增加自身最大内力",
            },
        };
    }

    do_force_attack(me: CHARACTER, target: CHARACTER): number {
        if (me.max_mp < me.limit_mp + me.query_prop("limit_mp")) {
            const cd = absorbCd(me);
            if (!me.query_temp("sk_beiming", 0)) {
                me.set_temp("sk_beiming", 1, cd);
                const gj = Math.round(me.query_skill("beimingshengong3", 0) / 10);
                const mp = Math.floor(gj * 120 / 100);
                if (target.max_mp > mp && target.mp > mp) {
                    target.notify("<hir>你顿觉全身内力如水银般循孔飞泄而出！</hir>");
                    me.notify("<hir>你觉得" + target.name + "的内力自手掌源源不绝地流了进来。</hir>");
                    target.mp -= mp;
                    me.max_mp += gj;
                }
            }
        }
        return 0;
    }

    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (par.is_parried && me.max_mp < me.limit_mp + me.query_prop("limit_mp")) {
            const lv = me.query_skill("beimingshengong3", 0);
            const cd = absorbCd(me);
            if (!me.query_temp("sk_beiming_parry", 0)) {
                me.set_temp("sk_beiming_parry", 1, cd);
                const gj = Math.round(lv / 10);
                const mp = Math.floor(gj * 120 / 100);
                if (target.mp > mp) {
                    target.notify("<hib>你顿觉全身内力如江河决堤般奔泻而出！</hib>");
                    me.notify("<hib>你觉得" + target.name + "的内力透过招架之势源源不绝地涌入丹田。</hib>");
                    target.mp -= mp;
                    me.max_mp += gj;
                }
            }
        }
    }

    pfm_set: PerformData = {
        huifu: {
            name: "鲲字诀",
            distime: 28500,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            no_auto: true,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const per = kunPer(lv);
                const hp = Math.floor(me.max_hp * per / 100);
                const mp = Math.floor(me.max_mp * per / 100);
                me.send_room("<him>$N默运北冥神功，周身紫气环绕，转眼间已恢复活力！\n</him>", target);
                me.add_hp(hp);
                me.add_mp(mp);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const per = kunPer(lv);
                return "战斗中恢复自己" + per + "%气血和内力。";
            },
        },
    };
}
