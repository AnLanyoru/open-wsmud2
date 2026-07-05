import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "泰山拳法";
    id = "taishanquanfa";
    grade = 2;

    // 原始描述：泰山派的拳法功夫，拳势凝重如山，沉稳厚重，如泰山之巍峨，有万钧之势。
    desc = "泰山派的拳法功夫";
    can_enables = ["unarmed","parry"];
    attack_actions = [
        "$N沉腰坐马，左掌护胸，右拳一招「<HIC>岱岳雄峙</HIC>」直捣$n的$l，气势雄浑",
        "$N跨步上前，双拳如泰山压顶般连环击出，拳风呼啸，正是「<HIC>石敢当</HIC>」的起手式",
        "$N身子微仰，右拳自腰间猛然冲出，拳势刚猛霸道，此招名为「<HIC>一览众山</HIC>」",
        "$N步踏天罡，拳走中宫，一招「<HIC>紫气东来</HIC>」带着凛冽拳风砸向$n",
        "$N吐气开声，双拳齐出，如「<HIC>泰山磐石</HIC>」般稳扎稳打，步步紧逼",
        "$N左拳虚晃一招「<HIC>云步梯</HIC>」，右拳已从意想不到的角度直取$n的$l",
        "$N拳势沉重如山，一式「<HIC>稳如泰山</HIC>」看似缓慢，实则封死了$n所有退路",
        "$N怒喝一声，双拳连环击出，每一拳皆蕴含千钧之力，正是泰山拳法的「<HIC>十八盘</HIC>」",
        "$N马步一沉，双拳自下而上撩出，如「<HIC>挑帘望岳</HIC>」之势，劲力暗藏",
        "$N拳法骤变，刚猛之中夹杂巧劲，一招「<HIC>五岳独尊</HIC>」直取$n中门"
    ];
    parry_actions = [
        "$N沉腰坐马，双拳如泰山磐石般稳扎稳打，将$P的攻势尽数格挡",
        "$N拳势凝重如山，一招「<HIC>稳如泰山</HIC>」以静制动，化解了$P的攻势",
    ];
    slots = [
        {
            prop: 'ts_str_zj',
            value: (lv: number) => 10,
            format: (val: number) => '泰山压顶根骨大于目标时无视招架',
        },
        {
            prop: 'ts_fy_sh',
            value: (lv: number) => 10,
            format: (val: number) => '你的伤害减免将增加泰山压顶的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 10 + Math.floor(lv * 1.3),
                str: Math.floor(lv / 8),
                fy: 10 + Math.floor(lv * 3 / 2),
            },
            parry: {
                zj: 10 + Math.floor(lv * 1.3),
                fy: 200 + lv,
            },
        };
    }

    pfm_set: PerformData = {
        ya:
            {
                name: "泰山压顶",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 100,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var fy = me.fy || 0;
                    var per = me.query_prop('ts_fy_sh');
                    if (per) fy = fy + fy * per / 100;
                    var gj = me.gj + fy * 2;
                    me.send_room("<HIY>$N深吸一口气，身躯陡然拔高数寸，周身骨骼噼啪作响，双拳如擎天之柱般向$n猛砸而下！</HIY>", target);
                    me.do_attack({
                        target: target,
                        attack_msg: "<hiy>$N双拳齐出，如泰山之巅崩裂，携万钧之势罩向$n，拳未至，风已压得$p喘不过气来</hiy>",
                        damage_msg: "<hir>$n被$N一拳砸中，如遭泰山压顶，踉跄后退，口中鲜血狂喷</hir>",
                        miss_msg: "<cyn>$n见$N拳势刚猛无铸，不敢硬接，急忙闪身避开</cyn>",
                        gj: gj,
                        mz: me.mz,
                        no_weapon: true
                    });
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    return "对敌人造成你攻击力附加你200%防御的伤害";
                },
            },
    };
}
