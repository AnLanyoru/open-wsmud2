/**
 * MONSTER 怪物类
 */

require("../util/util.js");
require("./character");

/** @type {function} */
MONSTER = function () {
    this.hp = this.max_hp = 100;
    this.mp = this.max_mp = 100; this.auto_pfm = true;
    this.family = FAMILIES.MONSTER;
    this.str = this.con = this.dex = this.int = 20;
}
MONSTER.inherits(CHARACTER);
/** @type {boolean} */
MONSTER.prototype.can_speek = false;

/** 初始化技能为撕咬/闪避/招架/内功 */
MONSTER.prototype.init_skill = function () {
    this.attack_skill = this.query_used_skill(BASE_SKILLS.BITE);
    this.dodge_skill = this.query_used_skill(BASE_SKILLS.DODGE);
    this.parry_skill = this.query_used_skill(BASE_SKILLS.PARRY);
    this.force_skill = this.query_used_skill(BASE_SKILLS.FORCE);
    this.noweapon_skill = this.attack_skill;
}

/**
 * 查询描述(JSON)
 * @param {USER} me - 观察者
 * @returns {string}
 */
MONSTER.prototype.query_desc = function (me) {
    return this.query_commands(me);
}

/**
 * 查询操作命令
 * @param {USER} player - 观察者
 * @returns {string} JSON字符串
 */
MONSTER.prototype.query_commands = function (player) {

    if (this.json) return this.json;
    var json = {};
    json.type = "item";
    json.desc = this.name + "\n" + this.desc;
    json.id = this.id;
    json.commands = [];
    json.commands.push({
        cmd: "kill " + this.id,
        name: "击杀"
    });
    if (this.actions) {
        for (var cmd in this.actions) {
            if (!this.actions[cmd].name) continue;
            json.commands.push({
                cmd: cmd + " " + this.id,
                name: this.actions[cmd].name
            });
        }
    }
    this.json = JSON.stringify(json)
    return this.json;
}

/**
 * 第三人称代称
 * @returns {string}
 */
MONSTER.prototype.call3 = function () {
    return "它";
}

/**
 * 销毁怪物
 * @param {string} [msg]
 */
MONSTER.prototype.destroy = function (msg) {
    if (this.environment) {
        this.environment.item_changed(this, false, msg);
    }
}

/**
 * 怪物死亡
 * @param {CHARACTER} killer - 击杀者
 * @returns {boolean|undefined}
 */
MONSTER.prototype.die = function (killer) {

    if (!this.environment) return;
    if (this.on_die && this.on_die(killer) === false) {
        this.hp = 1;
        return false;
    }
    this.hp = 0;
    this.clear_status();
    this.send_message(this.name + "惨嚎一声，死了！");
    var corpse = new CORPSE();
    var isinfb = this.environment.is_fb();
    corpse.init(this, isinfb);
    this.die_room = this.environment;
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    if (isinfb && this.score && killer) {
        killer.add_fbscore(this.score);
    }
    this.on_died && this.on_died(killer, corpse);
    WORLD.auto_get(killer, corpse, this);
    if (killer && killer.attack_skill && killer.attack_skill.on_enemy_die) {
        killer.attack_skill.on_enemy_die(killer, this);
    }
}

/**
 * 随机查询攻击部位
 * @returns {{name: string, hert: number, crit: number}}
 */
MONSTER.prototype.query_part = function () {
    return MONSTER_PARTS.random();
}

/**
 * 怪物心跳
 * @param {number} dt
 */
MONSTER.prototype.heart_beat = function (dt) {
    if (!this.fight_type && this.hp > 0) {
        if (this.hp < this.max_hp) {
            this.add_hp(parseInt(this.max_hp / 2));
        }
        if (this.mp < this.max_mp) {
            this.add_mp(parseInt(this.max_mp / 2));
        }
        if (this.chat_msg) {
            var r = this.random(10);
            if (r > 5)
                this.send_message(this.chat_msg.random());
        }


    }

}

/**
 * 怪物攻击部位定义
 * @type {Array<{name: string, hert: number, crit: number}>}
 */
var MONSTER_PARTS = [
    { name: "左爪", hert: 0.8, crit: 0 },
    { name: "右爪", hert: 0.8, crit: 0 },
    { name: "后腿", hert: 0.85, crit: 0 },
    { name: "小腹", hert: 0.91, crit: 3 },
    { name: "胸前", hert: 0.95, crit: 4 },
    { name: "背部", hert: 0.97, crit: 4 },
    { name: "头部", hert: 1.2, crit: 10 },
    { name: "颈部", hert: 1.1, crit: 5 },
    { name: "前肢", hert: 0.85, crit: 1 },
    { name: "腰间", hert: 0.99, crit: 5 },
];

