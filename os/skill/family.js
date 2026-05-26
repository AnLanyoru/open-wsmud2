FAMILY = function () {
    this.titles = [];
    this.npcs = [];
    this.battle_family = null;
    //this.scores = new Map();
    this.battle_score = 0;
    this.battle_gift = 0;
    this.can_battle = false;
}

FAMILY.inherits(BASE);
FAMILIES = {};
FAMILY.prototype.set_titles = function () {
    for (var i = 0; i < arguments.length; i++) {
        this.titles.push(arguments[i]);
    }
}
FAMILY.prototype.create = function (path) {
    FAMILIES[this.id] = this;

}
FAMILY.prototype.update = function (path) {
    FAMILIES[this.id] = this;
}
FAMILY.prototype.query_title = function (level) {
    return this.titles[level];
}


FAMILY.prototype.query_temp = CHARACTER.prototype.query_temp;
FAMILY.prototype.set_temp = CHARACTER.prototype.set_temp;
FAMILY.prototype.remove_temp = CHARACTER.prototype.remove_temp;
FAMILY.prototype.add_temp = CHARACTER.prototype.add_temp;

FAMILY.prototype.send = function (str) {
    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (WORLD.USERS[i].family == this) {
            WORLD.USERS[i].send(str);
        }
    }
}
FAMILY.prototype.is_battle = function (fam) {
    return this.battle_family == fam.id;
}
FAMILY.prototype.add_score = function (me, sc) {
    this.battle_score += sc;
}



CHARACTER.prototype.send_fam = function (str) {
    this.family.send(str);
}
FAMILY.prototype.create_name = function () {
    return UTIL.random_name(this.gender);
}
FAMILY.prototype.query_skill = function (grade) {
    if (!this.skill_levels) {
        this.skill_levels = [];
        for (var i = 0; i < this.skills.length; i++) {
            if (!this.skill_levels[this.skills[i].grade]) {
                this.skill_levels[this.skills[i].grade] = [];
            }
            this.skill_levels[this.skills[i].grade].push(this.skills[i]);
        }
    }
    if (grade >= this.skill_levels.length) grade = this.skill_levels.length - 1;
    return this.skill_levels[grade].random();
}
FAMILY.prototype.query_skills = function (grade) {
    if (!this.skill_levels) {
        this.skill_levels = [];
        for (var i = 0; i < this.skills.length; i++) {
            if (!this.skill_levels[this.skills[i].grade]) {
                this.skill_levels[this.skills[i].grade] = [];
            }
            this.skill_levels[this.skills[i].grade].push(this.skills[i]);
        }
    }
    if (grade >= this.skill_levels.length) grade = this.skill_levels.length - 1;
    return this.skill_levels[grade];
}
FAMILY.prototype.add_gongji = function (me, count) {
    if (!count) return;
    me.add_temp("gongji", count);
    if (count < 0) return;
    if (!this.tops) this.tops = {};
    var old = this.tops[me.id];
    if (!old) this.tops[me.id] = { name: me.name, score: count };
    else {
        old.score += count;
    }
}

