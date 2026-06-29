import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太公棍法";
    id = "taigonggunfa";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "此棍法传自太公钓鱼之理，棍法舒展如浪，运使时如临沧海垂钓，能以柔劲卸力，以巧劲制敌";
    can_enables = ["club"];
    attack_actions = [
        "$N手中$W轻颤，棍尖划出一道玄妙弧线，一式「<HIY>渭水垂纶</HIY>」悄然递出，点向$n的$l",
        "$N身形微侧，$W自下而上斜挑而起，宛若钓竿轻提，一招「<HIC>寒江独钓</HIC>」直取$n的$l",
        "$N踏步向前，$W荡起层层棍影，如惊涛拍岸，一招「<HIW>沧海横流</HIW>」扫向$n的$l",
        "$N手腕一抖，$W棍尖忽颤，三道棍影连环递出，一式「<HIB>三叠浪涌</HIB>」罩向$n的$l",
        "$N凝神静气，$W缓缓平推而出，看似极缓实则劲力暗涌，一招「<HIM>太公钓鲸</HIM>」直指$n的$l",
        "$N长笑一声，$W回旋横扫，棍劲绵密如潮，一式「<HIG>江涛卷雪</HIG>」涌向$n的$l",
        "$N纵身而起，$W自上而下劈落，势若巨鲸破浪，一招「<HIR>鲸涛裂海</HIR>」直取$n的$l",
        "$N$W斜引，劲走偏锋，棍尖如游鱼般灵动穿梭，一式「<CYN>游鱼逐浪</CYN>」点向$n的$l",
        "$N右腕轻压，$W棍势忽变，由缓转疾，一招「<YEL>投竿问鱼</YEL>」疾点$n的$l",
        "$N$W在掌间一转，借旋劲横扫而出，如狂澜既倒，一招「<MAG>狂澜拍岸</MAG>」劈向$n的$l",
        "$N身形疾转，$W随势划出一圈圆弧，棍劲如漩涡暗涌，一式「<BLU>暗潮漩劲</BLU>」卷向$n的$l",
        "$N深吸一口真气，$W缓缓举起，棍势沉雄如山岳将倾，一招「<WHT>垂天钓海</WHT>」猛然击向$n的$l",
    ];
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
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const dmgPct = query_diao_dmg_pct(lv);
                const gj = Math.floor(me.gj * dmgPct / 100);
                const sh = me.do_attack({
                    target,
                    gj: gj,
                    mz: me.mz,
                    attack_msg: "<hic>$N手中$W如长丝缠卷，一式「缠丝钓」封住$n退路，棍影千丝万缕，绵绵密密罩向$n周身。</hic>",
                });
                if (sh) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: 8000,
                        is_busy: true,
                        downside: true,
                        desc: "你被缠丝钓所制",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
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
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const stunDuration = query_gou_stun_duration(lv);
                const intervalMs = query_gou_interval(lv);
                const tickCount = Math.max(Math.floor(stunDuration / intervalMs), 1);
                const casterGj = me.gj;
                const casterMz = me.mz;
                const DmgIncrease = me.query_prop("tggf_sh") / 100;
                const hasNoDodge = me.query_prop("tggf_no_ds") > 0;
                const hasNoParry = me.query_prop("tggf_no_zj") > 0;

                me.send_room("<hiy>$N朗声长笑，$W倏然指天，万顷潮声尽聚棍尖，一道无形潮线已将$n牢牢锁住，棍影如怒潮奔涌，直取其要害！</hiy>", target);
                const sh = me.do_attack({
                    target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<hiy>$N手中$W划出一道玄妙弧线，如太公垂纶于渭水，棍尖所向，$n的$l已在笼罩之中。</hiy>",
                });

                if (sh) {
                    // 基础：出招冷却阻止攻击/技能，不影响招架躲闪
                    target.set_releasetime(stunDuration);
                    // 进阶 tggf_no_zj：无法招架
                    if (hasNoParry) {
                        target.is_busy = stunDuration;
                    }
                    // 进阶 tggf_no_ds：无法躲闪
                    if (hasNoDodge) {
                        target.is_rash = stunDuration;
                    }
                    target.call_interval(
                        function (_i: number) {
                            if (target.fight_type == 0) return false;
                            const baseDmg = Math.floor(casterGj * 0.8);
                            const dmg = Math.floor(baseDmg * (1 + DmgIncrease));
                            target.from_attack(dmg, casterMz, '', `<hir>$N身形一颤，被愿者上钩的暗劲震得气血翻腾。</hir>`);
                        },
                        intervalMs,
                        tickCount,
                        function () {
                            if (hasNoParry) {
                                target.is_busy = 0;
                            }
                            if (hasNoDodge) {
                                target.is_rash = 0;
                            }
                            target.send_room("$N浑身一震，终于从愿者上钩的束缚中挣脱出来。", target);
                        },
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
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
