import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "嵩山剑法";
    id = "songshanjianfa";
    grade = 3;

    desc = "嵩山派绝学，剑法气象森严，端严雄伟。";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N手中$w一摆，剑势<HIY>森严</HIY>凝重，如嵩岳屹立，一招「<HIY>千山万水</HIY>」压向$n的$l",
        "$N$w倏地刺出，剑招<HIY>大开大阖</HIY>，气象森严，正是一招「<HIY>中岳巍峨</HIY>」",
        "$N长剑横空，剑势<HIY>雄浑磅礴</HIY>，如崇山峻岭般压向$n，令人喘不过气来",
        "$N$w连刺数剑，每一剑都<HIY>沉稳厚重</HIY>，嵩山剑法端严雄浑的气势尽显无疑",
        "$N暴喝一声，$w自上而下<HIY>泰山压顶</HIY>般劈落，剑气如山，直取$n$l"
    ];
    parry_actions = [
        "$N$w横举，一招「<HIY>嵩岳巍峨</HIY>」，如山岳般沉稳地架住$P的攻势",
        "$N$w一沉一引，以<HIY>千钧之力</HIY>将$P的兵器压向一旁",
        "$N剑势<HIY>端严雄浑</HIY>，$w大开大阖之间将$P的进攻尽数封挡"
    ];
    slots = [
        {
            prop: 'wy_mp',
            value: (lv: number) => 10,
            format: (val: number) => '万岳朝宗的内力消耗降低20%',
        },
        {
            prop: 'wy_nl',
            value: (lv: number) => 10,
            format: (val: number) => '万岳朝宗附加的内力增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 1,
                str: Math.floor(lv * 0.127),
            },
            parry: {
                zj: Math.floor(lv * 2.31),
                max_hp: lv * 7,
                con: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        yue: {
            name: "万岳朝宗",
            distime: 10000,
            enable_skill: "sword",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var mp_pct = calcWYMPPct(lv);
                var consumeMp = Math.floor(me.mp * mp_pct / 100);
                if (consumeMp < 1) {
                    return me.notify("你的内力不足，无法催动万岳朝宗。");
                }
                me.add_mp(-consumeMp);
                me.send_room("<HIY>$N长剑高举，剑势巍峨如山，引动周身内力，一招「万岳朝宗」带着万钧之势向$n压去！</HIY>", target);
                target.damage3(consumeMp, me);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var mp_pct = calcWYMPPct(lv);
                return "威力巨大的一式剑法，消耗你" + mp_pct + "%的当前内力，对敌人造成等量伤害。";
            },
        },
    };
}

function calcWYMPPct(lv: number): number {
    return 20 + int(lv / 100);
}
