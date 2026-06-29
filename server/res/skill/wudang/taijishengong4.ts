import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import {WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {LearnCondition} from "../../../types/events.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太极真义";
    id = "taijishengong4";
    grade = 6;
    family = FAMILIES.WUDANG;
    is_ultimate = true;
    desc = "道生一，一生二，二生三，三生万物。武当派无上心法，乃张三丰真人晚年闭关参悟《道德经》《易经》之精髓所创。以无极而太极、太极生两仪之大道贯通天地玄机，臻至道法自然之境。习至大成者，可悟阴阳无极之妙——身与道合，万法归一。";
    can_enables = ["parry"];

    parry_actions = [
        "$N双手虚抱成圆，阴阳二气流转不息，$n的攻势如泥牛入海，尽数消弭于无形。",
        "$N身形微转，左掌阴、右掌阳，一招「如封似闭」，以无极生太极之势将$n的劲力层层卸去。",
        "却见$N不闪不避，双手一阴一阳虚抱成球，$n的招式撞入其中，竟似击中虚空，浑不着力。",
        "$N默运太极真义，周身清气缭绕，$n的攻势被一股柔劲牵引，偏出丈外。",
        "$N脚踏七星，双手划弧，以四两拨千斤之妙将$n的攻势引向一旁。",
    ];

    learn_condition: LearnCondition = {
        max_mp: 20000,
        skill: {
            parry: 500,
            taijishengong2: 400,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                max_hp: lv * 300,
                int: lv * 1,
                zj: lv * 2,
                fy_per: 5 + Math.floor(lv / 200),
                zj_per: 5 + Math.floor(lv / 200),
                desc: "无极：招架成功后，召唤三清之一使用你装备的技能攻击",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "阴阳无极",
            distime: 55000,
            enable_skill: "parry",
            mp: 780,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const sh: number = me.do_attack({
                    target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<HIM>$N闭目凝神，双手虚抱成圆——左掌阴、右掌阳，太极之力如江河倒悬，滔滔不绝地向$n涌去！</HIM>",
                    damage_msg: "<HIR>$n被阴阳二气透体而过，经脉中真气乱窜，刹那间手忙脚乱、招式难续！</HIR>",
                });
                if (sh) {
                    const dur: number = Math.min(3000 + lv * 5, 12000);
                    const spdReduce: number = 20 + Math.floor(lv / 500);
                    const extendMs: number = Math.min(3000 + lv * 5, 10000);
                    target.add_status({
                        id: "yinyangwuji",
                        name: "逆乱",
                        desc: "体内阴阳二气紊乱，攻击速度降低",
                        duration: dur,
                        downside: true,
                        prop: {
                            gjsd_per: -spdReduce,
                            gjsd: -spdReduce * 100,
                        },
                    }, me);
                    // 遍历敌方所有已装备技能，延长其已进入冷却的绝招
                    extend_enemy_cooldowns(target, extendMs);
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const dur: number = Math.min(3000 + lv * 5, 12000);
                const spdReduce: number = 20 + Math.floor(lv / 500);
                const extendSec: number = Math.min(3000 + lv * 5, 10000) / 1000;
                return "万物负阴而抱阳，冲气以为和。扰乱敌人体内阴阳二气，" + (dur / 1000) + "秒内降低其" + spdReduce + "%攻击速度，并延长敌人已释放武功的冷却时间" + extendSec + "秒。";
            },
        },
        pfm_1: {
            name: "大道无极",
            distime: 45000,
            enable_skill: "parry",
            mp: 2750,
            release_time: 4000,
            use_type: 2,
            allow_faint: true,
            use: function (me: CHARACTER, _target: CHARACTER, _lv: number): void {
                me.send_room(
                    "<HIW>$N双掌合十，闭目内观，口诵真言：「有物混成，先天地生。寂兮寥兮，独立而不改，周行而不殆，可以为天地母。」\n"
                    + "刹那间$N周身清光荡漾，如醍醐灌顶，百脉贯通，诸邪退散！</HIW>",
                );
                me.hp = me.max_hp;
                me.mp = me.max_mp;
                me.notify_hp();
                const removed: number = me.clear_downside(true);
                if (removed > 0) {
                    me.send_room("<HIW>$N体内浊气尽散，诸般异常状态一扫而空，复还本来清净之体。</HIW>");
                }
            },
            query_desc: function (_me: CHARACTER, _lv: number): string {
                return "上善若水，水利万物而不争，处众人之所恶，故几于道。将自身气血内力尽复旧观，并涤除一切异常状态，如清泉洗尘，复还本来面目。";
            },
        },
    };

    on_parry_over(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_parried) return;
        if (me.query_temp("sk_taijishengong4", 0)) return;

        const now_target: CHARACTER | undefined = me.query_enemy();
        if (!now_target) return;

        // 收集所有已装备的非招架技能绝招
        const available_pfms: Array<{
            pfm: PERFORM;
            level: number;
            sktype: string;
        }> = [];
        const bases: string[] = ['unarmed', 'dodge', 'throwing'];
        const weapon: string = me.query_weapon_type();
        if (weapon && weapon !== WEAPON_TYPE.NONE) {
            bases.unshift(weapon);
        }

        for (const base of bases) {
            if (!me.skills) continue;
            const base_skill = me.skills.get(base);
            if (!base_skill || !base_skill.enable_skill) continue;
            const sp_skill = SKILL.get(base_skill.enable_skill);
            if (!sp_skill || !sp_skill.pfm) continue;
            const sk_level: number = me.query_skill(base_skill.enable_skill, 0);
            for (const key in sp_skill.pfm) {
                const pfmitem: PERFORM = sp_skill.pfm[key];
                // 跳过招架类绝招，避免递归
                if (pfmitem.enable_skill === 'parry') continue;
                available_pfms.push({
                    pfm: pfmitem,
                    level: sk_level,
                    sktype: base,
                });
            }
        }

        if (!available_pfms.length) return;

        const chosen: {pfm: PERFORM; level: number; sktype: string} | undefined =
            available_pfms[me.random(available_pfms.length)];
        if (chosen) {
            const sanqing_names: string[] = [
                "<HIW>一道清气自$N泥丸宫冲出，化为人形——其状混沌未分，鸿蒙未判，正是元始天尊一缕真意！</HIW>",
                "<HIO>一道清气自$N丹田升起，化为人形——浩浩荡荡，无量无边，恰似灵宝天尊降临凡尘！</HIO>",
                "<HIJ>一道清气自$N绛宫飞出，化为人形——自然空玄，无形无象，宛若道德天尊现身说法！</HIJ>",
            ];
            const name: string = sanqing_names[me.random(sanqing_names.length)];
            me.send_room(name, now_target);
            chosen.pfm.use?.(me, now_target, chosen.level, chosen.sktype);
        }

        me.set_temp("sk_taijishengong4", 1, 500);
    }
}

/** 遍历目标所有已装备技能的绝招，延长其当前冷却时间 */
function extend_enemy_cooldowns(target: CHARACTER, extendMs: number): void {
    const bases: string[] = ['unarmed', 'sword', 'blade', 'club', 'staff', 'whip', 'throwing', 'dodge', 'force', 'parry'];
    for (const base of bases) {
        if (!target.skills) continue;
        const base_skill = target.skills.get(base);
        if (!base_skill || !base_skill.enable_skill) continue;
        const sp_skill = SKILL.get(base_skill.enable_skill);
        if (!sp_skill || !sp_skill.pfm) continue;
        for (const key in sp_skill.pfm) {
            const pfmitem: PERFORM = sp_skill.pfm[key];
            pfmitem.change_distime(target, key, extendMs);
        }
    }
}
