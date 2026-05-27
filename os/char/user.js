/**
 * USER 玩家类
 */
require("./character.js");

/** @type {function} */
USER = function () {
    /** @type {*} */
    this.socket = null;
    /** @type {FAMILY} */
    this.family = FAMILIES.NONE;
    /** @type {number} 最大携带物品数 */
    this.max_item_count = 20;
    /** @type {number} 最大存储物品数 */
    this.max_store_count = 20;
    /** @type {number} */
    this.money = 0;
    /** @type {number} */
    this.request_count = 0;
    /** @type {number} */
    this.cash_money = 0;
    /** @type {number} */
    this.score = 0;
    /** @type {Array|null} */
    this.follower = null;
    /** @type {string} */
    this.password = "";
    /** @type {number} */
    this.loginTime = 0;
    /** @type {*} */
    this.id_address = null;
    /** @type {number} */
    this.user_level = 0;
    /** @type {number} */
    this.eq_group = 0;
};
USER.inherits(CHARACTER);
/** @type {boolean} */
USER.prototype.is_player = true;

/**
 * 通知消息(玩家状态)
 * @param {string} text
 */
USER.prototype.notify = function (text) {
    if (this.socket && !this.is_faint && text && text.length < 30240)
        this.socket.send(text);
}

/**
 * 直接发送消息(无视状态)
 * @param {string} text
 */
USER.prototype.send = function (text) {
    if (this.socket && text && text.length < 30240) {
        this.socket.send(text);
    }
}

/**
 * 发送失败通知
 * @param {string} text
 * @returns {boolean} false
 */
USER.prototype.notify_fail = function (text) {
    if (this.socket && !this.is_faint)
        this.socket.send(text);
    return false;
}

/**
 * 发送警告消息
 * @param {string} content - 警告内容
 * @param {string[]} cmds - 命令/名称交替数组
 * @param {number} [time] - 超时时间
 */
USER.prototype.send_warn = function (content, cmds, time) {
    var str = ["{type:\"warn\",content:\""];
    str.push(content);
    str.push("\"");
    if (time) {
        str.push(",time:");
        str.push(time);
    }
    str.push(",cmds:[");
    for (var i = 0; i < cmds.length; i += 2) {
        if (i > 0) str.push(",");
        str.push("{cmd:\"");
        str.push(cmds[i]);
        str.push("\",name:\"");
        str.push(cmds[i + 1]);
        str.push("\"}");
    }
    str.push("]}");
    this.send(str.join(""));
}

/**
 * 发送命令按钮列表
 */
USER.prototype.send_commands = function () {
    var str = ["{type:\"cmds\",items:["];
    for (var i = 0; i < arguments.length; i += 2) {
        if (i > 0) str.push(",");
        str.push("{cmd:\"");
        str.push(arguments[i]);
        str.push("\",name:\"");
        str.push(arguments[i + 1]);
        str.push("\"}");
    }
    str.push("]}");
    this.send(str.join(""));
}

/**
 * 是否有Socket连接
 * @returns {boolean}
 */
USER.prototype.is_connect = function () {
    return this.socket !== null;
}

/** 发送登录初始化消息 */
USER.prototype.send_loginmessage = function () {
    if (!this.login_message) {
        var str = ['{type:"login"'];
        if (this.settings) {
            str.push(",setting:")
            str.push(JSON.stringify(this.settings));
            this.no_message = this.settings['no_message'] == 1;
        }
        str.push(",id:\"");
        str.push(this.id, '",level:', this.level);
        str.push("}");
        this.login_message = str.join("");
    }

    this.send(this.login_message)
}

/**
 * 重新连线(账号被顶替后重连)
 * @param {USER} newUser - 新连接的用户对象
 */
USER.prototype.relogin = function (newUser) {
    if (!newUser.socket) return;
    newUser.socket.user = null;
    this.socket = newUser.socket;
    newUser.socket = null;
    this.socket.user = this;
    this.send_loginmessage();

    if (!this.environment) {
        var rm = ROOM.Get(this.quit_room);
        if (!rm) {
            return this.send("出现错误，请联系管理员报告BUG，谢谢！");
        }
        this.environment = rm;
    }
    this.send(this.environment.to_json());
    this.environment.send_exits(this);
    this.send(this.environment.items_to_json());
    this.send_room(this.name + "重新连线。");
    if (this.environment.on_relogin) {
        this.environment.on_relogin(this);
    }
    this.disconnect_time = 0;
    this.check_state();
    this.on_skillchanged();
}

/**
 * 获取IP地址
 * @returns {string}
 */
USER.prototype.ip = function () {
    return this.socket.remoteAddress;
}

/**
 * 获取端口
 * @returns {number}
 */
USER.prototype.port = function () {
    return this.socket.remotePort;
}

/** 退出游戏 */
USER.prototype.quit = function () {
    var rm = this.environment;
    if (this.environment) {

        this.team_out("离开了游戏，自动退出队伍");
        this.environment.item_changed(this, false, this.name + "离开了游戏。");
        this.environment = rm;
        this.clear_follow();
        this.environment.clear_copy(this);
        this.environment.parent.on_leaved(this);
    }
    this.environment = null;
    this.clear_status();
    this.environment = rm;
    WORLD.login_out(this);
    this.environment = null;

    this.clear_home();
    if (this.socket) {
        this.socket.user = null;
        this.socket = null;
    }
}

/**
 * 判断是否已进入游戏世界
 * @returns {boolean}
 */
USER.prototype.in_world = function () {
    return !!this.environment && !!this.socket;
}

/**
 * 断线处理
 * @param {boolean} [isreplace] - 是否被顶替
 */
USER.prototype.disconnect = function (isreplace) {
    if (this.environment && this.socket) {
        if (isreplace)
            this.send("<RED>有人使用你的角色从别的地址登陆游戏，请重新登陆</RED>");
    }
    this.disconnect_time = Date.now();
    if (this.socket) {
        let socket = this.socket;
        this.socket = null;
        socket.user = null;
        socket.end();
    }
}

/**
 * 从数据库记录加载用户数据
 * @param {{id: string, name: string, level: number, data: string, user_level: number}} role
 */
USER.prototype.loadData = function (role) {
    this.id = role.id;
    this.name = role.name;
    this.level = role.level;
    var data = JSON.toObject(role.data);
    for (var i = 0; i < SAVE_NUMPROP.length; i++) {
        this[SAVE_NUMPROP[i]] = data.prop[i] || 0;
    }
    this.quit_room = data.quit_room;
    this.items = this.read_items(data.items);
    this.stores = this.read_items(data.stores);
    this.books = data.books ?? [];
    this.equipment = this.read_items(data.eq);
    this.settings = data.settings;

    this.skills = data.skills ?? {};
    this.eq_groups = data.eq_groups;
    this.sk_groups = data.sk_groups ?? [null, [], []];
    this.temp = data.temp;
    this.read_titles(data.titles);
    if (data.follower) {
        this.follower = [];
        FOLLOWER.INIT_FROM_USER(this, data.follower);
        for (var i = 0; i < data.follower.length; i++) {
            this.follower.push({
                id: data.follower[i].id,
                path: data.follower[i].path
            });
        }
    }
    var fam = this.query_temp("family");
    if (fam) {
        this.family = FAMILIES[fam] || FAMILIES.NONE;
    }
    this.user_level = role.user_level;
}

/**
 * 读取称号数据
 * @param {Array<[string, string, number]>} titles - 称号数组
 */
USER.prototype.read_titles = function (titles) {
    this.titles = [];
    if (!titles) return;
    for (let item of titles) {
        this.titles.push({
            title: item[0], type: item[1],
            use: item[2] === 1
        });
        if (item[2]) {
            this.title = item[0];
        }
    }
}

/**
 * 从数据库数组读取物品列表
 * @param {Array<Array<*>>} items - 物品数据数组
 * @returns {OBJ[]}
 */
USER.prototype.read_items = function (items) {
    var objs = [];
    if (!items) return objs;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item) {
            objs.push(null);
            continue;
        }
        var obj = OBJ.CREATE(item[0]);
        if (obj) {
            obj.load_db(item);
            obj.on_load(this);
            objs.push(obj);
        }

    }
    return objs;
}

/** 执行登录初始化 */
USER.prototype.do_login = function () {
    this.init();
    this.recount();
    this.long_name();
    WORLD.STATS.checkStats(this);
    this.send_loginmessage();
    if (this.family) this.family.on_login(this);
    var rm = ROOM.Get(this.query_temp("new") ? "new/new1" : this.quit_room);
    if (!rm || rm.is_fb()) rm = ROOM.Get(DEFAULT_ROOM);
    if (rm.is_copy()) {
        var copy_room = rm.query_copy2(this);
        if (copy_room) {
            this.moveto(copy_room, null, this.name + "连线进入这个世界。");
        } else {
            if (this.query_temp("new")) {
                this.set_temp("new", 1);
                this.items = [];
                this.exp = this.pot = this.money = 0;
            }
            copy_room = rm.create_copy2(this);
            this.moveto(copy_room);
        }
    } else {
        this.moveto(rm, null, this.name + "连线进入这个世界。");
    }
    this.check_state();
}

/** @type {string} 默认出生房间 */
var DEFAULT_ROOM = "yz/wumiao";

/** @type {string[]} 需要保存的数值属性列表 */
var SAVE_NUMPROP = ["str", "con", "dex", "int", "gender", "max_mp", "limit_mp", "exp", "pot", "kar", "per"
    , "hp", "mp", "max_item_count", "money", "reg_time",
    "max_store_count", "cash_money", 'eq_group'];

/**
 * 获取玩家存档数据
 * @returns {{id: string, userid: *, name: string, level: number, title: string, data: string}}
 */
USER.prototype.getData = function () {
    var str = ["{prop:["];
    for (var i = 0; i < SAVE_NUMPROP.length; i++) {
        str.push(this[SAVE_NUMPROP[i]]);
        str.push(",");
    }
    str.push(0);
    str.push("],quit_room:\"");
    if (this.environment) {
        if (this.environment.is_fb() || this.environment.no_save
            || this.environment.parent.no_save) {
            str.push(this.query_temp("enter_room"));
        } else {
            str.push(this.environment.path);
        }
    } else {
        str.push(this.query_temp("enter_room", DEFAULT_ROOM));
    }
    str.push("\"");
    var items = this.items;
    if (items) {
        str.push(",items:[");
        for (let i = 0; i < items.length; i++) {
            if (i > 0) str.push(",");
            items[i].save_db(str);
        }
        str.push("]");
    }
    items = this.stores;
    if (items) {
        str.push(",stores:[");
        for (let i = 0; i < items.length; i++) {
            if (i > 0) str.push(",");
            items[i].save_db(str);
        }
        str.push("]");
    }
    items = this.books;
    if (items && items.length > 0) {
        str.push(',books:["', items.join('", "'), '"]');
    }
    if (this.skills) {
        str.push(",skills:");
        str.push(JSON.stringify(this.skills));
    }
    str.push(",temp:", this.format_temp(this.temp));
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
    if (this.titles) {
        str.push(",titles:[");
        for (var i = 0; i < this.titles.length; i++) {
            if (i > 0) str.push(",");
            var item = this.titles[i];
            str.push('["', item.title, '","', item.type, '"');
            if (item.use) str.push(',1');
            str.push(']');
        }
        str.push("]");
    }
    if (this.follower) {
        str.push(",follower:");
        str.push(FOLLOWER.SAVE(this));
    }
    str.push(',eq_groups:[');
    for (let i = 0; i < this.eq_groups.length; i++) {
        if (i > 0) str.push(',');
        if (i === this.eq_group || !this.eq_groups[i]) str.push('[]');
        else str.push('["', this.eq_groups[i].join('","'), '"]');
    }
    str.push('],sk_groups:[');
    for (let i = 0; i < this.sk_groups.length; i++) {
        if (i > 0) str.push(',');
        if (!this.sk_groups[i]) str.push('0');
        else str.push('["', this.sk_groups[i].join('","'), '"]');
    }

    str.push("]}");

    var role = {};
    role.id = this.id;
    role.userid = this.userid;
    role.name = this.name;
    role.level = this.level;
    role.title = this.title || this.get_level_desc();
    role.data = str.join("");
    return role;
}


/** 保存玩家数据到数据库 */
USER.prototype.save = function () {

    WORLD.DB.saveRole(this.getData());
}

/**
 * 玩家死亡处理
 * @param {CHARACTER} killer - 击杀者
 * @returns {boolean|undefined}
 */
USER.prototype.die = function (killer) {
    if (this.on_die && this.on_die(killer) === false) {
        this.hp = 1;
        return false;
    }
    this.clear_status();

    this.hp = 0;
    this.mp = 0;

    this.send_room(DIE_MSG.random());
    var env = this.environment;
    if (env.items.length < 10) {
        var corpse = new CORPSE();
        corpse.init(this);
        env.item_changed(corpse, true);
    }
    env.item_changed(this, false);
    this.environment = env;
    this.check_state();
    WORLD.on_user_die(this, killer);
    this.on_died(killer);
}

/**
 * 死亡后回调
 * @param {CHARACTER} [killer]
 */
USER.prototype.on_died = function () {

}

/** 检查并同步玩家状态到客户端 */
USER.prototype.check_state = function () {
    if (this.hp <= 0) {
        if (this.state) this.set_state(null);
        this.send('{type:"die",commands:[{cmd:"relive",name:"去武庙复活"},{cmd:"relive locale",name:"原地复活"}]}');
    } else {
        if (this.state) this.set_state(this.state);
    }


}

/**
 * 查询玩家操作命令列表(JSON)
 * @param {USER} player - 观察者
 * @returns {string} JSON字符串
 */
USER.prototype.query_commands = function (player) {
    if (this.commands_json) return this.commands_json;
    var json = {};
    json.type = "item";
    json.desc = this.long_name();
    json.id = this.id;
    json.commands = [];
    json.commands.push({
        cmd: "look " + this.id,
        name: "查看"
    });
    if (player != this) {
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
            cmd: "team add " + this.id,
            name: "邀请组队"
        });
        if (this.level > 1 && !this.query_setting("ban_master") && !this.query_temp("tudi") && !this.query_temp("shifu")) {
            json.commands.push({
                cmd: "baishi " + this.id,
                name: "拜师"
            });
        }
    }
    this.commands_json = JSON.stringify(json)
    return this.commands_json;
}

/**
 * 查询指定类型的称号
 * @param {string} type - 称号类型
 * @returns {string|null}
 */
USER.prototype.query_title = function (type) {
    if (!this.titles) return null;
    for (var i = 0; i < this.titles.length; i++) {
        if (this.titles[i].type == type) {
            return this.titles[i].title;
        }
    }
}

/**
 * 添加称号
 * @param {string} title - 称号名称
 * @param {string} type - 称号类型
 */
USER.prototype.add_title = function (title, type) {
    if (!this.titles) this.titles = [];
    var obj = { title: title, type: type };
    for (var i = 0; i < this.titles.length; i++) {
        if (this.titles[i].type == type) {
            obj.use = this.titles[i].use;
            this.titles.splice(i, 1);
            break;
        }
    }
    if (obj.title) {
        if (!this.titles.length) obj.use = true;
        this.titles.push(obj);
    }
    if (obj.use) {
        if (!title) {
            if (this.titles.length) {
                this.titles[0].use = true;
                title = this.titles[0].title;
            }
        }
        this.title = title;
        this.color_name = null;
        if (this.environment)
            this.environment.item_changed(this, true);
    }

}

/**
 * 查询用户设置项
 * @param {string} name - 设置项名称
 * @returns {number} 设置值
 */
USER.prototype.query_setting = function (name) {
    if (!this.settings) return 0;
    return this.settings[name] || 0;
}

/**
 * 设置用户配置项
 * @param {string} name - 设置项名称
 * @param {string|number} value - 设置值
 */
USER.prototype.set_setting = function (name, value) {
    if (!this.settings) this.settings = {};

    if (!value || value == "0") {
        delete this.settings[name];
    } else {
        if (value == "1") value = 1;
        this.settings[name] = value;
    }

    this.login_message = null;
}

/**
 * 玩家心跳处理
 * @param {number} dt - 当前时间戳
 */
USER.prototype.heart_beat = function (dt) {
    this.request_count = 0;
    if (this.state && (!this.fight_type || this.state.allow_fight)) {
        this.state.heat_count += 1;
        if (this.state.heat_count >= this.state.rate) {
            this.state.heat_count = 0;
            if (this.state.on_enter(this, dt) === false) {
                this.set_state(null, true);
            }
        }
    }
    this.on_heart_beat && this.on_heart_beat(dt);
    if (this.disconnect_time) {
        if (dt - this.disconnect_time > (this.state ? 86400000 : 3600000)) {
            return this.quit();
        }
    }
}

/**
 * 设置玩家状态(打坐/练功/闭关等)
 * @param {{title: string, rate: number} | null} state - 状态对象或null
 * @param {boolean} [isauto] - 是否自动触发
 */
USER.prototype.set_state = function (state, isauto) {
    if (this.state && !state) {
        if (this.state.on_stop) {
            if (this.state.on_stop(this, isauto) == false) {
                return;
            }
        }
        this.send("{type:\"state\"}");
    }
    this.state = state;
    if (state) {
        state.rate = state.rate || 1;
        state.heat_count = 0;
        state.start_time = Date.now();
        var msg = "{type:\"state\",state:\"你正在" + state.title + "\"";
        if (state.desc) {
            msg += ",desc:" + state.desc;
        }
        if (state.no_stop) {
            msg += ",no_stop:true";
        }
        if (state.commands) {
            msg += ",commands:" + state.commands;
        }
        this.send(msg + "}");
    }
    this.color_name = null;
    if (this.environment)
        this.environment.item_changed(this, true);
}

/**
 * 获取状态文本描述
 * @returns {string}
 */
USER.prototype.get_state = function () {
    var str = "";
    if (!this.socket) str += "<red>&lt;断线中&gt;</red>";
    if (this.state) str += ("<hig>&lt;" + this.state.title + "&gt;</hig>");
    return str;
}

/** @type {string[]} 等级称号 */
const LEVELS_TITLES = ["普通百姓", "武士", "武师", "宗师", "武圣", "武帝", "武神"];

/**
 * 获取完整显示名称(含颜色)
 * @returns {string}
 */
USER.prototype.long_name = function () {
    if (!this.color_name) {
        var cc = this.get_level_color();
        var str = [];
        if (cc) {
            str.push("<");
            str.push(cc);
            str.push(">");
        }
        if (this.title) {
            str.push(this.title);
            str.push(" ");
        }
        if (!this.title || this.level > 0) {
            str.push(LEVELS_TITLES[this.level]);
            str.push(" ");
        }
        str.push(this.name);
        if (cc) {
            str.push("</");
            str.push(cc);
            str.push(">");
        }
        this.color_name = str.join("");
        this.commands_json = null;
    }
    return this.color_name + this.get_state();
}


/** 初始化用户任务 */
USER.prototype.init_tasks = function () {
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        var task = WORLD.TASKS[i];
        task.on_start && task.on_start(this);
    }
}

/**
 * 查询精力值
 * @returns {number}
 */
USER.prototype.query_jingli = function () {
    var expend = this.query_temp("ex_jl") || 0;
    return 200 - expend + (this.query_temp("add_jl") || 0);
}

/** @type {number[]} 各等级精力上限 */
const jclimits = [1000, 2000, 3000, 5000, 7000, 10000, 15000];

/**
 * 查询当前等级的精力上限
 * @returns {number}
 */
USER.prototype.query_jclimit = function () {
    return jclimits[this.level] || 1000;
}


/**
 * 添加物品到背包
 * @param {OBJ|string} obj - 物品对象或物品路径
 * @param {number} [count] - 数量
 * @returns {OBJ|undefined}
 */
USER.prototype.add_obj = function (obj, count) {
    if (!obj) return;
    if (typeof obj == "string") {
        obj = OBJ.clone_to(obj, this, count);
        if (!obj) return;
    } else {
        obj = this.push_item(obj);
    }

    this.items_changed(obj);

    obj.notify_action(this, true);
    return obj;
}

/**
 * 从背包移除物品
 * @param {OBJ|string} obj - 物品对象或ID
 * @param {number} [count] - 数量
 * @returns {OBJ|undefined}
 */
USER.prototype.remove_obj = function (obj, count) {
    if (typeof obj == "string") {
        obj = this.find_obj(obj);
    }
    if (!obj) return;
    count = count || obj.count || 1;
    var newobj = this.remove_item(obj, count);
    if (newobj == obj) {

        obj.notify_action(this, false);
    }
    this.items_changed(obj, count);
    return newobj;
}

/**
 * 物品变更通知客户端
 * @param {OBJ} item - 物品
 * @param {number} [drop_count] - 减少数量
 */
USER.prototype.items_changed = function (item, drop_count) {

    if (drop_count) {
        this.send('{type:"dialog",dialog:"pack",id:"' + item.id + '",remove:' + drop_count + ',money:' + this.money + '}');
    } else {
        if (item.is_money) {
            return this.send('{type:"dialog",dialog:"pack",money:' + this.money + '}');
        }
        var str = ['{type:"dialog",dialog:"pack",'];


        str.push('name:"');
        str.push(item.color_name);
        str.push('",id:"');
        str.push(item.id);
        str.push('",count:');
        str.push(item.count);
        str.push(',grade:');
        str.push(item.grade);
        str.push(',unit:"');
        str.push(item.unit);
        str.push('"');
        if (item.is_equipment) {
            str.push(',can_eq:1');
        }
        if (item.on_use) {
            str.push(',can_use:1');
        }
        if (item.on_study) {
            str.push(',can_study:1');
        }
        if (item.on_open) {
            str.push(',can_open:1');
        }
        if (item.combine_count) {
            str.push(',can_combine:' + item.combine_count);
        }
        str.push(',value:');
        str.push(item.transable ? item.value : 0);
        str.push(",money:");
        str.push(this.money);
        str.push('}');
        this.send(str.join(""));
    }
}

/** 通知客户端技能变更 */
USER.prototype.on_skillchanged = function () {
    var str = ["{type:\"perform\",skills:["];
    if (this.skills) {
        var bases = ["", "force", "unarmed", "dodge", "parry", "throwing"];
        var weapon = this.query_weapon_type(), base_type = null;
        if (weapon != WEAPON_TYPE.NONE) bases[0] = weapon;
        for (var i = 0; i < bases.length; i++) {
            base_type = bases[i];
            if (!base_type) continue;
            var base_skill = this.skills[base_type];
            if (base_skill) {
                var sp_skill = SKILL.get(base_skill.enable_skill || base_type), pfmitem = null;
                if (sp_skill && sp_skill.pfm) {
                    let sk_level = this.query_skill(base_skill.enable_skill || base_type, 0);
                    for (var p in sp_skill.pfm) {
                        pfmitem = sp_skill.pfm[p];
                        if (pfmitem.check && !pfmitem.check(this,
                            sk_level, base_type)) continue;
                        if (pfmitem.enable_skill && pfmitem.enable_skill != base_type) continue;
                        if (str.length > 1) str.push(",");
                        str.push("{id:\"");
                        str.push(base_type + "." + p);
                        str.push("\",name:\"");
                        str.push(pfmitem.query_name(this, base_type));
                        str.push("\"");
                        if (pfmitem.distime) {
                            str.push(",distime:");
                            str.push(pfmitem.query_distime(this));
                        }
                        str.push("}");
                    }
                }
                pfmitem = this.query_ref_skill(this.skills[base_skill.enable_skill]);
                if (pfmitem && pfmitem.enable_skill && pfmitem.enable_skill == bases[i]) {
                    if (str.length > 1) str.push(",");
                    str.push("{id:\"");
                    str.push(bases[i] + ".ref");
                    str.push("\",name:\"");
                    str.push(pfmitem.query_name(this, base_type));
                    str.push("\"");
                    if (pfmitem.distime) {
                        str.push(",distime:");
                        str.push(pfmitem.query_distime(this, this.query_skill(base_skill.enable_skill), true));
                    }
                    str.push("}");
                }
            }
        }
    }
    str.push("]");
    str.push("}");
    this.send(str.join(""));
}

/** 回到自己的家 */
USER.prototype.go_home = function () {
    let my_room = this.query_home();
    this.moveto(my_room, this.name + "向里面走去。");
}

/**
 * 查询家园房间
 * @param {string} [rm_name] - 房间名
 * @returns {ROOM|null}
 */
USER.prototype.query_home = function (rm_name) {
    let home = this.query_temp("home");
    if (!home) return null;
    if (!rm_name) rm_name = home == 1 ? "home/danjian" : "home/yuanzi";
    let rm = ROOM.Get(rm_name);
    let my_room = rm.query_copy2(this);
    if (!my_room) {
        my_room = rm.create_copy2(this);
    }
    return my_room;
}

/**
 * 增加积分
 * @param {number} val
 */
USER.prototype.add_score = function (val) {
    if (!val) return;
    this.score += val;
    WORLD.STATS.updateScore(this);
}

/**
 * 增加金钱
 * @param {number} val
 * @returns {boolean} 是否成功
 */
USER.prototype.add_money = function (val) {
    let money = parseInt(this.money + val);
    if (!(money >= 0)) return false;
    this.money = money;
    return true;
}

/**
 * 增加元宝
 * @param {number} count
 * @param {string} desc - 描述
 */
USER.prototype.add_cash = function (count, desc) {
    if (!(count > 0 || count < 0)) return;
    this.cash_money += count;
    WORLD.log(this, count, desc);
    if (count >= 0) {
        this.notify("<hio>你获得了" + count + "元宝。</hio>");
    }
    this.send(`{"type":"dialog","dialog":"shop","money":[${this.money},${this.cash_money}]}`);

}

/**
 * 查询元宝数量
 * @param {boolean} [is_cash]
 * @returns {number}
 */
USER.prototype.query_cash = function (is_cash) {
    return this.cash_money;
}

/**
 * 是否可以跟随此NPC
 * @param {NPC} npc
 * @returns {boolean}
 */
USER.prototype.can_follow = function (npc) {
    if (!this.follower) this.follower = [];
    var max = this.query_temp("max_follower") || 3;
    if (this.follower.length >= max) return false;
    for (var i = 0; i < this.follower.length; i++) {
        if (this.follower[i].path == npc.path) {
            return false;
        }
    }
    return true;
}

/**
 * 添加随从
 * @param {NPC} npc
 * @returns {boolean} 是否成功
 */
USER.prototype.add_follower = function (npc) {
    if (!this.can_follow(npc)) return false;
    var item = {
        path: npc.path,
        id: npc.id
    };
    this.follower.push(item);
    FOLLOWER.INIT(this, item);
    return true;
}

/**
 * 清除家园和随从
 * @param {boolean} [clear_follower=true]
 */
USER.prototype.clear_home = function (clear_follower = true) {
    var home = ROOM.Get("home/yuanzi");
    if (home) {
        home = home.query_copy(this.id)
        if (home)
            home.clear_copy(this);
    }
    if (clear_follower)
        FOLLOWER.CLEAR(this);
    else
        FOLLOWER.RESET(this);
}

/**
 * 清除技能冷却时间
 * @param {string} [pfmid] - 指定绝招ID，不传则清除全部
 */
USER.prototype.clear_distime = function (pfmid) {
    if (!this.temp) return;
    if (pfmid) {
        this.temp["pfm/" + pfmid] = null;
        this.send('{type:"clearDistime",id:"' + pfmid + '"}');
    } else {
        for (var key in this.temp) {
            if (key.startsWith("pfm/")) {
                this.temp[key] = null;
            }
        }
        this.send('{type:"clearDistime"}');
    }
}

/** @type {string[]} 死亡消息模板 */
var DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];

/**
 * 添加战斗属性(临时)
 * @param {string} name - 属性名
 * @param {number} val - 属性值
 */
USER.prototype.add_combat_prop = function (name, val) {
    this.add_prop(name, val);
    if (!this.combat_props) this.combat_props = [];
    this.combat_props.push([name, val]);

}


/** 清除所有战斗临时属性 */
USER.prototype.clear_combat_prop = function (name, val) {
    if (this.combat_props) {
        for (let i = 0; i < this.combat_props.length; i++) {
            this.add_prop(this.combat_props[i][0], -this.combat_props[i][1]);
        }
        this.combat_props = null;
        this.recount();
        this.notify_hp();
    }
}
