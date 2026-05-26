
NPC = function () {
    this.hp = this.max_hp = 100;
    this.mp = this.max_mp = 100;
    this.str = this.con = this.dex = this.int = this.per = this.age = 20;
    this.family = FAMILIES.NONE;
    this.auto_pfm = true;
}
NPC.inherits(CHARACTER);
NPC.prototype.set_chat_msg = function (items, chance) {
    if (items) {
        this.chat_msg = items;
        //this.chat_chance = chance || 10;
    }
}
NPC.prototype.do_chat_msg = function () {
    if (!this.is_fighting() && this.is_living && this.chat_msg) {
        this.do_say(this.chat_msg.random());
    }
}
NPC.prototype.format_equipments = function (call3, str, eqcmd) {
    if (this.equipment && this.equipment.length) {
        var eqstr = [];
        for (var i = 0; i < this.equipment.length; i++) {
            var item = this.equipment[i];
            if (!item) continue;
            eqstr.push("<span cmd='", eqcmd || "look", " ", (i),
                " of ", this.id, "'>◆", item.color_name, "</span>\n");
        }
        if (eqstr.length) {
            return str.push(call3, "装备着：\n", eqstr.join(""));
        }
    }
    str.push(call3, "穿着一件<wht>布衣</wht>。\n");
}

NPC.prototype.set_goods = function () {
    if (!arguments.length) return;
    this.sell_list = [];
    for (var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        var obj = OBJ.CREATE(item);
        if (!obj) continue;
        obj.count = -1;
        this.sell_list.push(obj);
    }
}
NPC.prototype.query_commands = function (player) {

    if (this.json) return this.json;

    this.json = this.query_commands_json(player, false);
    return this.json;
}

NPC.prototype.query_commands_json = function (player, isyb) {
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
    if (!this.no_fight)
        json.commands.push({
            cmd: "fight " + this.id,
            name: "比试"
        });
    json.commands.push({
        cmd: "kill " + this.id,
        name: "击杀"
    });
    if (this.on_master) {
        json.commands.push({
            cmd: "bai " + this.id,
            name: "拜师"
        });
    }
    if (this.on_checkskill || this.on_master) {
        json.commands.push({
            cmd: "cha " + this.id,
            name: "学习"
        });
        json.master = true;
    }
    if (this.sell_list) {
        json.commands.push({
            cmd: "list " + this.id,
            name: "购买"
        });
        json.trader = true;
    }
    if (this.question) {
        for (var cmd in this.question) {
            json.commands.push({
                cmd: "ask " + this.id + " about " + cmd,
                name: "询问" + cmd
            });
        }
    }
    if (this.actions) {
        for (var cmd in this.actions) {
            if (!this.actions[cmd].name) continue;
            json.commands.push({
                cmd: cmd + " " + this.id,
                name: this.actions[cmd].name
            });
        }
    }
    return JSON.stringify(json);
}
NPC.prototype.update_action = function (acts) {
    this.json = null;
    this.actions = acts;
}

var DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];
NPC.prototype.die = function (killer) {
    if (!this.environment) return;
    if (this.on_die && this.on_die(killer) == false) {
        this.hp = 1;
        return false;
    }
    this.hp = 0;
    this.clear_status();
    this.send_room(DIE_MSG.random());
    this.clear_follow();
    var corpse = new CORPSE();

    var isinfb = this.environment.is_fb();
    corpse.init(this, isinfb);
    this.die_room = this.environment;
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    if (isinfb && this.score && killer && killer.add_fbscore) {
        //副本分数
        killer.add_fbscore(this.score);
    }
    if (!isinfb && !this.no_refresh && !this.master && !this.die_room.is_shadow) {
        this.call_out(this.relive, this.on_master ? 60000 : 300000);
    }
    this.on_died && this.on_died(killer, corpse);
    WORLD.auto_get(killer, corpse, this);
    if (killer && killer.attack_skill && killer.attack_skill.on_enemy_die) {
        killer.attack_skill.on_enemy_die(killer, this);
    }
}

NPC.prototype.relive = function () {
    if (!this.die_room) return;
    var room = ROOM.Get(this.die_room.path);
    var obj = room.find_obj_bypath(this.path);
    if (obj) return;
    obj = NPC.CLONE(this.path);
    room.item_changed(obj, true);
    this.die_room = null;
    this.equipment = null;
    this.items = null;
    this.skills = null;
}
NPC.prototype.destroy = function (msg) {
    if (this.environment) {
        this.environment.item_changed(this, false, msg);
    }
    this.clear_follow();

}
NPC.prototype.heart_beat = function (dt) {

    if (!this.fight_type) {
        if (this.hp < this.max_hp) {
            this.add_hp(parseInt(this.max_hp / 2));
        }
        if (this.mp < this.max_mp) {
            this.add_mp(parseInt(this.max_mp / 2));
        }
        if (this.chat_msg) {
            if (this.random(10) > 8)
                this.send_message(this.chat_msg.random());
        }
        this.on_heart_beat && this.on_heart_beat(dt);
    } else if (this.hp <= 0) {
        var eny = this.query_enemy();
        if (!eny) {
            this.hp = 1;
            this.fight_type = 0;
        }
    }

}



NPC.CREATE = function (path, env, oncreate, count) {
    if (!path || !env) return;


    if (env.environment) env = env.environment;
    count = count || 1;
    let obj = null;
    for (let i = 0; i < count; i++) {
        obj = NPC.CLONE(path);
        env.item_changed(obj, true);
        if (oncreate) oncreate(obj);
    }
    return obj;
}
NPC.CLONE = function (path) {
    let base = NPC.GET(path);
    let item = Object.create(base);
    item.clone();
    return item;
}
NPC.GET = function (path) {
    let base = WORLD.NPC_STROE.get(path);
    if (!base) {
        base = BASE.CREATE(__PATH.NPC, path);
        if (!base) throw new Error('没有人物' + path + "的定义。");
        //这里会自己调用create方法存储到NPC_STROE，记住了吗
    }
    return base;
}