require("../item");
/*global CHARACTER ROOM ITEM*/
CHARACTER = function () {
    this.name = "生物";
    this.hp = this.max_hp = 100;
    this.mp = this.max_mp = 100;
    this.str = this.con = this.dex = this.int = 20;
    this.money = 0;
}
CHARACTER.inherits(ITEM);
CHARACTER.prototype.send = function () {

}
CHARACTER.prototype.notify = function () {

}
CHARACTER.prototype.send_commands = function () {

}
CHARACTER.prototype.notify_fail = function () {
    return false;
}
CHARACTER.prototype.is_living = function () {
    return this.hp > 0;
}
CHARACTER.prototype.is_in = function (path) {
    if (!this.environment) return false;
    return this.environment.path === path;
}
CHARACTER.prototype.is_here = function (obj) {
    if (!this.environment || !obj.environment) return false;
    return this.environment === obj.environment;
}

CHARACTER.prototype.find_obj = function (oid, parent) {
    var items = this.items;
    if (parent) items = parent.items;
    return this.find_obj_byid(items, oid);
}
CHARACTER.prototype.send_message = function (msg, include_me) {
    if (!msg || !this.environment) return;
    var list = this.environment.items;
    for (var i = 0; i < list.length; i++) {
        if (list[i].is_player) {
            if (list[i] === this && !include_me) continue;
            if (!list[i].no_message)
                list[i].notify(msg);
        }
    }
}
CHARACTER.prototype.send_combat = function (text, target) {
    if (!this.environment || !text) return;
    var list = this.environment.items;
    var th_vision, item;
    for (var i = 0; i < list.length; i++) {
        item = list[i];
        if (item.is_player) {
            if (item === this) {
                if (!item.query_setting("no_mcmsg"))
                    item.notify(splitmessage(this, text, 1, target));
            } else if (item === target) {
                if (!item.query_setting("no_mcmsg"))
                    item.notify(splitmessage(this, text, 2, target));
            } else if (!item.no_message && !item.query_setting("no_combatmsg")) {
                if (!th_vision) th_vision = splitmessage(this, text, 3, target);
                item.notify(th_vision);
            }
        }
    }
}
CHARACTER.prototype.send_room = function (text, target, excludeself) {
    if (!this.environment || !text) return;
    var list = this.environment.items;
    var th_vision;
    for (var i = 0; i < list.length; i++) {
        if (list[i].is_player) {
            if (list[i] === this) {
                !excludeself && list[i].notify(splitmessage(this, text, 1, target));
            } else if (list[i] === target) {
                list[i].notify(splitmessage(this, text, 2, target));
            } else if (!list[i].no_message) {
                if (!th_vision) th_vision = splitmessage(this, text, 3, target);
                list[i].notify(th_vision);
            }
        }
    }
}
CHARACTER.prototype.query_setting = function (name) {
    return false;
}
function splitmessage(me, text, type, target) {
    if (text.length < 3) return text;
    var str = [];
    var start = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i] === "$") {
            start < i && str.push(text.substring(start, i));
            var ch = text[++i];
            start = i + 1;
            //type 1本人视角 2目标视角 3第三人称视角
            switch (ch) {
                case "N"://本人
                    str.push(type === 1 ? "你" : me.name);
                    break;
                case "n"://目标
                    str.push(type === 2 ? "你" : target.name);
                    break;
                case "P":
                    str.push(type === 1 ? "你" : me.call3());
                    break;
                case "p":
                    str.push(type === 2 ? "你" : target.call3());
                    break;
                case "l":
                    str.push(me.attack_part ? me.attack_part.name : "");
                    break;
                case "W":
                case "w":
                    str.push(me.weapon_name() || "手");
                    break;
                case "i":
                    str.push(target.weapon_name() || "手");
                    break;
                case "T":
                    str.push(me.throwing_name());
                    break;

            }
        }
    }
    start < i && str.push(text.substring(start, i));
    return str.join("");
}

//执行一串命令
CHARACTER.prototype.command = function (req) {

    if (this.wait_input) { //如果用户等待输入
        this.wait_input.apply(this, [this, req]);
        return;
    }
    var cmd = null, pars = null, start = 0, i = 0;
    for (; i < req.length; i++) {
        if (req[i] === ' ') {
            if (start < i) {
                cmd = req.substring(start, i);
                pars = req.substring(i + 1);
                break;
            }
            start = i;
        }
    }
    if (!cmd) cmd = req;
    this.do_command(cmd, pars);
}
CHARACTER.prototype.do_command = function (cmdName, str) {

    var cmd = WORLD.COMMANDS[cmdName];
    var pars;
    if (cmd && cmd.regex && str) {
        pars = cmd.regex.exec(str);
        pars ? pars[0] = this : pars = [this, str];
    } else {
        pars = [this, str];
    }
    if (this.do_item_action(this.environment, cmdName, pars)) {
        //如果环境触发这个命令就返回
        return;
    }
    cmd = cmd || WORLD.DEFAULT_COMMAND;
    if (cmd) {
        if (!this.check_command(cmd))
            return;//不允许执行
        if (cmd.enter.apply(cmd, pars) !== false) {

            return;//命令执行完成。
        }

    }
    if (str) {
        //如果有参数，尝试找下这个物件
        if (this.do_item_action(this.find_obj(str, this.environment), cmdName, pars)) {
            //如果物件触发这个命令就返回
            return;
        }
    }
    this.send("什么？");
}
CHARACTER.prototype.do_item_action = function (item, cmd, pars) {
    if (!item || !item.actions) return;
    var cmdItem = item.actions[cmd];
    if (!cmdItem || !cmdItem.action) return;
    if (!this.check_command(cmdItem))
        return true;//返回true 不允许执行
    if (cmdItem.action.apply(item, pars) !== false)
        return true; //返回true表示不继续执行该命令
}
CHARACTER.prototype.check_command = function (cmd) {
    if (cmd.allow_level > this.user_level) {
        this.send("什么？");
        return false;
    }
    if (this.hp <= 0 && !cmd.allow_die) {
        //死亡状态,除了一些特殊指令都不能做
        return this.notify_fail("你现在是灵魂状态，不能那么做。");
    }
    if (!cmd.allow_faint && this.is_faint) {
        this.send("你正在昏迷中！");
        return false;
    }
    if (!cmd.allow_state && this.state) {
        return this.notify_fail("你正在" + this.state.title + "，没时间这么做。");
    }
    if (!cmd.allow_fight && this.fight_type > 0) {
        return this.notify_fail("你正在战斗，待会再说。");
    }
    if (!cmd.allow_busy && this.is_busy) {
        return this.notify_fail("你现在正忙。");
    }

    return true;
}
CHARACTER.prototype.create = function (path, par) {
    //模板被创建，实际上没真正用
    if (par) this.path = path + par;
    this.on_create && this.on_create(path, par);

    WORLD.NPC_STROE.set(this.path, this);
}
CHARACTER.prototype.update = function (path, par) {
    this.create(path, par);
}

//真正被复制到房间
CHARACTER.prototype.clone = function () {
    if (this.temp) this.temp = Object.create(this.temp);
    if (this.prop) this.prop = Object.create(this.prop);
    if (this.equipment) {
        let eqs = [];
        for (let i = 0; i < this.equipment.length; i++) {
            let item = this.equipment[i];
            if (item) {
                eqs[i] = OBJ.CREATE(item.path);
            }
        }
        this.equipment = eqs;
    }
    //装备和道具只保留引用应该没事，2个相同NPC的装备和背包是同一个道具
    //好像随从不行
    if (this.items) {
        let items = [];
        for (let i = 0; i < this.items.length; i++) {
            items[i] = OBJ.CREATE(this.items[i].path);
        }
        this.items = items;
    }
    this.create_id();
    this.init();

    this.recount();
    this.hp = this.max_hp;
    this.mp = this.max_mp;
    this.on_clone && this.on_clone();
}


CHARACTER.prototype.init = function () {
    if (this.equipment) {
        let groups = {};
        for (let i = 0; i < this.equipment.length; i++) {
            let item = this.equipment[i];
            if (item) {
                item.change_prop(this, true);
                item.on_eq && item.on_eq(this);
                if (item && item.group_name) {
                    groups[item.group_name] = (groups[item.group_name] || 0) + 1;
                    var prop = item.group_prop(groups[item.group_name]);
                    if (prop) {
                        this.change_prop(prop, true);
                    }
                }
            }
        }
    }
    if (this.is_player) this.score = 0;
    if (this.skills) {
        for (let item in this.skills) {
            var base_skill = SKILL.get(item);
            if (!base_skill) {
                delete this.skills[item];
                continue;
            }
            base_skill.attach_prop(this, this.query_skill(item));
            if (this.is_player) {
                this.score += base_skill.query_score(this.skills[item].level, this);
            }

        }
    }

    this.init_skill();
}
CHARACTER.EXP_LIMIT = [300000, 3000000, 20000000];
CHARACTER.prototype.add_exp = function (exp, pot, money) {
    if (exp) {
        exp += this.query_temp("exp_up", 0);

    }
    if (pot) {
        pot += this.query_temp("pot_up", 0);

    }
    var str = ["<hig>你获得了"];
    if (exp) {
        this.exp += exp;
        str.push(exp);
        str.push("点经验");
    }
    if (pot) {
        this.pot += pot;
        if (exp) str.push("，");
        str.push(pot);
        str.push("点潜能");
    }
    if (money) {

        this.money += money;
        if (exp || pot) str.push("，");
        str.push(UTIL.moneyToStr(money));
    }
    if (str.length === 1) return;
    str.push("。</hig>");
    this.send(str.join(""));
}
CHARACTER.prototype.add_money = function (val) {
    this.money += val;

}
CHARACTER.prototype.check_groupeq = function () {
    var eqs = {};
    for (var i = 0; i < this.equipment.length; i++) {
        var item = this.equipment[i];
        if (item && item.group_name) {
            eqs[item.group_name] = (eqs[item.group_name] || 0) + 1;
            var prop = item.group_prop(eqs[item.group_name]);
            if (prop) {
                this.change_prop(prop, true);
            }
        }
    }
}