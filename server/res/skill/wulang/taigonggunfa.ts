import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太公棍法";
    id = "taigonggunfa";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "此棍法传自太公钓鱼之理，棍法舒展如浪，运使时如临沧海垂钓，能以柔劲卸力，以巧劲制敌";
    can_enables = ["club"];
    attack_actions = SKILL.get("club")?.attack_actions || [];
    slots = [
        {
            prop: 'tggf_no_ds',
            value: (lv: number) => 1,
            format: (val: number) => '愿者上钩命中后对方无法躲闪',
        },
        {
            prop: 'tggf_no_zj',
            value: (lv: number) => 1,
            format: (val: number) => '愿者上钩命中后对方无法招架',
        },
        {
            prop: 'tggf_sh',
            value: (lv: number) => 80,
            format: (val: number) => '愿者上钩命中后每次造成的伤害增加80%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 8 + Math.floor(lv * 1.2),
                mz: 8 + Math.floor(lv * 1.5),
            },
        };
    }

    pfm_set: PerformData = {
        diao: {
            name: "缠丝钓",
            distime: 32000,
            enable_skill: "club",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                const dmgPct = query_diao_dmg_pct(lv);
                const gj = Math.floor(me.gj * dmgPct / 100);
                const sh = me.do_attack({
                    target,
                    gj: gj,
                    mz: me.mz,
                    attack_msg: "<hic>$N使出「缠丝钓」攻向$n，棍法如丝如缕，缠向$n的$l。</hic>",
                });
                if (sh) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: 8000,
                        is_busy: true,
                        downside: true,
                        desc: "你被缠丝钓所制，忙乱不堪",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                const dmgPct = query_diao_dmg_pct(lv);
                return `以缠劲攻击敌人，造成${dmgPct}%攻击力伤害，命中后使敌人忙乱8秒`;
            },
        },
        gou: {
            name: "愿者上钩",
            distime: 60000,
            enable_skill: "club",
            mp: 100,
            release_time: 10000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                const stunDuration = query_gou_stun_duration(lv);
                const intervalMs = query_gou_interval(lv);
                const tickCount = Math.floor(stunDuration / intervalMs);
                const casterGj = me.gj;
                const casterMz = me.mz;
                const DmgIncrease = (me.query_prop("tggf_sh") / 100 || 0);
                const hasNoParry = (me.query_prop("tggf_no_zj") || 0) > 0;
                const hasNoDodge = (me.query_prop("tggf_no_ds") || 0) > 0;

                me.send_room("<hiy>$N举棍若杆，棍势如沧海垂钓，锁定$n！</hiy>", target);
                const sh = me.do_attack({
                    target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<hiy>$N手中棍棒划出一道玄妙弧线，如太公垂钓般向$n的$l攻去。</hiy>",
                });

                if (sh) {
                    // 晕眩效果：使敌人无法行动
                    target.add_status({
                        id: "busy",
                        name: "愿者上钩",
                        duration: stunDuration,
                        is_busy: hasNoParry || undefined,
                        is_rash: hasNoDodge || undefined,
                        downside: true,
                        desc: "你被愿者上钩所制，无法行动",
                        finish_msg: "$N从愿者上钩的束缚中挣脱出来。",
                    }, me);

                    // 持续伤害效果
                    if (tickCount > 0) {
                        target.add_status({
                            id: "taigong_gou_dot",
                            name: "上钩",
                            duration: intervalMs,
                            duration_count: tickCount,
                            downside: true,
                            desc: "愿者上钩的暗劲持续伤害着你",
                            on_interval: function(target: CHARACTER, _over_count: number) {
                                const baseDmg = Math.floor(casterGj * 0.8);
                                const dmg = Math.floor(baseDmg * 1 +DmgIncrease);
                                target.from_attack(dmg, casterMz, '', `<hir>$N被愿者上钩的暗劲所伤。</hir>`);
                            },
                        }, me);
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                const stunDuration = query_gou_stun_duration(lv) / 1000;
                const intervalMs = query_gou_interval(lv) / 1000;
                return `太公钓鲸棍法绝技，以无上巧劲锁定敌人，命中后使敌人${stunDuration}秒无法行动，每${intervalMs}秒造成伤害`;
            },
        },
    };
}

/** 缠丝钓 — 伤害百分比 */
function query_diao_dmg_pct(lv: number): number {
    return 120 + Math.floor(lv / 50);
}

/** 愿者上钩 — 无法行动持续时间（毫秒），封顶10秒 */
function query_gou_stun_duration(lv: number): number {
    return Math.min(10000, 5000 + lv * 5);
}

/** 愿者上钩 — 伤害触发间隔（毫秒），封底1秒 */
function query_gou_interval(lv: number): number {
    return Math.max(1000, 1900 - 100 * Math.floor((lv - 100) / 200));
}
