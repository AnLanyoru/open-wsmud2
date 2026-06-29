import { SKILL, PERFORM } from "../../../core/skill/skill.js";
import { SKILL_TYPES, WEAPON_TYPE } from "../../../core/const.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "大开山手";
    id = "dakaishanshou";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "传闻是无浪门前辈在某隐秘之地发现的失传武学，此技融采矿开山之法与徒手硬功于一体，堪称开碑裂石的霸道武学。";
    can_enables = ["unarmed", "parry"];
    attack_actions = [
        "$N气沉丹田，双目精光暴射，大喝一声，双掌挟着风雷之势齐出，一招「<HIY>开山裂石</HIY>」直劈$n的$l",
        "$N身形微沉，右臂青筋暴起，拳上劲风如锤，使出一招「<HIR>断岳摧峰</HIR>」向$n的$l狠狠砸去",
        "$N踏步上前，左掌虚引，右掌蓄满刚猛无俦的真力，一招「<HIC>碎石分金</HIC>」直取$n的$l",
        "$N猛地吸一口长气，双拳如狂风骤雨般连连挥出，一招「<RED>崩山倒海</RED>」拳影重重，铺天盖地般压向$n",
        "$N腰身一拧，右掌划出一道凌厉的弧线，使出一招「<WHT>劈石断流</WHT>」，掌缘如开山利斧般切向$n的$l",
        "$N双足踏地，地面竟微微震颤，一招「<HIM>地动山摇</HIM>」双掌平推而出，劲风如浪，直逼$n的$l",
        "$N纵身跃起，居高临下，一招「<HIW>泰山压顶</HIW>」双掌挟着全身之力向$n的$l猛击而下",
        "$N深吸一口真气，双掌在胸前画了一个大圈，随即一掌突出，一招「<YEL>金锤凿壁</YEL>」猛然击向$n的$l",
        "$N身形急转，借旋转之势双掌轮番劈出，一招「<CYN>飞沙走石</CYN>」掌影错落，令$n眼花缭乱",
        "$N不闪不让，踏上一步，右掌如铁铸一般平平推出，一招「<HIG>铁掌开碑</HIG>」挟着千钧之力击向$n的$l",
        "$N左掌一翻，右手自下而上猛然撩起，一招「<BLU>掀天揭地</BLU>」劲风呼啸，自下盘直攻$n的$l",
        "$N双掌一先一后，掌力如浪潮般层层叠叠涌出，一招「<MAG>排山倒海</MAG>」向$n的$l连绵拍去",
    ];
    parry_actions = [
        "$n双臂交叉胸前，如铁门横闩，一招「<HIC>铁门闩</HIC>」硬生生将$N的攻势封在外门，纹丝不动",
        "$n沉腰坐马，双掌如两扇铁门般轰然一合，$N这一招竟如击在岩壁之上，震得$P双臂酸麻",
        "$n掌缘向外轻轻一翻，使出一招「<YEL>推山填海</YEL>」，将$N攻来的力道尽数卸于无形",
        "$n不闪不避，反而踏上一步，以硬碰硬，一双铁掌迎头撞上$N的攻势，竟将$P震退半步",
        "$n双臂缓缓划圆，气劲如旋涡般在身前流转，一招「<WHT>磐石护山</WHT>」将$N的攻势尽数卷入其中",
    ];
    unarmed_vs_weapon_actions = [
        "$n看准$N手中$w来势，侧身一让，左掌在$w侧面轻轻一拍，竟将这凌厉一击带偏了数寸",
        "$n不退反进，右掌斜斜劈出，正击在$w的刀身上，$N只觉虎口剧震，$w险些脱手飞出",
        "$n身形一矮，双掌自下而上猛然托出，一招「<HIG>举火燎天</HIG>」架开了$N的$w",
        "只听得「当」的一声金铁交鸣，$n竟以一双开山铁掌硬撼$N的$w，火花四溅中，$N的$w已被震开",
        "$n双掌一合，竟在电光火石间将$N的$w挟在掌中，使出一招「<HIY>空手夺刃</HIY>」，$N急忙收招回撤",
    ];
    slots = [
        {
            prop: 'dkss_max',
            value: (lv: number) => 10,
            format: (val: number) => `点石成金获取对方的防御和免伤上限增加${val}%`,
        },
        {
            prop: 'dkss_sh',
            value: (lv: number) => 1,
            format: (val: number) => '点石成金会同时对敌人造成伤害，命中后减少对方对应防御',
        },
        {
            prop: 'dkss_zy',
            value: (lv: number) => 1,
            format: (val: number) => '点石成金可偷取防御包括对方增益部分',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 9 + Math.floor(lv * 1.2),
                diff_fy_per: Math.floor(lv / 500) + 3,
            },
            parry: {
                gj: 10 + Math.floor(lv * 1.2),
                diff_sh_per: Math.floor(lv / 500) + 3,
            },
        };
    }

    pfm_set: PerformData = {
        po: {
            name: "破岩击",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 29,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const dmgPct = Math.min(500, 100 + Math.floor(lv / 10));
                const ignoreDef = 20 + Math.floor(lv / 300);
                const gj = Math.floor(me.gj * dmgPct / 100);
                me.send_room("<hic>$N凝聚开山之力，一招「破岩击」重重轰向$n！</hic>", target);
                me.do_attack({
                    target,
                    gj: gj,
                    mz: me.mz,
                    diff_fy: ignoreDef,
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const dmgPct = Math.min(500, 100 + Math.floor(lv / 10));
                const ignoreDef = 20 + Math.floor(lv / 300);
                return `凝聚开山之力的重击，造成${dmgPct}%攻击力伤害，无视对方${ignoreDef}%防御`;
            },
        },
        dian: {
            name: "点石成金",
            distime: 60000,
            enable_skill: "unarmed",
            mp: 50,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const maxCap = 50 + (me.query_prop("dkss_max") || 0);
                const stealPct = Math.min(maxCap, 15 + Math.floor(lv / 100));
                const duration = Math.min(15, 5 + Math.floor(lv / 200)) * 1000;

                // 获取目标防御和免伤
                const targetFy = target.fy;
                const targetDiffSh = target.query_prop("diff_sh_per") || 0;
                const stolenFy = Math.floor(targetFy * stealPct / 100);
                const stolenDiffSh = Math.floor(targetDiffSh * stealPct / 100);

                me.send_room("<hic>$N使出「点石成金」，一掌探出，竟从$n身上汲取防御之力！</hic>", target);

                // 对自身施加增益
                me.add_status({
                    id: "dkss_dian_bf",
                    name: "点石成金",
                    desc: `汲取了防御之力`,
                    duration: duration,
                    prop: {
                        fy: stolenFy,
                        diff_sh_per: stolenDiffSh,
                    },
                    finish_msg: "$N的点石成金效果逐渐消散。",
                });

                // 进阶词条：点石成金同时对敌人造成伤害
                if (me.query_prop("dkss_sh")) {
                    const sh = me.do_attack({
                        target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_msg: "<hic>$N趁势追击，掌风呼啸而至！</hic>",
                    });
                    // 对目标施加减益
                    if (sh) target.add_status({
                        id: "dkss_dian_db",
                        name: "金散",
                        desc: `被大开山手重创，防御和免伤降低了`,
                        duration: duration,
                        downside: true,
                        prop: {
                            fy: -stolenFy,
                            diff_sh_per: -stolenDiffSh,
                        },
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const maxCap = 50 + (me.query_prop("dkss_max") || 0);
                const stealPct = Math.min(maxCap, 15 + Math.floor(lv / 100));
                const duration = Math.min(15, 5 + Math.floor(lv / 200));
                return `大开山手技，获取目标${stealPct}%防御和免伤${duration}秒内强化自身`;
            },
        },
    };
}
