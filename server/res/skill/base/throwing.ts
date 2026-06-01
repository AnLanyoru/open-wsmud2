import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";

export default class extends SKILL {
    id = "throwing";
    name = "基本暗器";
    grade = 0;
    type = SKILL_TYPES.BASE;
    desc = "暗器类技能的基础功法，磨练你的技巧，坚持锻炼会增加你自身的命中";
    attack_actions = [
"$N用$T往$n的$l刺去", "一道$T射向$n的$l", "$T飞向$n的$l"
];

    constructor() {
        super();
        this.set_default(this.id);
    }

    query_prop(lv, me) {
    return { mz: lv };
}
}

