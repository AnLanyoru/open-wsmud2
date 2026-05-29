import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    id = "whip";
    name = "基本鞭法";
    grade = 0;
    type = SKILL_TYPES.BASE;
    attack_actions = [
    "$N用$W往$n的$l抽去", "$N甩动$W往$n的$l抽去", "$N挥动$W,扫向$n的$l"
];
    desc = "鞭法类技能的基础功法，坚持锻炼会磨练你的技巧增加命中";

    constructor() {
        super();
        this.set_default(this.id);
    }

    query_prop(lv) {
    return { mz: lv };
}
}

const SKILL_TYPES = globalThis.SKILL_TYPES;
