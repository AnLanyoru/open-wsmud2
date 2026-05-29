import { OBJ } from "../../../os/item/obj.js";
import { SKILL } from "../../../os/skill/skill.js";
import { SKILL_TYPES } from "../../../os/const.js";

export default class extends OBJ {
    unit = "本";
    name = "武功秘籍";
    desc = "一本武功秘籍";
    max_level = 100;
    combined = true;
    value = 0;
    otype = 1;

    on_create(path, par) {
    if (!par) return;
    par = par.substr(1);
    var skill = SKILL.get(par);
    if (!skill) return;
    this.skill = skill.id;
    this.grade = skill.grade;
    var cc = this.query_grade_color();
    this.name = skill.name + "秘籍";
    this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
    this.desc = "一本武功秘籍，里面记载了" + skill.color_name + "的练习方法。";
    var cond = skill.condition_tostring();
    if (cond) {
        this.desc = this.desc + "\n学习条件：\n" + cond;
    } else {
        this.desc = this.desc + "\n学习条件：无" + cond;
    }
    if (!this.grade) this.value = 1000;
}
    on_use(me) {
    
    var skill_base = SKILL.get(this.skill );
    if (!skill_base) return me.notify('你不能从里面学到东西。');
    var skill = me.skills[this.skill];
    if (!skill) {
        skill = {
            level: 0,
            exp: 0
        };
        var str = ['{type:"dialog",dialog:"skills",item:'];
        skill_base.item_to_json(str, skill, me);
        str.push("}");
        me.notify(str.join(""));
        me.skills[this.skill] = skill;
        if (skill_base.type == SKILL_TYPES.BASE) {
            me.init_skill();
        }
    }

    skill_base.release_prop(me, me.query_skill(skill_base.id));
    skill.level = me.query_skill(this.skill, 0) + 100;
    skill_base.attach_prop(me, skill.level );
    me.notify('{type:"dialog",dialog:"skills",id:"' + this.skill + '",level:' + skill.level
        + ',exp:0}');
    me.notify('你学会了' + skill_base.color_name + '。');
    me.recount();
}
}

