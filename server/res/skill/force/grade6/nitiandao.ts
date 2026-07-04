import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PERFORM, PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "逆天道";
    id = "nitiandao";
    grade = 6;
    force_rad = 1.5;

    desc = "岁月轮回，逆天而行";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        const hpPer = 5 + Math.floor(lv / 100);
        const shPer = 5 + Math.floor(lv / 200);
        const slowPer = 10 + Math.floor(lv / 200);
        const reversePct = (10 + lv / 300).toFixed(1);
        return {
            force: {
                hp_per: hpPer,
                diff_sh_per: shPer,
                add_sh_per: shPer,
                limit_mp: lv * 1100,
                desc: "震慑：减缓附近敌人" + slowPer + "%的时间流速\n逆转：将受到的" + reversePct + "%伤害转为自己的气血和内力\n唯一：将你内力的150%转化为气血",
            },
        };
    }

    /**
     * 逆转——受到伤害时将部分伤害转化为气血和内力
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (sh > 0 && from) {
            const lv = me.query_skill("nitiandao", 0);
            if (lv > 0) {
                const pct = nizhuan_pct(lv);
                const convert = Math.floor(sh * pct / 100);
                if (convert > 0) {
                    me.add_hp(convert);
                }
            }
        }
        return sh;
    }

    pfm_set: PerformData = {
        lun: {
            name: "一念轮回",
            distime: 60000,
            enable_skill: "force",
            mp: 1720,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room("<hio>$N逆运天道，掌心轮回之印幽光流转，一股苍茫古意笼罩$n！</hio>\n", target);
                reset_enemy_cooldowns(target, lv);

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, _lv: number): string {
                return "将敌人的技能重置冷却";
            },
        },
        mie: {
            name: "一念寂灭",
            distime: 60000,
            enable_skill: "force",
            mp: 1970,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const enemies = me.get_nearby_enemies();
                if (!enemies.length) {
                    me.send_room("<hio>$N周身寂灭之气涌动，但四周并无敌人。", target);
                    me.end_attack(target);
                    return;
                }

                const mpPct = yimie_mp_pct(lv);
                const extraMp = yimie_extra_mp(lv);
                const extraMpPer = yimie_extra_mp_per(lv);
                const duration = yimie_duration(lv);

                me.send_room("<hio>$N双掌合十，寂灭之气席卷而出，四周敌人内力如冰消雪融！</hio>\n", target);

                for (const enemy of enemies) {
                    // 压制当前内力
                    const reduce = Math.floor(enemy.mp * mpPct / 100);
                    if (reduce > 0) {
                        enemy.add_mp(-reduce);
                    }

                    // 给对方附加内力消耗增加的debuff
                    enemy.add_status({
                        id: "jimie",
                        name: "寂灭",
                        desc: "被逆天道寂灭之力影响，内力消耗大幅增加",
                        duration: duration,
                        downside: true,
                        no_diff: true,
                        override: 2,
                        prop: {
                            expend_mp: -extraMp,
                            expend_mp_per: -extraMpPer,
                        },
                        finish_msg: "<hio>$n身上的寂灭之力终于消散。</hio>",
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const mpPct = yimie_mp_pct(lv);
                const extraMp = yimie_extra_mp(lv);
                const extraMpPer = yimie_extra_mp_per(lv);
                return "压制附近敌人当前内力的" + mpPct + "%，加快对方的能力流失，内力消耗增加" + extraMp + "+" + extraMpPer + "%。";
            },
        },
    };
}


// ═══════════════════════════════════════════
// 逆天道 — 公共计算函数
// ═══════════════════════════════════════════

/** 逆转伤害转化百分比：10 + lv / 300 */
function nizhuan_pct(lv: number): number {
    return 10 + lv / 300;
}

/** 一念寂灭压制内力百分比：10 + Math.floor(lv / 400) */
function yimie_mp_pct(lv: number): number {
    return 10 + Math.floor(lv / 400);
}

/** 一念寂灭额外固定内力消耗：lv * 10 */
function yimie_extra_mp(lv: number): number {
    return lv * 10;
}

/** 一念寂灭额外百分比内力消耗：10 + Math.floor(lv / 100) */
function yimie_extra_mp_per(lv: number): number {
    return 10 + Math.floor(lv / 100);
}

/** 一念寂灭debuff持续时间（毫秒） */
function yimie_duration(lv: number): number {
    return 5000 + lv * 2;
}

/** 遍历目标所有已装备技能的绝招，使其进入各自的distime冷却 */
function reset_enemy_cooldowns(target: CHARACTER, lv: number): void {
    const bases = ['unarmed', 'sword', 'blade', 'club', 'staff', 'whip', 'throwing', 'dodge', 'force', 'parry'];
    for (const base of bases) {
        if (!target.skills) continue;
        const base_skill = target.skills.get(base);
        if (!base_skill || !base_skill.enable_skill) continue;
        const sp_skill = SKILL.get(base_skill.enable_skill);
        if (!sp_skill || !sp_skill.pfm) continue;
        for (const key in sp_skill.pfm) {
            const pfmitem: PERFORM = sp_skill.pfm[key];
            const distime = pfmitem.query_distime(target, lv);
            pfmitem.set_distime(target, base, distime);
        }
    }
}
