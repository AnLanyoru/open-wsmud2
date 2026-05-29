/**
 * 战斗系统 - 扩展CHARACTER
 */
import { CHARACTER } from "./character.js";

Object.assign(CHARACTER.prototype, {
    /**
     * 开始攻击目标
     * @param {CHARACTER} target - 攻击目标
     * @param {number} type - 战斗类型(1=比试, 2=生死)
     */
    begin_attack(target, type) {

        if (!target || target === this) return;
        if (!this.attack_skill) {
            return this.send("error  skill");
        }
        this.add_enemy(target);
        this.fight_type = this.fight_type || 0;
        if (type > this.fight_type) {
            if (this.force_skill && this.force_skill.on_beginfight) {
                this.force_skill.on_beginfight(this, target);
            }
            if (this.attack_skill && this.attack_skill.on_beginfight) {
                this.attack_skill.on_beginfight(this, target);
            }
            if (!this.fight_type) {

                if (this.attack_handler) clearTimeout(this.attack_handler);
                this.attack_handler = this.call_out(this.auto_attack, Math.random() * this.gjsd);
                this.send('{type:"combat",start:1}');

            }
            this.fight_type = type;
        }

    },

    /**
     * 开始比试(fight)
     * @param {CHARACTER} target
     */
    do_fight(target) {
        this.begin_attack(target, 1);
    },

    /**
     * 开始击杀(kill)
     * @param {CHARACTER} target
     */
    do_kill(target) {
        if (this.fight_type == 2 && this.query_enemy() == target) return;
        this.begin_attack(target, 2);
        target.begin_attack(this, 2);
        target.notify("<hir>看起来" + this.name + "想杀死你！</hir>\n");
        this.notify("<hir>看起来" + target.name + "想杀死你！</hir>\n");
    },

    /**
     * 添加敌人
     * @param {CHARACTER} target
     */
    add_enemy(target) {
        if (!this.enemy) {
            this.enemy = [];
        }
        this.enemy.push(target);
    },

    /**
     * 通知房间内玩家HP/MP变化
     * @param {string} [type] - 'hp'或'mp'
     * @param {number} [val] - 新值
     */
    notify_hp(type, val) {
        if (!this.environment) return;

        const items = this.environment.items;
        let str = null;
        if (type) {
            str = "{type:\"sc\",id:\"" + this.id + "\"," + type + ":" + val + "";
        } else {
            const ary = ["{type:\"sc\",id:\""];
            ary.push(this.id);
            ary.push("\",hp:");
            ary.push(this.hp);
            ary.push(",max_hp:");
            ary.push(this.max_hp);
            ary.push(",mp:");
            ary.push(this.mp);
            ary.push(",max_mp:");
            ary.push(this.max_mp);
            str = ary.join("");
        }
        const showdamage = type ? type === "hp" : false;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                if (showdamage && this.damages && player.query_setting('show_damage')) {
                    player.send(str + ",damage:" + (this.damages[player.id] || 0) + "}");
                } else {
                    player.send(str + "}");
                }
            }
        }
    },

    /**
     * 增加/减少气血
     * @param {number} v - 变化量
     * @returns {number} 实际变化量
     */
    add_hp(v) {

        if (v > this.max_hp - this.hp) v = this.max_hp - this.hp;
        else if (v < -this.hp) v = -this.hp;
        if (!v) return 0;

        this.hp += v;
        this.notify_hp("hp", this.hp);
        return v;
    },

    /**
     * 增加/减少内力
     * @param {number} v - 变化量
     * @returns {number|undefined} 实际变化量
     */
    add_mp(v) {
        let mp = this.mp + v;
        if (mp > this.max_mp) mp = this.max_mp;
        if (mp < 0) mp = 0;
        if (mp === this.mp) return;
        this.mp = mp;
        this.notify_hp("mp", this.mp);
        return v;
    },

    /**
     * 是否在战斗中
     * @param {CHARACTER} [p] - 检查是否与此角色战斗
     * @returns {boolean}
     */
    is_fighting(p) {
        if (!this.fight_type) return false;
        if (!this.enemy || !this.enemy.length) {
            this.fight_type = 0;
            this.clear_combat_status();
            return false;
        }
        if (p) {
            if (p.environment !== this.environment) return false;
            return this.enemy.contain(p);
        }
        return true;
    },

    /**
     * 结束战斗
     * @returns {boolean} false
     */
    end_fight() {
        if (this.enemy) this.enemy.length = 0;
        this.release_time = 0;
        if (!this.fight_type) return;

        this.send('{type:"combat",end:1}');
        if (this.record_damage && this.hp > 0) this.damages = null;
        this.fight_type = 0;
        if (this.attack_handler) clearTimeout(this.attack_handler);
        this.attack_handler = null;
        this.clear_combat_status();
        this.clear_combat_prop();
        return false;
    },

    /**
     * 查询当前有效敌人
     * @returns {CHARACTER|undefined}
     */
    query_enemy() {
        if (!this.enemy) return;
        for (let i = 0; i < this.enemy.length; i++) {
            if (this.enemy[i].hp <= 0 || !this.is_here(this.enemy[i])
                || !this.enemy[i].fight_type) {
                this.enemy.splice(i, 1);
                i--;
            }
        }
        return this.enemy[0];
    },

    /**
     * 是否可以攻击
     * @returns {boolean}
     */
    can_attack() {
        return this.hp > 0 && this.fight_type > 0 && !this.is_faint && !this.is_busy;
    },

    /**
     * 结束对某目标的一轮攻击
     * @param {CHARACTER} target
     * @returns {boolean|undefined} true继续攻击 false停止
     */
    end_attack(target) {
        if (!target) return;
        if (!this.fight_type) return;
        if (this.attack_skill.on_end_attack) {
            this.attack_skill.on_end_attack(this, target);
        }

        if (this.fight_type === 1 && target.hp / target.max_hp < 0.3) {
            if (target.hp <= 0) target.hp = 1;
            if (target.is_faint) {
                this.send_room(WINNER_MSG[this.random(4)], target);
            } else {
                this.send_room(WINNER_MSG.random(), target);
            }
            target.on_fight_over && target.on_fight_over(this, false);
            this.on_fight_over && this.on_fight_over(target, true);
            target.end_fight();
            return this.end_fight();
        } else if (target.hp <= 0 && target.die(this) !== false) {
            target.end_fight();

            this.enemy.remove(target);

            if (!this.enemy.length) {
                if (this.hp <= 0) {
                    this.hp = 1;
                }
                return this.end_fight();
            }
        }
        return true;
    },

    /**
     * 查询攻击部位
     * @returns {{name: string, hert: number, crit: number}}
     */
    query_part() {
        return CHARACTER_PARTS.random();
    },


    /**
     * 恢复满血满蓝，清除冷却
     */
    full() {

        this.hp = this.max_hp;
        this.mp = this.max_mp;
        this.clear_distime();
        this.release_time = 0;
        this.notify_hp();
    },

    /**
     * 清除技能冷却
     * @param {string} [pfmid] - 指定绝招ID
     */
    clear_distime(pfmid) {
        if (this.auto_skills) {
            if (!pfmid) {
                for (let i = 0; i < this.auto_skills.length; i++) {
                    const item = this.auto_skills[i];
                    item.release_time = 0;
                }
            } else {
                for (let i = 0; i < this.auto_skills.length; i++) {
                    const item = this.auto_skills[i];
                    if (item.pfm.id === pfmid) {
                        item.release_time = 0;
                        break;
                    }

                }
            }

        }
    },

    /**
     * 执行攻击动作
     * @param {*} par - 攻击参数
     */
    do_attacks(par) {

        let targets = par.targets;
        if (!targets) {
            targets = new Array(this.enemy.length);
            for (let i = 0; i < this.enemy.length; i++) {
                targets[i] = this.enemy[i];
            }
        }
        if (!targets.length) return;
        let attack_msg = par.attack_msg;
        if (attack_msg === undefined) attack_msg = (par.no_weapon ? this.noweapon_skill : this.attack_skill).query_attack_action(this, targets[0]);
        if (attack_msg !== "") this.send_combat(attack_msg, targets[0]);
        par.attack_msg = "";
        for (let i = 0; i < targets.length; i++) {
            par.target = targets[i];
            this.do_attack(par);
            this.end_attack(targets[i]);
        }
    },
});

/**
 * 人物攻击部位定义
 * @type {Array<{name: string, hert: number, crit: number}>}
 */
const CHARACTER_PARTS = [
    { name: "左脚", hert: 0.8, crit: 0 },
    { name: "右脚", hert: 0.8, crit: 0 },
    { name: "左腿", hert: 0.85, crit: 0 },
    { name: "右腿", hert: 0.85, crit: 0 },
    { name: "小腹", hert: 0.91, crit: 3 },
    { name: "胸前", hert: 0.95, crit: 4 },
    { name: "后背", hert: 0.97, crit: 4 },
    { name: "头部", hert: 1.2, crit: 10 },
    { name: "颈部", hert: 1.1, crit: 5 },
    { name: "后心", hert: 1, crit: 4 },
    { name: "左肩", hert: 0.85, crit: 1 },
    { name: "右肩", hert: 0.89, crit: 1 },
    { name: "左手", hert: 0.85, crit: 0 },
    { name: "左手", hert: 0.85, crit: 0 },
    { name: "腰间", hert: 0.99, crit: 5 }
];

/** @type {string[]} 胜利消息 */
const WINNER_MSG = [
    "<CYN>$N哈哈大笑，愉快地说道：承让了！</CYN>",
    "<CYN>$N双手一拱，笑著说道：知道我的厉害了吧！</CYN>",
    "<CYN>$N哈哈大笑，双手一拱，笑著说道：承让！</CYN>",
    "<CYN>$N胜了这招，向后跃开三尺，笑道：承让！</CYN>",
    "<CYN>$n脸色微变，说道：佩服，佩服！</CYN>",
    "<CYN>$n向后退了几步，说道：这场比试算我输了，佩服，佩服！</CYN>",
    "<CYN>$n向后一纵，躬身做揖说道：阁下武艺不凡，果然高明！</CYN>",
];
