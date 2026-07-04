import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

// ============================================================
// 恒山身法 — 恒山派高级轻功
// 北岳恒山，悬空寺悬于绝壁千年，恒山派历代师太于此参禅习武。
// 《笑傲江湖》中仪琳师妹天真烂漫，定逸师太刚正不阿，恒山一脉武学如其人，
// 不以杀伐为念，而以自守为先。身法如白云出岫，意态似莲花出水。
// ============================================================

export default class extends SKILL {
    name = "恒山身法";
    id = "hengshanshenfa";
    grade = 2;

    desc = "恒山派的轻功身法，创自白云庵某位无名师太。相传师太于悬空寺中面壁十年，一日见崖壁白云悠然出岫，忽有所悟，遂创此身法。步法不以迅疾见长，而以致远守静为宗，正如恒山派剑法一般——绵里藏针，以守为攻。";
    can_enables = ["dodge"];
    dodge_actions = [
        "$n双掌合十，口宣佛号「<HIC>阿弥陀佛</HIC>」，足下踏出恒山身法，身形如白云出岫般向后退去——北岳恒山，悬空千载，此身法亦如悬空寺般，看似缥缈，实则根基深固。",
        "却见$n神色淡然，口诵「<HIW>菩提本无树，明镜亦非台</HIW>」，脚下步履从容不迫，$N这凌厉一击，被$n轻描淡写地让了开去，正如恒山派剑法「绵里藏针」之意。",
        "$n袍袖一拂，身形如莲花般滴溜溜一转——「<HIC>犹如莲花不着水，亦如日月不住空</HIC>」，$N的兵刃擦着$n衣袂而过，却连一片衣角也未曾削下。",
        "只见$n足踏「<HIG>苦海慈航</HIG>」之势，身子借力向后飘出，恒山派武功向以慈悲为怀，这一避不疾不徐，既不伤敌，亦不损己，实是佛门武学的至高境界。",
        "$n步履轻盈，仿若足踏莲花而行，神态安详——「<HIW>本来无一物，何处惹尘埃</HIW>」，$N攻势虽猛，于$n看来却不过镜花水月、梦幻泡影。",
        "$n微微一笑：「<HIC>一切有为法，如梦幻泡影，如露亦如电，应作如是观</HIC>。」身形随经文声飘然远去，$N这一招威力再大，打在空处又有何用？",
    ];

    slots = [
        {
            prop: 'hssf_ds',
            name: "灵虚·闪",
            value: (_lv: number) => 5,
            format: (_val: number) => '灵虚额外增加5%躲闪',
        },
        {
            prop: 'hssf_fy',
            name: "灵虚·御",
            value: (_lv: number) => 5,
            format: (_val: number) => '灵虚额外增加5%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv + 100,
                fy: lv + 200,
            },
        };
    }

    pfm_set: PerformData = {
        ling: {
            name: "灵虚",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_hssf_lingxu_duration(lv);
                const bonus = query_hssf_lingxu_bonus(lv);
                const dsBonus = bonus + me.query_prop("hssf_ds");
                const fyBonus = bonus + me.query_prop("hssf_fy");

                me.send_room(
                    "<hic>$N闭目合十，口诵佛号，周身忽地涌出一股清圣之气——恒山身法之「</hic><HIW>灵虚</HIW><hic>」！但见$N衣袂无风自动，足下仿佛步步生莲，整个人似虚还实、如露如电，恍若悬空寺中千年古佛忽然睁眼，一片祥和之中暗藏无边威仪。</hic>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "灵虚",
                    desc: "恒山身法之灵虚，心如明镜，身若浮云，躲闪与防御大幅提升。",
                    duration: duration,
                    prop: {
                        ds_per: dsBonus,
                        fy_per: fyBonus,
                    },
                    finish_msg: "<hic>$N周身清圣之气缓缓散去，足下莲花隐没，$N缓缓睁眼，神色如常，仿佛方才的一切不过是一场禅定。</hic>",
                });
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = query_hssf_lingxu_duration(lv);
                const bonus = query_hssf_lingxu_bonus(lv);
                return `${toSec(duration)}内增加你${bonus}%躲闪，防御提高${bonus}%`;
            },
        },
    };
}


// ============================================================
// 恒山身法 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 灵虚：持续时间（毫秒） */
function query_hssf_lingxu_duration(lv: number): number {
    return 6000 + lv * 5;
}

/** 灵虚：躲闪与防御加成百分比 */
function query_hssf_lingxu_bonus(lv: number): number {
    return 10 + Math.floor(lv / 100);
}
