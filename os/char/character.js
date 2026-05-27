/**
 * CHARACTER 生物基类
 */
require("../item");
/*global CHARACTER ROOM ITEM*/

/** @type {function} */
CHARACTER = function () {
    this.name = "生物";
    this.hp = this.max_hp = 100;
    this.mp = this.max_mp = 100;
    this.str = this.con = this.dex = this.int = 20;
    this.money = 0;
}
CHARACTER.inherits(ITEM);

/**
 * 发送消息给自身
 * @param {string} [msg]
 */
CHARACTER.prototype.send = function () {

}

/**
 * 通知消息(考虑状态)
 * @param {string} [msg]
 */
CHARACTER.prototype.notify = function () {

}

/**
 * 发送命令列表
 */
CHARACTER.prototype.send_commands = function () {

}

/**
 * 操作失败通知
 * @param {string} [text]
 * @returns {boolean} false
 */
CHARACTER.prototype.notify_fail = function () {
    return false;
}

/**
 * 是否存活
 * @returns {boolean}
 */
CHARACTER.prototype.is_living = function () {
    return this.hp > 0;
}

/**
 * 是否在指定路径的房间
 * @param {string} path - 房间路径
 * @returns {boolean}
 */
CHARACTER.prototype.is_in = function (path) {
    if (!this.environment) return false;
    return this.environment.path === path;
}

/**
 * 是否和目标在同一房间
 * @param {CHARACTER} obj
 * @returns {boolean}
 */
CHARACTER.prototype.is_here = function (obj) {
    if (!this.environment || !obj.environment) return false;
    return this.environment === obj.environment;
}

/**
 * 根据ID查找物品
 * @param {string} oid - 物品ID
 * @param {ITEM} [parent] - 父容器
 * @returns {ITEM|undefined}
 */
CHARACTER.prototype.find_obj = function (oid, parent) {
    var items = this.items;
    if (parent) items = parent.items;
    return this.find_obj_byid(items, oid);
}

/**
 * 向房间内所有人发送消息
 * @param {string} msg - 消息内容
 * @param {boolean} [include_me] - 是否包含自己
 */
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

/**
 * 发送战斗消息(支持多视角)
 * @param {string} text - 消息模板(含$占位符)
 * @param {CHARACTER} target - 目标
 */
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

/**
 * 发送房间消息(支持多视角)
 * @param {string} text - 消息模板
 * @param {CHARACTER} target - 目标
 * @param {boolean} [excludeself] - 是否排除自己
 */
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

/**
 * 查询用户设置
 * @param {string} name - 设置项名称
 * @returns {boolean|number}
 */
CHARACTER.prototype.query_setting = function (name) {
    return false;
}

/**
 * 根据视角类型拆分消息模板中的$占位符
 * @param {CHARACTER} me - 发起者
 * @param {string} text - 消息模板
 * @param {number} type - 视角类型: 1本人 2目标 3第三人称
 * @param {CHARACTER} target - 目标
 * @returns {string}
 */
function splitmessage(me, text, type, target) {
    if (text.length < 3) return text;
    var str = [];
    var start = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i] === "$") {
            start < i && str.push(text.substring(start, i));
            var ch = text[++i];
            start = i + 1;
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

/**
 * 执行命令字符串(解析并分发)
 * @param {string} req - 用户输入的命令字符串
 */
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

/**
 * 执行解析后的命令
 * @param {string} cmdName - 命令名
 * @param {string} [str] - 参数字符串
 */
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

/**
 * 对某物件执行命令
 * @param {ITEM} item - 目标物件
 * @param {string} cmd - 命令名
 * @param {Array<*>} pars - 参数列表
 * @returns {boolean} true表示已处理
 */
CHARACTER.prototype.do_item_action = function (item, cmd, pars) {
    if (!item || !item.actions) return;
    var cmdItem = item.actions[cmd];
    if (!cmdItem || !cmdItem.action) return;
    if (!this.check_command(cmdItem))
        return true;//返回true 不允许执行
    if (cmdItem.action.apply(item, pars) !== false)
        return true; //返回true表示不继续执行该命令
}

/**
 * 检查命令是否允许执行
 * @param {COMMAND} cmd - 命令对象
 * @returns {boolean}
 */
CHARACTER.prototype.check_command = function (cmd) {
    if (cmd.allow_level > this.user_level) {
        this.send("什么？");
        return false;
    }
    if (this.hp <= 0 && !cmd.allow_die) {
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

/**
 * 对象创建回调(模板注册)
 * @param {string} path - 资源路径
 * @param {string} [par] - 构造参数
 */
CHARACTER.prototype.create = function (path, par) {
    //模板被创建，实际上没真正用
    if (par) this.path = path + par;
    this.on_create && this.on_create(path, par);

    WORLD.NPC_STROE.set(this.path, this);
}

/**
 * 对象更新回调
 * @param {string} path
 * @param {string} [par]
 */
CHARACTER.prototype.update = function (path, par) {
    this.create(path, par);
}

/**
 * 克隆实例到实际场景中
 */
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


/** 初始化技能和装备属性 */
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

/** @type {number[]} 经验值各等级上限 */
CHARACTER.EXP_LIMIT = [300000, 3000000, 20000000];

/**
 * 增加经验/潜能/金钱
 * @param {number} [exp] - 经验值
 * @param {number} [pot] - 潜能值
 * @param {number} [money] - 金钱
 */
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

/**
 * 增加金钱
 * @param {number} val
 */
CHARACTER.prototype.add_money = function (val) {
    this.money += val;

}

/** 检查并更新套装属性 */
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
