import { SKILL } from "../../../os/skill/skill.js";
import { SKILL_TYPES } from "../../../os/const.js";

export default class extends SKILL {
    id = "staff";
    name = "基本杖法";
    grade = 0;
    type = SKILL_TYPES.BASE;
    attack_actions = [
    "$N用$W往$n的$l捅去", "$N用$W往$n的$l敲去", "$N挥动$W,扫向$n的$l"
];
    desc = "杖法类技能的基础功法，坚持锻炼会增加你的招架能力";

    constructor() {
        super();
        this.set_default(this.id);
    }

    query_prop(lv, me) {
    return { zj: lv };
}
}

