require("../util/util.js");
require("./user.js");
FOLLOWER = function () {
    this.hp = this.max_hp = 100;
    this.mp = this.max_mp = 100;
    this.str = this.con = this.dex = this.int = this.per = this.age = 20;
    this.family = FAMILIES.NONE;
    this.auto_pfm = true;
    this.master = null;
    this.level = 3;
    this.master_name = null;
    this.max_item_count = 10;
    this.settings = {
        auto_kill: 1,
        auto_dice: 1
    };
}
FOLLOWER.inherits(CHARACTER);
FOLLOWER.prototype.query_setting = function (name) {
    if (!this.settings) return 0;
    return this.settings[name] || 0;
}
FOLLOWER.prototype.set_setting = function (name, value) {
    if (!this.settings) this.settings = {};
    if (!value || value == "0") {
        delete this.settings[name];
    } else {
        if (value == "1") value = 1;
        this.settings[name] = value;
    }

    this.login_message = null;
}
FOLLOWER.prototype.send = function (text) {
    if (this.listener) {
        text = text.replace('你', this.name);
        this.listener.send(text);
    }
}
FOLLOWER.prototype.notify_fail = function (text) {
    this.send(text);
    return false;
}
FOLLOWER.prototype.notify = function (text) {
    this.send(text);
}

FOLLOWER.prototype.set_listener = function (me, target) {
    if (me.id == this.master) this.listener = target;
}
FOLLOWER.STORES = new Map();
FOLLOWER.CLEAR = function (me) {
    if (!me.follower) return;
    for (var i = 0; i < me.follower.length; i++) {
        var npc = FOLLOWER.STORES.get(me.id + "_" + me.follower[i].id);
        if (npc) {
            FOLLOWER.STORES.delete(me.id + "_" + me.follower[i].id);
            npc.set_state(null);
            npc.environment && npc.environment.item_changed(npc, false);
            npc.clear_status();
        }
    }
}

FOLLOWER.RESET = function (me) {
    if (!me.follower) return;
    for (var i = 0; i < me.follower.length; i++) {
        var npc = FOLLOWER.STORES.get(me.id + "_" + me.follower[i].id);
        if (npc) {
            npc.set_state(null);
            npc.environment && npc.environment.item_changed(npc, false);
        }
    }
}
FOLLOWER.INIT_FROM_USER = function (me, datas) {

    for (var j = 0; j < datas.length; j++) {
        var data = datas[j];
        var my_npc = FOLLOWER.STORES.get(me.id + "_" + data.id);
        if (my_npc) continue;
        if (!datas[j].id) continue;
        my_npc = new FOLLOWER();
        var obj = NPC.CLONE(data.path);
        for (var i = 0; i < SAVE_NUMPROP.length; i++) {
            my_npc[SAVE_NUMPROP[i]] = data.prop[i] || 0;
        }
        for (var i = 0; i < SAVE_STRPROP.length; i++) {
            my_npc[SAVE_STRPROP[i]] = data[SAVE_STRPROP[i]] || obj[SAVE_STRPROP[i]];
        }
        my_npc.on_makelove = obj ? obj.on_makelove : null;
        my_npc.on_master_enter = obj ? obj.on_master_enter : null;
        my_npc.equipment = data.temp;
        my_npc.settings = data.settings;
        my_npc.skills = data.skills;
        my_npc.path = obj.path;
        my_npc.items = me.read_items(data.items);
        my_npc.equipment = me.read_items(data.eq);
        my_npc.level = my_npc.level || obj.level || 3;
        my_npc.init();
        my_npc.recount();
        my_npc.hp = my_npc.max_hp;
        my_npc.mp = my_npc.max_mp;
        FOLLOWER.STORES.set(me.id + "_" + my_npc.id, my_npc);
        my_npc.master = me.id;
        my_npc.master_name = me.name;
    }
}
FOLLOWER.INIT = function (me, par) {
    if (!par || !par.path) return;
    var npc;
    var id = me.id + "_" + par.id;
    if (par.id) {
        npc = FOLLOWER.STORES.get(id);
        if (npc) return npc;
    }
    var obj = NPC.CLONE(par.path);
    if (!obj) return;
    npc = new FOLLOWER();
    for (var i = 0; i < SAVE_NUMPROP.length; i++) {
        npc[SAVE_NUMPROP[i]] = obj[SAVE_NUMPROP[i]] || 0;
    }
    for (var i = 0; i < SAVE_STRPROP.length; i++) {
        npc[SAVE_STRPROP[i]] = obj[SAVE_STRPROP[i]] || "";
    }
    npc.on_makelove = obj.on_makelove;
    npc.on_master_enter = obj.on_master_enter;
    npc.equipment = obj.equipment;
    npc.skills = obj.skills;
    npc.items = obj.items;
    npc.id = par.id;
    npc.path = obj.path;
    npc.level = obj.level || 3;
    npc.init();
    npc.recount();
    FOLLOWER.STORES.set(id, npc);
    npc.master = me.id;
    npc.master_name = me.name;
    return npc;
}
FOLLOWER.REPLACE = function (me, old, npc) {
    if (!old || !npc) return;
    var copys = ["str", "con", "dex", "int", "gender", "kar", "per", "name", "title", "desc", "on_master_learn", "on_master_enter"];
    for (var i = 0; i < copys.length; i++) {
        old[copys[i]] = npc[copys[i]];
    }
    if (!old.skills) old.skills = {};
    if (!old.equipment) old.equipment = [];
    if (npc.equipment && npc.equipment[0]) {
        if (old.equipment[0]) {
            npc.items.push(npc.equipment[0]);
        } else {
            old.equipment[0] = npc.equipment[0];
        }
        npc.equipment[0] = null;
    }
    if (!old.items) old.items = [];
    if (npc.items && npc.items.length) {
        for (var i = 0; i < npc.items.length; i++) {
            old.items.push(npc.items[i]);
        }
        npc.items.length = 0;
    }

    for (var sk in npc.skills) {
        var oldSkill = old.skills[sk];
        if (oldSkill && oldSkill.addin && oldSkill.addin.length)
            continue;//已经进阶的不覆盖
        if (!oldSkill || oldSkill.level < npc.skills[sk].level) {
            old.skills[sk] = npc.skills[sk];
        }
    }
    if (npc.exp > old.exp) old.exp = npc.exp;
    if (npc.pot > old.pot) old.pot = npc.pot;
    if (npc.max_mp > old.max_mp) old.max_mp = npc.max_mp;


    old.prop = {};
    old.init();
    if (old.status) {
        for (var j = old.status.length - 1; j >= 0; j--) {
            var item = old.status[j];
            old.change_buff(item, true, item.count);
        }
    }
    old.recount();
    old.master_json = null;
    old.color_name = null;
    old.on_master_enter = npc.on_master_enter;
    old.on_makelove = npc.on_makelove;
    old.path = npc.path;
    old.level = npc.level > old.level ? npc.level : old.level;
    if (old.environment) {
        old.environment.item_changed(old, true);
    }
    for (var i = 0; i < me.follower.length; i++) {
        if (me.follower[i].id == old.id) {
            me.follower[i].path = npc.path;
            break;
        }
    }
}
FOLLOWER.GET = function (me, par) {
    var id = me.id + "_" + par.id;
    return FOLLOWER.STORES.get(id);
}
FOLLOWER.CREATE = function (me, par, callback) {
    if (!par || !par.path) return;
    var id = me.id + "_" + par.id;
    var npc = FOLLOWER.STORES.get(id);
    if (npc) return callback(npc);

}
var SAVE_NUMPROP = ["str", "con", "dex", "int", "gender", "max_mp", "limit_mp", "exp", "pot", "kar", "per"
    , "hp", "mp", "max_item_count", "money", 'level'];
var SAVE_STRPROP = ["id", "name", "title", "desc"];
FOLLOWER.prototype.save = function (me) {
    var str = ["prop:["];
    for (var i = 0; i < SAVE_NUMPROP.length; i++) {
        str.push(this[SAVE_NUMPROP[i]] || 0);
        str.push(",");
    }
    str.push("0],");
    var items = this.items || [];
    str.push("items:[");
    if (items) {
        for (var i = 0; i < items.length; i++) {
            if (i > 0) str.push(",");
            items[i].save_db(str);
        }
    }
    str.push("]");
    if (this.skills) {
        str.push(",skills:");
        str.push(JSON.stringify(this.skills));
    }
    if (this.temp) {
        str.push(",temp:", this.format_temp(this.temp));
    }
    if (this.settings) {
        str.push(",settings:");
        str.push(JSON.stringify(this.settings));
    }
    if (this.equipment) {
        str.push(",eq:[");
        for (var i = 0; i < this.equipment.length; i++) {
            if (i > 0) str.push(",");
            if (this.equipment[i]) this.equipment[i].save_db(str);
            else str.push("null");
        }
        str.push("]");
    }
    return str.join("");
}
FOLLOWER.SAVE = function (me) {
    if (!me.follower) return "[]";
    var str = ["["];
    for (var i = 0; i < me.follower.length; i++) {
        var item = me.follower[i];
        if (str.length > 1) str.push(",");
        str.push('{path:"');
        str.push(me.follower[i].path);
        str.push('",id:"');
        str.push(me.follower[i].id);
        str.push('"');
        var npc = FOLLOWER.STORES.get(me.id + "_" + item.id);
        if (npc) {
            str.push(",");
            str.push(npc.save(me));
        }
        str.push('}');

    }
    str.push("]");
    return str.join("");
}
var DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];
FOLLOWER.prototype.die = function (killer) {
    if (!this.environment) return;
    if (this.on_die && this.on_die(killer) == false) {
        this.hp = 1;
        return false;
    }
    this.clear_status();
    this.send_room(DIE_MSG.random());
    var corpse = new CORPSE();
    corpse.init(this, false);
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    this.environment = null;
}

FOLLOWER.prototype.heart_beat = function (dt) {
    if (!this.hp) return;
    // this.add_exp(this.grow_level, this.grow_level);
    if (!this.fight_type) {
        if (this.hp < this.max_hp) {
            this.add_hp(parseInt(this.max_hp / 3));
        }
        if (this.mp < this.max_mp) {
            this.add_mp(parseInt(this.max_mp / 3));
        }
        if (this.chat_msg) {
            var r = this.random(10);
            if (r > 7)
                this.send_message(this.chat_msg.random());
        }
    }
    if (this.state && (!this.fight_type || this.state.allow_fight)) {
        this.state.heat_count += 1;
        if (this.state.heat_count >= this.state.rate) {
            this.state.heat_count = 0;
            if (this.state.on_enter(this) === false) {
                this.set_state(null, true);
            }
        }
    }
}
FOLLOWER.prototype.set_state = function (state, isauto) {
    if (this.state && !state) {
        if (this.state.on_stop) {
            if (this.state.on_stop(this, isauto) == false) {
                return;
            }
        }
    }
    this.state = state;
    if (state) {
        state.rate = state.rate || 1;
        state.heat_count = 0;
        state.start_time = Date.now();
    }
    this.color_name = null;
    this.environment && this.environment.item_changed(this, true);
    this.master_json = null;
}

FOLLOWER.prototype.query_mastercommands = function () {
    if (this.master_json) return this.master_json;
    var json = {};
    json.type = "item";
    json.desc = this.desc;
    json.id = this.id;
    json.name = this.name;
    json.commands = [];
    json.commands.push({
        cmd: "look " + this.id,
        name: "查看"
    });
    json.commands.push({
        cmd: "fight " + this.id,
        name: "比试"
    });
    json.commands.push({
        cmd: "score " + this.id,
        name: "属性"
    });
    json.commands.push({
        cmd: "pack " + this.id,
        name: "背包"
    });
    json.commands.push({
        cmd: "cha " + this.id,
        name: "技能"
    });
    json.commands.push({
        cmd: "team with " + this.id,
        name: "组队"
    });
    json.commands.push({
        cmd: "trade " + this.id,
        name: "给" + this.call3() + "东西"
    });
    if (this.state) {
        json.commands.push({
            cmd: "dc " + this.id + " stopstate",
            name: "停止" + this.state.title.replace('中', "")
        });
    }
    if (this.actions) {
        for (var i = 0; i < this.actions.length; i++) {
            json.commands.push({
                cmd: this.actions[i].cmd,
                name: this.actions[i].name
            });
        }
    }
    this.master_json = JSON.stringify(json)
    return this.master_json;
}
FOLLOWER.prototype.query_commands = function (player) {
    if (player.id == this.master) {
        return this.query_mastercommands(player);
    }
    if (this.json) return this.json;
    var json = {};
    json.type = "item";
    json.desc = this.desc;
    json.id = this.id;
    json.follower = true;
    json.commands = [];
    json.commands.push({
        cmd: "look " + this.id,
        name: "查看"
    });
    if (!this.no_fight)
        json.commands.push({
            cmd: "fight " + this.id,
            name: "比试"
        });
    json.commands.push({
        cmd: "kill " + this.id,
        name: "击杀"
    });
    json.commands.push({
        cmd: "ask " + this.id + " about 主人",
        name: "询问主人"
    });
    this.json = JSON.stringify(json)
    return this.json;
}
FOLLOWER.prototype.on_ask = function (me, par) {
    switch (par) {
        case "主人":
            me.notify(this.name + "说道：我的主人就是" + this.master_name + "呀。");
            break;
    }
}
FOLLOWER.prototype.on_teamin = function (me) {
    if (!this.team) return;
    for (var i = 0; i < this.team.length; i++) {
        var tm = this.team[i];
        if (this.master == tm.id) {
            this.do_follow(tm);
        }
    }
}
FOLLOWER.prototype.on_teamout = function (me) {
    if (!this.team) return;
    for (var i = 0; i < this.team.length; i++) {
        var tm = this.team[i];
        if (this.master == tm.id) {
            this.do_follow(null);
            if (this.environment && this.environment.is_fb()) {
                this.environment.item_changed(this, false, this.name + "离开了。");
            }
        }
    }
}
FOLLOWER.prototype.long_name = function () {
    if (this.color_name) return this.color_name;
    var str = [];
    if (this.title) {
        str.push(this.title);
        str.push(" "); this.name;
    }
    str.push(this.name);
    if (this.state) {
        str.push("<hig>&lt;" + this.state.title + "&gt;</hig>");
    }
    return this.color_name = str.join("");

}
FOLLOWER.prototype.on_enter = function (me) {
    if (me.id == this.master) {
        this.on_master_enter && this.on_master_enter(me);
    }
}
FOLLOWER.prototype.on_master_leave = function (me, nextrm) {
    if (this.state || !this.team || this.team != me.team) return false;
    if (this.hp <= 0) return false;
    if (me.environment === this.environment) return false;

    //如果去副本或者家里就跟
    if (nextrm.is_fb() || nextrm.parent.id == "home") {
        return true;
    }


    //如果当前是副本就自己回去
    //if (this.environment.is_fb())
    //    this.environment.item_changed(this, false, this.name + "离开了。");
    return false;
}