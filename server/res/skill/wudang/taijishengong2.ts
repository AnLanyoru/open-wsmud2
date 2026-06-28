import { SKILL, PERFORM } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { LearnCondition } from "../../../types/events.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "先天太极";
    id = "taijishengong2";
    source_skill = "taijishengong";
    grade = 5;
    family = FAMILIES.WUDANG;
    force_rad = 1.0;
    desc = "武当派至高内功心法，源自三丰真人对太极之道的大彻大悟。以先天之气运转周身，阴阳相济，攻守兼备。";
    can_enables = ["force"];

    learn_condition: LearnCondition = {
        max_mp: 10000,
        skill: {
            force: 500,
            taijishengong: 400,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                fy: lv * 2,
                zj: lv * 2,
                fy_per: 3 + Math.floor(lv / 300),
                limit_mp: lv * 298,
                desc: "唯一：将你内力的100%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        zhenwu: {
            name: "真武除邪",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            use_type: 2,
            release_time: 0,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const diff: number = query_buff_value(lv);
                const time: number = query_buff_dur(lv);
                me.send_room(
                    "<hiy>$N闭目凝神，心随意转，双手抱环划破虚空，周身先天灵气如指引般汇聚在$P周身，"
                    + "一阴一阳仿若真灵护体。</hiy>",
                );
                me.add_status({
                    id: "force",
                    name: "真武除邪",
                    desc: "先天太极之真武除邪，增加你的气血、招架和伤害减免",
                    duration: time,
                    prop: {
                        hp_per: diff,
                        zj_per: diff,
                        diff_sh_per2: diff,
                    },
                    on_expire: function (p: CHARACTER): void {
                        if (p.hp > p.max_hp) {
                            p.hp = p.max_hp;
                            p.notify_hp();
                        }
                    },
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const diff: number = query_buff_value(lv);
                const time: number = query_buff_dur(lv) / 1000;
                return "将先天太极真气运转周身，"
                    + time + `秒内增加你${diff}%气血，招架增加${diff}%，受到的伤害减少${diff}%。`;
            },
        },
        sanqing: {
            name: "一气化三清",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const interval: number = query_use_gap(me);
                const total: number = query_use_num(lv);
                me.send_room(
                    "<him>$N一声清啸：道气惟一，一气三分，天地归元！！！</him>",
                    target,
                );

                me.add_status({
                    id: "sanqing",
                    name: "三清",
                    desc: "先天太极之一气化三清，每隔一段时间自动施展已装备技能的绝招",
                    duration: interval,
                    duration_count: total,
                    override: 0,
                    no_clear: true,
                    on_interval: sanqing_attack,
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const interval: number = query_use_gap(me);
                const total: number = query_use_num(lv);
                const total_dur: number = (interval * total) / 1000;
                return `每隔${interval / 1000}秒化为三清之一使用你目前装备的技能绝招攻击对方，持续${total}次（${total_dur}秒）。`;
            },
        },
    };
}

/** 一气化三清：status on_interval 回调，每次间隔触发一次攻击 */
function sanqing_attack(me: CHARACTER, _over_count: number): void {
    const now_target = me.query_enemy();
    if (!now_target) return;

    // 收集所有已装备的非内功技能绝招
    const available_pfms: Array<{
        pfm: PERFORM;
        level: number;
        sktype: string;
    }> = [];
    const bases: string[] = ['unarmed', 'dodge', 'parry', 'throwing'];
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
            // 跳过内功绝招（避免递归调用自身）
            if (pfmitem.enable_skill === 'force') continue;
            available_pfms.push({
                pfm: pfmitem,
                level: sk_level,
                sktype: base,
            });
        }
    }

    if (!available_pfms.length) return;

    const chosen = available_pfms[me.random(available_pfms.length)];
    if (chosen) {
        const sanqing_names: string[] = [
            "<HIW>一道人始之气化身为$N，混沌初开，不见其形.....</HIW>",
            "<HIO>一道地元之气化身为$N，浩浩荡荡，无量无边.....</HIO>",
            "<HIJ>一道天玄之气化身为$N，自然空玄，无形无象.....</HIJ>",
        ];
        const name: string = sanqing_names.random();
        me.send_room(name, now_target);
        chosen.pfm.use?.(me, now_target, chosen.level, chosen.sktype);
    }
}

function query_use_num(lv: number): number {
    return 3 + Math.floor(lv / 1000)
}

function query_use_gap(me: CHARACTER): number {
    return me.gjsd * 2
}

function query_buff_value(lv: number): number {
    return 30 + Math.floor(lv / 500)
}

function query_buff_dur(lv: number): number {
    return Math.min(10000 + (lv * 10), 30000)
}