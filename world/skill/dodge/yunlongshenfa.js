import { SKILL } from "../../../os/skill/skill.js";

export default function() {
this.inherits(SKILL);
this.name = "云龙身法";
this.id = "yunlongshenfa";
this.grade = 1;

this.dodge_actions = [
    "$n一式<HIY>「龙腾虎跃」</HIY>，身行一转，猛的跳向一旁,躲过了$N的功势。",
    "$n一式<HIY>「沙场点兵」</HIY>，双臂置于身后，不急不缓，昂首从$N眼前跨过。",
    "$n一式<HIG>「风雨同舟」</HIG>，不退反进，一下子绕到了$N的身后。",
    "$n一式<HIG>「养精蓄锐」</HIG>，缓缓的向后一退，轻松让过了$N的凌厉攻势。",
    "$n一式<GRN>「无心插柳」</GRN>，左手一扬，身行一晃，便向右飘出丈远。",
    "$n一式<MAG>「苍鹰搏兔」</MAG>，身体如一只苍鹰，呼的一声从$N的眼前飞过。",
    "$n一式<HIY>「九龙在天」</HIY>，忽的拔地而起，在半空中一转，已落到几丈远的地方。",
    "$n一式<HIC>「瀑落九天」</HIC>，全身化为一道白影，忽的一个空翻，从左边飘到右边。",
    "$n一式<HIC>「幻眼云烟」</HIC>，身形陡地变得飘忽不定，令$N无法看清。",
    "$n一式<HIW>「九天揽月」</HIW>，宛若一条矫矢苍龙，倏的拔地而起，令$N不敢仰视。",
];
this.desc = "天地会的轻功身法，身似游龙，无影无随";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 600,
    skill: {
        dodge: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: lv + 20
        }
    };
}
}
