import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(SKILL);
this.id = "parry";
this.name = "基本招架";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this. weapon_vs_weapon_actions = [
    "只听见「锵」一声，被$p用手中$i格开了。",
    "结果「当」地一声被$p挡开了。",
    "但是被$n用手中$i架开。",
    "但是$n身子一侧，用手中$i格开。"
];
this.parry_actions = [
    "但是被$p格开了。",
    "结果被$p挡开了。"
];
this.unarmed_vs_weapon_actions =[
    "但是被$p轻轻一推，$w失了准头，和$p的$l偏了几寸。",
    "$p往$N的手腕轻轻一按，结果$w偏向一边。"
];

this.desc = "招架类技能的基础功法，坚持锻炼会提高你的招架能力";
this.query_prop = lv => ({ zj: lv });
this.set_default(this.id);
}
