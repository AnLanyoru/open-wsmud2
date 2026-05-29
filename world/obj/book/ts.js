import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "份";
    name = "无效武功";
    desc = "查看技能提示";
    transable = true;

    on_create(path, par) {
    if (!par) return;
    par = par.substr(1);
    var skill = SKILL.get(par);
    if (!skill) {
        return;
    }
    this.skill = skill.id;
    this.grade = skill.grade;
    this.name = "技能：" + skill.name;
    this.desc = skill.color_name + "秘籍。";

}
}

const SKILL = globalThis.SKILL;
