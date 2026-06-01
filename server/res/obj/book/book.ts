import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";
import { SKILL } from "../../../core/skill/skill.js";

export default class extends OBJ {
    unit = "本";
    name = "武功秘籍";
    desc = "一本武功秘籍";
    max_level = 100;
    combined = true;
    value = 0;
    otype = 1;

    constructor() {
        super();
        this.add_action('sbook', '存到技能仓库', function (me) {
            WORLD.COMMANDS.sbook.enter(me, this.id);
        });
        this.add_action('split', '拆分', function (me) {
            WORLD.COMMANDS.sbook.split_book(me, this);
        });
    }

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
    this.value = WORLD.DATA.book_values[this.grade] * COMBINED[this.grade];
}
    on_study(me, skill, lv) {
    if (skill.do_learn && skill.do_learn(me, lv) == false) return false;
    return true;
}
}

const COMBINED = [1, 10, 30, 50, 100, 200, 500];
