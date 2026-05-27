/**
 * FAMILY 门派基类
 */

/** @type {function} */
FAMILY = function () {
    /** @type {string[]} */
    this.titles = [];
    /** @type {string[]} */
    this.npcs = [];
    /** @type {string|null} */
    this.battle_family = null;
    this.battle_score = 0;
    this.battle_gift = 0;
    this.can_battle = false;
}

FAMILY.inherits(BASE);

/** @type {Object<string, FAMILY>} 所有门派注册表 */
FAMILIES = {};

/**
 * 设置门派称谓
 * @param {...string} arguments - 称谓列表
 */
FAMILY.prototype.set_titles = function () {
    for (var i = 0; i < arguments.length; i++) {
        this.titles.push(arguments[i]);
    }
}

/**
 * 创建回调 - 注册到FAMILIES
 * @param {string} path
 */
FAMILY.prototype.create = function (path) {
    FAMILIES[this.id] = this;

}

/**
 * 更新回调
 * @param {string} path
 */
FAMILY.prototype.update = function (path) {
    FAMILIES[this.id] = this;
}

/**
 * 查询指定等级的称谓
 * @param {number} level
 * @returns {string}
 */
FAMILY.prototype.query_title = function (level) {
    return this.titles[level];
}


/** @type {function} 临时数据查询(复用CHARACTER) */
FAMILY.prototype.query_temp = CHARACTER.prototype.query_temp;
/** @type {function} */
FAMILY.prototype.set_temp = CHARACTER.prototype.set_temp;
/** @type {function} */
FAMILY.prototype.remove_temp = CHARACTER.prototype.remove_temp;
/** @type {function} */
FAMILY.prototype.add_temp = CHARACTER.prototype.add_temp;

/**
 * 向门派所有在线成员发送消息
 * @param {string} str
 */
FAMILY.prototype.send = function (str) {
    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (WORLD.USERS[i].family == this) {
            WORLD.USERS[i].send(str);
        }
    }
}

/**
 * 是否与指定门派交战
 * @param {FAMILY} fam
 * @returns {boolean}
 */
FAMILY.prototype.is_battle = function (fam) {
    return this.battle_family == fam.id;
}

/**
 * 增加门派积分
 * @param {CHARACTER} me
 * @param {number} sc
 */
FAMILY.prototype.add_score = function (me, sc) {
    this.battle_score += sc;
}



/**
 * 向门派频道发送消息
 * @param {string} str
 */
CHARACTER.prototype.send_fam = function (str) {
    this.family.send(str);
}

/**
 * 创建门派随机名字
 * @returns {string}
 */
FAMILY.prototype.create_name = function () {
    return UTIL.random_name(this.gender);
}

/**
 * 随机查询指定品级的技能
 * @param {number} grade - 品级
 * @returns {SKILL}
 */
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

/**
 * 查询指定品级的所有技能
 * @param {number} grade
 * @returns {SKILL[]}
 */
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

/**
 * 增加门派贡献
 * @param {CHARACTER} me
 * @param {number} count
 */
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

