import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(SKILL);
this.id = "whip";
this.name = "基本鞭法";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this.attack_actions = [
    "$N用$W往$n的$l抽去", "$N甩动$W往$n的$l抽去", "$N挥动$W,扫向$n的$l"
];
this.set_default(this.id);
this.desc = "鞭法类技能的基础功法，坚持锻炼会磨练你的技巧增加命中";

this.query_prop = function (lv) {
    return { mz: lv };
}
}
