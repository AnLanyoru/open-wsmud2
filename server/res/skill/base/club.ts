import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";

export default class extends SKILL {
    id = "club";
    name = "基本棍法";
    grade = 0;
    type = SKILL_TYPES.BASE;
    attack_actions = [
    "$N用$W往$n的$l捅去", "$N用$W往$n的$l敲去", "$N挥动$W,扫向$n的$l"
];
    desc = "棍法类技能的基础功法，坚持锻炼会增加你的招架能力";

    constructor() {
        super();
        this.set_default(this.id);
    }

    query_prop(lv, me) {
    return { zj: lv  };
}
}

