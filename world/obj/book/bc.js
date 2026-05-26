this.inherits(OBJ);
this.set({
    unit: "份",
    name: "秘籍碎片",
    desc: "一本武功秘籍",
    max_level: 100
});
this.transable = true;
this.otype = 1;
this.on_create = function (path, par) {
    if (!par) return;
    par = par.substr(1);
    var skill = SKILL.get(par);
    if (!skill || !skill.grade) {
        this.value = 1000;
        return;
    }
    this.skill = skill.id;
    this.grade = skill.grade;
    this.name = skill.name + "残页";
    this.desc = "一本武功秘籍碎片，需要" + ["十", "三十", "五十", "一百", "二百", "五百"][this.grade - 1] + "份这样的残页就可以合成一本完整的" + skill.color_name + "秘籍。";
    this.combine_count = COMBINED[this.grade];
    this.combine_to = "book/book#" + skill.id;
    this.value = WORLD.DATA.book_values[this.grade];

}
const COMBINED = [10, 10, 30, 50, 100, 200, 500];