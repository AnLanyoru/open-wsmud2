import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(SKILL);
this.id = "throwing";
this.name = "基本暗器";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this.set_default(this.id);
this.desc = "暗器类技能的基础功法，磨练你的技巧，坚持锻炼会增加你自身的命中";
this.attack_actions = [
"$N用$T往$n的$l刺去", "一道$T射向$n的$l", "$T飞向$n的$l"
];
this.query_prop = function (lv) {
    return { mz: lv };
}
}
