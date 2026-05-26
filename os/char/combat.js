
require("./character.js");
CHARACTER.prototype.begin_attack = function (target, type) {

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
        this.fight_type = type; //1fight hp<30% 2 kill 0
    }

}
CHARACTER.prototype.do_fight = function (target) {
    this.begin_attack(target, 1);
}
CHARACTER.prototype.do_kill = function (target) {
    if (this.fight_type == 2 && this.query_enemy() == target) return;
    this.begin_attack(target, 2);
    target.begin_attack(this, 2);
    target.notify("<hir>看起来" + this.name + "想杀死你！</hir>\n");
    this.notify("<hir>看起来" + target.name + "想杀死你！</hir>\n");
}
CHARACTER.prototype.add_enemy = function (target) {
    if (!this.enemy) {
        this.enemy = [];
    }
    this.enemy.push(target);
}
CHARACTER.prototype.notify_hp = function (type, val) {
    if (!this.environment) return;

    var items = this.environment.items;
    var str = null;
    if (type) {
        str = "{type:\"sc\",id:\"" + this.id + "\"," + type + ":" + val + "";
    } else {
        var ary = ["{type:\"sc\",id:\""];
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
    var showdamage = type ? type === "hp" : false;
    for (var i = 0; i < items.length; i++) {
        var player = items[i];
        if (player.is_player) {
            if (showdamage && this.damages && player.query_setting('show_damage')) {
                player.send(str + ",damage:" + (this.damages[player.id] || 0) + "}");
            } else {
                player.send(str + "}");
            }
        }
    }
}
CHARACTER.prototype.add_hp = function (v) {

    if (v > this.max_hp - this.hp) v = this.max_hp - this.hp;
    else if (v < -this.hp) v = -this.hp;
    if (!v) return 0;

    this.hp += v;
    this.notify_hp("hp", this.hp);
    return v;
}
CHARACTER.prototype.add_mp = function (v) {
    var mp = this.mp + v;
    if (mp > this.max_mp) mp = this.max_mp;
    if (mp < 0) mp = 0;
    if (mp === this.mp) return;
    this.mp = mp;
    this.notify_hp("mp", this.mp);
    return v;
}
CHARACTER.prototype.is_fighting = function (p) {
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
}
CHARACTER.prototype.end_fight = function () {
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
}
CHARACTER.prototype.query_enemy = function () {
    if (!this.enemy) return;
    for (var i = 0; i < this.enemy.length; i++) {
        if (this.enemy[i].hp <= 0 || !this.is_here(this.enemy[i])
            || !this.enemy[i].fight_type) {
            this.enemy.splice(i, 1);
            i--;
        }
    }
    return this.enemy[0];
}
CHARACTER.prototype.can_attack = function () {
    return this.hp > 0 && this.fight_type > 0 && !this.is_faint && !this.is_busy;
}

CHARACTER.prototype.end_attack = function (target) {
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
    return true;//是否继续攻击 
}
CHARACTER.prototype.query_part = function () {
    return CHARACTER_PARTS.random();
}


CHARACTER.prototype.full = function () {

    this.hp = this.max_hp;
    this.mp = this.max_mp;
    this.clear_distime();
    this.release_time = 0;
    this.notify_hp();
}

CHARACTER.prototype.clear_distime = function (pfmid) {
    if (this.auto_skills) {
        if (!pfmid) {
            for (let i = 0; i < this.auto_skills.length; i++) {
                let item = this.auto_skills[i];
                item.release_time = 0;
            }
        } else {
            for (let i = 0; i < this.auto_skills.length; i++) {
                let item = this.auto_skills[i];
                if (item.pfm.id === pfmid) {
                    item.release_time = 0;
                    break;
                }

            }
        }

    }
}
CHARACTER.prototype.do_attacks = function (par) {

    var targets = par.targets;
    if (!targets) {
        targets = new Array(this.enemy.length);
        for (var i = 0; i < this.enemy.length; i++) {
            targets[i] = this.enemy[i];
        }
    }
    if (!targets.length) return;
    var attack_msg = par.attack_msg;
    if (attack_msg === undefined) attack_msg = (par.no_weapon ? this.noweapon_skill : this.attack_skill).query_attack_action(this, targets[0]);
    if (attack_msg !== "") this.send_combat(attack_msg, targets[0]);
    par.attack_msg = "";
    for (let i = 0; i < targets.length; i++) {
        par.target = targets[i];
        this.do_attack(par);
        this.end_attack(targets[i]);
    }
}
var CHARACTER_PARTS = [
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

var WINNER_MSG = [
    "<CYN>$N哈哈大笑，愉快地说道：承让了！</CYN>",
    "<CYN>$N双手一拱，笑著说道：知道我的厉害了吧！</CYN>",
    "<CYN>$N哈哈大笑，双手一拱，笑著说道：承让！</CYN>",
    "<CYN>$N胜了这招，向后跃开三尺，笑道：承让！</CYN>",
    "<CYN>$n脸色微变，说道：佩服，佩服！</CYN>",
    "<CYN>$n向后退了几步，说道：这场比试算我输了，佩服，佩服！</CYN>",
    "<CYN>$n向后一纵，躬身做揖说道：阁下武艺不凡，果然高明！</CYN>",
];
