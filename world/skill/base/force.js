import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(SKILL);
this.name = "基本内功";
this.id = "force";
this.grade = 0;
this.type = SKILL_TYPES.BASE;
this.set_default(this.id);
this.desc = "内功的基础功法，坚持锻炼会增强体质。每10级增加1点后天根骨，增加内力上限";
this.query_prop = lv => ({ con: parseInt(lv / 10), limit_mp: 100 + lv * 5, desc: "唯一：将你内力的10%转化为气血" });
}
