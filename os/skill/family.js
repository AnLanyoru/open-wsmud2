/**
 * FAMILY 门派基类
 */

/** @type {Object<string, FAMILY>} 所有门派注册表 */
FAMILIES = {};

FAMILY = class FAMILY extends BASE {

    static __initInstance(obj) {
        obj.titles = [];
        obj.npcs = [];
        obj.battle_family = null;
        obj.battle_score = 0;
        obj.battle_gift = 0;
        obj.can_battle = false;
        obj.query_temp = CHARACTER.prototype.query_temp;
        obj.set_temp = CHARACTER.prototype.set_temp;
        obj.remove_temp = CHARACTER.prototype.remove_temp;
        obj.add_temp = CHARACTER.prototype.add_temp;
    }

    constructor() {
        super();
        FAMILY.__initInstance(this);
    }

    /**
     * 设置门派称谓
     * @param {...string} arguments - 称谓列表
     */
    set_titles() {
        for (let i = 0; i < arguments.length; i++) {
            this.titles.push(arguments[i]);
        }
    }

    /**
     * 创建回调 - 注册到FAMILIES
     * @param {string} path
     */
    create(path) {
        FAMILIES[this.id] = this;

    }

    /**
     * 更新回调
     * @param {string} path
     */
    update(path) {
        FAMILIES[this.id] = this;
    }

    /**
     * 查询指定等级的称谓
     * @param {number} level
     * @returns {string}
     */
    query_title(level) {
        return this.titles[level];
    }


    /** @type {function} 临时数据查询(复用CHARACTER) */
    query_temp = CHARACTER.prototype.query_temp;
    /** @type {function} */
    set_temp = CHARACTER.prototype.set_temp;
    /** @type {function} */
    remove_temp = CHARACTER.prototype.remove_temp;
    /** @type {function} */
    add_temp = CHARACTER.prototype.add_temp;

    /**
     * 向门派所有在线成员发送消息
     * @param {string} str
     */
    send(str) {
        for (let i = 0; i < WORLD.USERS.length; i++) {
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
    is_battle(fam) {
        return this.battle_family == fam.id;
    }

    /**
     * 增加门派积分
     * @param {CHARACTER} me
     * @param {number} sc
     */
    add_score(me, sc) {
        this.battle_score += sc;
    }



    /**
     * 向门派频道发送消息
     * @param {string} str
     */
    static addSendFamToCharacter() {
        CHARACTER.prototype.send_fam = function (str) {
            this.family.send(str);
        };
    }

    /**
     * 创建门派随机名字
     * @returns {string}
     */
    create_name() {
        return UTIL.random_name(this.gender);
    }

    /**
     * 随机查询指定品级的技能
     * @param {number} grade - 品级
     * @returns {SKILL}
     */
    query_skill(grade) {
        if (!this.skill_levels) {
            this.skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
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
    query_skills(grade) {
        if (!this.skill_levels) {
            this.skill_levels = [];
            for (let i = 0; i < this.skills.length; i++) {
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
    add_gongji(me, count) {
        if (!count) return;
        me.add_temp("gongji", count);
        if (count < 0) return;
        if (!this.tops) this.tops = {};
        const old = this.tops[me.id];
        if (!old) this.tops[me.id] = { name: me.name, score: count };
        else {
            old.score += count;
        }
    }
}

// Apply CHARACTER.prototype.send_fam after class definition
CHARACTER.prototype.send_fam = function (str) {
    this.family.send(str);
};
