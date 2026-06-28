import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {EnablePropMap} from "../../../core/skill/skill.js";
import type {LearnCondition} from "../../../types/events.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

export default class extends SKILL {
    name = "梯云纵";
    id = "tiyunzong2";
    source_skill = "tiyunzong";
    grade = 4;
    family = FAMILIES.WUDANG;
    desc = "武当派绝世轻功梯云纵，身法如云如雾，飘忽不定。施展之时如踏云而行，躲闪之际借势蓄力，愈战愈强。";
    can_enables = ["dodge"];

    dodge_actions = [
        "只见$n身形如云般飘起，一招「<WHT>云梯纵天</wht>」，轻轻松松地避开了$N这一招。",
        "$n一个「<MAG>云卷云舒</MAG>」，身形如云雾般飘散开来，$N的攻击尽数落空。",
        "$n使出「<CYN>九天揽月</CYN>」，足尖轻点，身形一纵直上数丈，$N的攻击只能望空兴叹。",
        "但是$n一招「<WHT>云中漫步</wht>」身形飘忽，如踏云而行，早已避开。",
        "$n身随意转，一招「<MAG>梯云九转</MAG>」倏地在空中连转数圈，避过了这一招。",
        "可是$n一招「<CYN>凌云飞渡</CYN>」侧身一纵，$N这一招扑了个空。",
        "却见$n足不点地一招「<WHT>纵云梯</wht>」，身形凭空拔起，躲了开去。",
        "$n身形微晃，一招「<MAG>云龙三现</MAG>」化作三道残影，有惊无险地避开了$N这一招。",
    ];

    learn_condition: LearnCondition = {
        max_mp: 5000,
        skill: {
            dodge: 400,
        },
    };

    slots = [
        {
            prop: 'tyz_dc',
            value: (lv: number) => 2,
            format: (val: number) => '梯云纵最大可叠加层数+2',
        },
        {
            prop: 'tyz_cd',
            value: (lv: number) => 1000,
            format: (val: number) => '梯云纵的内置冷却减少1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 5 + lv * 2,
                dex: Math.floor(lv * 0.25),
                fy_per: 3 + Math.floor(lv / 200),
                desc: `当成功躲闪对方攻击时增加${lv}躲闪，命中，可叠加`,
            },
        };
    }

    on_dodge_over(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): void {
        if (par.is_dodged && !me.query_temp("tyz2", 0)) {
            const lv: number = me.query_skill("tyz2", 0);
            const tyz_dc: number = me.query_prop("tyz_dc");
            const tyz_cd: number = me.query_prop("tyz_cd");
            const max_count: number = 10 + tyz_dc;
            const cd_base: number = 8000 - tyz_cd;

            me.add_status({
                id: "dodge",
                name: "梯云纵",
                desc: "梯云纵之纵字诀，增加你的躲闪和命中",
                prop: {
                    ds: lv,
                    mz: lv,
                },
                duration: 10000,
                override: 1,
                max_count: max_count,
            });
            me.set_temp("tyz2", 1, me.random(cd_base) + lv);
        }
    }
}
