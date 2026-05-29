import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "基本内功";
    id = "force";
    grade = 0;
    type = SKILL_TYPES.BASE;
    desc = "内功的基础功法，坚持锻炼会增强体质。每10级增加1点后天根骨，增加内力上限";
    query_prop = lv => ({ con: parseInt(lv / 10), limit_mp: 100 + lv * 5, desc: "唯一：将你内力的10%转化为气血" });

    constructor() {
        super();
        this.set_default(this.id);
    }
}

const SKILL_TYPES = globalThis.SKILL_TYPES;
