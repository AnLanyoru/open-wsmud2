import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(SKILL);
this.id = "staff";
this.name = "基本杖法";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this.attack_actions = [
    "$N用$W往$n的$l捅去", "$N用$W往$n的$l敲去", "$N挥动$W,扫向$n的$l"
];
this.set_default(this.id);
this.desc = "杖法类技能的基础功法，坚持锻炼会增加你的招架能力";
this.query_prop = function (lv) {
    return { zj: lv };
}
}
