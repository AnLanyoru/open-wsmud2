import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "如意刀";
    id = "ruyidao";
    grade = 1;
    family = FAMILIES.XIAOYAO;
    attack_actions = [
    "$N一磕刀柄，一招「<WHT>若往若返</WHT>」，猛地一个转身，手中$w直向$n斩去",
    "$N把手中的$w一扬，一招「<YEL>峰回路转</YEL>」，手中的刀一个急转，直砍向$n的$l",
    "$N身形陡然滑出数尺，一招「<RED>御风而行</RED>」，刀势如风，手中$w斩向$n的$l",
    "$N一招「<HIW>云雾萦绕</HIW>」，身子骤然拔高数尺，手中$w一个平推向$n的$l砍去。",
    "$N纵身一跃，手中$w一招「<HIY>金光泻地</HIY>」轻飘飘地向$n的$l要害掠去",
    "$N手中$w向外一分，轻轻颤动，一招「<BOLD>柳暗花明</BOLD>」反手向$n$l掠去",
    "$N横刀上前，身形一转，手中$w使一招「<CYN>空谷秋虹</CYN>」画出一道光弧斩向$n的$l",
    "$n只觉眼前一花，$N一招「<HIM>紫气东来</HIM>」，$w挟呼呼风声迅猛砍向$n的$l",
    "$N把$w划了一圈，一招「<HIC>神光离合</HIC>」，$n只觉得全身被笼罩在一团刀气之中。",
    "$N身形一转，一招「<HIB>逍遥自在</HIB>」，$w刀光不定，招招砍向$n的$l要害"
];
    desc = "逍遥派刀法，如意随风，随心如意";
    can_enables = ["blade"];
    learn_condition = {
    max_mp: 500,
    skill: {
        xiaoyaoxinfa: 50,
        blade: 50
    }
};
    pfm = {
    suifeng:
    {
        name: "随风起舞式",
        distime: 10000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 20,
        release_time:0,
        use: function (me, target, lv) {

            me.send_room("<HIR>只见狂风突起，$N深吸一口气，舞动【随风起舞式】，四周飘起越来越多的树叶！</HIR>", target);
            me.add_status({
                id: "blade",
                name: "随风",
                desc: "如意刀之随风起舞，增加自身身法和臂力",
                duration:10000,
                prop: {
                    str: parseInt(lv / 10) + 5,
                    dex: parseInt(lv / 10) + 5
                },
                finish_msg: "<cyn>$N的【随风起舞式】舞动完毕，周围落叶撒满一地。</cyn>"
            });
        },
        query_desc: function (me, lv) {
            return "随风起舞，10秒内增加自身身法" + (parseInt(lv / 10) + 5) + "，臂力" + (parseInt(lv / 10) + 5);
        }
    }
};

    query_enable_prop(lv) {
    return {
        blade: {
            gj: lv * 1 + 10,
            dex: parseInt(lv / 10)
        }
    };
}
}

