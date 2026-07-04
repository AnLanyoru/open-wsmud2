import {SKILL} from "../../../../core/skill/skill.js";
import type {EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../../core/char/character.js";

// ============================================================
// 缩地成寸 — 公共绝世神功（蜀山玄门）
// ============================================================

export default class extends SKILL {
    name = "缩地成寸";
    id = "suodichengcun";
    grade = 5;

    desc = "蜀山玄门身法，传闻练到极致可一步千里，凭空瞬移，隐迹藏形。";
    can_enables = ["dodge"];

    dodge_actions = [
        "$n足踏玄门步法，身形一晃，宛如缩地成寸般凭空横移数尺，$N的攻势尽数落空。",
        "却见$n默运玄功，身形倏忽不见，$N一击落空，$n已在数丈之外负手而立。",
        "$n口中念念有词，身随诀动，「嗖」的一声凭空消失，$N收招不及，招式尽泄于空处。",
        "$n使出一式「咫尺天涯」，$N只觉眼前一花，$n已如鬼魅般移至$P身后，$N的攻势透影而过。",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        const per = query_sdcc_per(lv);
        return {
            dodge: {
                ds: Math.floor(lv * 2.2) + 110,
                gj: Math.floor(lv * 1.8) + 110,
                fy: Math.floor(lv * 1.8) + 110,
                gj_per: 5 + Math.floor(lv * 3 / 1000),
                fy_per: 5 + Math.floor(lv * 3 / 1000),
                desc:
                    "躲闪失败后会额外增加一次躲闪判定，并增加" +
                    per +
                    "%有效值",
            },
        };
    }

    /**
     * 缩地成寸 — 躲闪失败后额外进行一次躲闪判定
     */
    on_dodge(target: CHARACTER, attacker: CHARACTER, par: DoAttackPar): void {
        const lv: number = target.query_skill("suodichengcun", 0);
        if (!lv) return;

        const extraPer = query_sdcc_per(lv);
        const boostedDs = Math.floor(target.ds * (100 + extraPer) / 100);
        const mz = par.mz ?? attacker.mz;

        // 额外躲闪判定
        const reDodged = Math.random() * (boostedDs / 2) + boostedDs / 2 > mz;

        if (reDodged) {
            par.is_dodged = true;
            par.is_parried = false;
        }
    }
}

// ============================================================
// 缩地成寸 — 公共计算函数
// ============================================================

/** 缩地成寸：额外躲闪有效值百分比 */
function query_sdcc_per(lv: number): number {
    return Math.floor(lv / 100);
}
