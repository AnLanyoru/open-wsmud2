/**
 * CHARACTER 生物基类
 */
import { ITEM } from "../item.js";
import { OBJ } from "../item/obj.js";
import { SKILL } from "../skill/skill.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util/util.js";
import { WEAPON_TYPE, BASE_SKILLS, EQUIP_TYPE } from "../const.js";
/*global CHARACTER ROOM ITEM*/

export class CHARACTER extends ITEM {

    /**
     * @param {CHARACTER} obj - 要初始化的角色实例
     */
    static __initInstance(obj) {
        // 所有默认值已迁移至class field声明
    }

    // ============ 核心标识属性 ============

    /** @type {string} 角色名称 */
    name = "生物";
    /** @type {string} 角色称呼(第三人称) */
    title;
    /** @type {string} 带颜色的名称缓存 */
    color_name;
    /** @type {number} 性别 0=女 1=男 */
    gender = 1;
    /** @type {number} 年龄 */
    age = 20;
    /** @type {number} 等级 */
    level = 0;
    /** @type {string} 角色描述 */
    desc;

    // ============ 战斗属性 ============

    /** @type {number} 当前气血 */
    hp = 100;
    /** @type {number} 最大气血 */
    max_hp = 100;
    /** @type {number} 当前内力 */
    mp = 100;
    /** @type {number} 最大内力 */
    max_mp = 100;
    /** @type {number} 臂力 */
    str = 20;
    /** @type {number} 根骨 */
    con = 20;
    /** @type {number} 身法 */
    dex = 20;
    /** @type {number} 悟性 */
    int = 20;
    /** @type {number} 容貌 */
    per = 20;
    /** @type {number} 经验值 */
    exp = 0;
    /** @type {number} 潜能值 */
    pot = 0;
    /** @type {number} 阅历积分 */
    score = 0;

    // ============ 身份标识 ============

    /** @type {boolean} 是否为玩家 */
    is_player = false;
    /** @type {number} 用户权限等级 0=普通 6=管理员 */
    user_level = 0;

    // ============ 环境与交互 ============

    /** @type {ROOM|null} 当前所在房间 */
    environment = null;
    /** @type {Object<string, *>|null} 当前活动状态 */
    state = null;
    /** @type {Function|null} 等待用户输入的回调 */
    wait_input = null;
    /** @type {boolean} 是否静默消息 */
    no_message = false;

    // ============ 技能与装备(由mixin动态填充) ============

    /** @type {Object<string, {level: number, exp: number, enable_skill: number}>|null} 技能映射 */
    skills = null;
    /** @type {Array<*>|null} buff/debuff状态列表 */
    status = null;
    /** @type {EQUIPMENT[]|null} 装备列表(按EQUIP_TYPE索引) */
    equipment = null;
    /** @type {Object<string, number>|null} 属性加成映射 */
    prop = null;
    /** @type {Object<string, *>|null} 临时数据 */
    temp = null;
    /** @type {Object<string, [string, number]>|null} 战斗属性修饰 */
    combat_props = null;

    // ============ 战斗系统属性 ============

    /** @type {number} 战斗类型 0=无 1=切磋 2=生死 */
    fight_type = 0;
    /** @type {CHARACTER[]|null} 敌人列表 */
    enemy = null;
    /** @type {SKILL|null} 当前攻击技能 */
    attack_skill = null;
    /** @type {SKILL|null} 空手技能 */
    noweapon_skill = null;
    /** @type {SKILL|null} 闪避技能 */
    dodge_skill = null;
    /** @type {SKILL|null} 招架技能 */
    parry_skill = null;
    /** @type {SKILL|null} 内功技能 */
    force_skill = null;
    /** @type {Array|null} 自动技能缓存 */
    auto_skills = null;
    /** @type {ITEM|null} 当前攻击部位 */
    attack_part = null;
    /** @type {number} 忙乱状态倒计时 */
    is_busy = 0;
    /** @type {number} 昏迷状态倒计时 */
    is_faint = 0;
    /** @type {number} 免疫控制倒计时 */
    ig_control = 0;
    /** @type {number} 闪避状态倒计时 */
    is_miss = 0;
    /** @type {number} 鲁莽状态倒计时 */
    is_rash = 0;
    /** @type {number} 分身状态倒计时 */
    is_shadow = 0;
    /** @type {Function|null} 攻击处理器(定时器句柄) */
    attack_handler = null;

    // ============ 社交与移动属性 ============

    /** @type {CHARACTER|null} 跟随目标 */
    follow_target = null;
    /** @type {CHARACTER[]|null} 跟随者列表 */
    follow_targets = null;
    /** @type {Array|null} 队伍引用 */
    team = null;
    /** @type {number} 武器切换冷却时间戳 */
    release_time = 0;
    /** @type {Array|null} 掉落列表 */
    drop_list = null;

    // ============ 回调函数(由资源文件设置) ============

    /** @type {Function|null} 对象创建回调 */
    on_create = null;
    /** @type {Function|null} 对象克隆回调 */
    on_clone = null;
    /** @type {Function|null} 死亡回调 */
    on_die = null;
    /** @type {Function|null} 复活回调 */
    on_relive = null;
    /** @type {Function|null} 心跳回调 */
    on_heart_beat = null;
    /** @type {Function|null} 死亡后回调(仅NPC) */
    on_died = null;

    // ============ 由mixin/extends提供的多态方法(见文件末尾writable定义) ============

    constructor() {
        super();
        CHARACTER.__initInstance(this);
    }

    /**
     * 发送消息给自身
     * @param {string} [msg]
     */
    send() {

    }

    /**
     * 通知消息(考虑状态)
     * @param {string} [msg]
     */
    notify() {

    }

    /**
     * 发送命令列表
     */
    send_commands() {

    }

    /**
     * 操作失败通知
     * @param {string} [text]
     * @returns {boolean} false
     */
    notify_fail() {
        return false;
    }

    /**
     * 是否存活
     * @returns {boolean}
     */
    is_living() {
        return this.hp > 0;
    }

    /**
     * 是否在指定路径的房间
     * @param {string} path - 房间路径
     * @returns {boolean}
     */
    is_in(path) {
        if (!this.environment) return false;
        return this.environment.path === path;
    }

    /**
     * 是否和目标在同一房间
     * @param {CHARACTER} obj
     * @returns {boolean}
     */
    is_here(obj) {
        if (!this.environment || !obj.environment) return false;
        return this.environment === obj.environment;
    }

    /**
     * 根据ID查找物品
     * @param {string} oid - 物品ID
     * @param {ITEM} [parent] - 父容器
     * @returns {ITEM|undefined}
     */
    find_obj(oid, parent) {
        let items = this.items;
        if (parent) items = parent.items;
        return this.find_obj_byid(items, oid);
    }

    /**
     * 向房间内所有人发送消息
     * @param {string} msg - 消息内容
     * @param {boolean} [include_me] - 是否包含自己
     */
    send_message(msg, include_me) {
        if (!msg || !this.environment) return;
        const list = this.environment.items;
        for (let i = 0; i < list.length; i++) {
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
    send_combat(text, target) {
        if (!this.environment || !text) return;
        const list = this.environment.items;
        let th_vision, item;
        for (let i = 0; i < list.length; i++) {
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
    send_room(text, target, excludeself) {
        if (!this.environment || !text) return;
        const list = this.environment.items;
        let th_vision;
        for (let i = 0; i < list.length; i++) {
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
    query_setting(name) {
        return false;
    }

    /**
     * 执行命令字符串(解析并分发)
     * @param {string} req - 用户输入的命令字符串
     */
    command(req) {

        if (this.wait_input) { //如果用户等待输入
            this.wait_input.apply(this, [this, req]);
            return;
        }
        let cmd = null, pars = null, start = 0, i = 0;
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
    do_command(cmdName, str) {

        let cmd = WORLD.COMMANDS[cmdName];
        let pars;
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
    do_item_action(item, cmd, pars) {
        if (!item || !item.actions) return;
        const cmdItem = item.actions[cmd];
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
    check_command(cmd) {
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
    create(path, par) {
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
    update(path, par) {
        this.create(path, par);
    }

    /**
     * 克隆实例到实际场景中
     */
    clone() {
        if (this.temp) this.temp = Object.create(this.temp);
        if (this.prop) this.prop = Object.create(this.prop);
        if (this.equipment) {
            const eqs = [];
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (item) {
                    eqs[i] = OBJ.CREATE(item.path);
                }
            }
            this.equipment = eqs;
        }
        if (this.items) {
            const items = [];
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
    init() {
        if (this.equipment) {
            const groups = {};
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (item) {
                    item.change_prop(this, true);
                    item.on_eq && item.on_eq(this);
                    if (item && item.group_name) {
                        groups[item.group_name] = (groups[item.group_name] || 0) + 1;
                        const prop = item.group_prop(groups[item.group_name]);
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
                const base_skill = SKILL.get(item);
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
    static EXP_LIMIT = [300000, 3000000, 20000000];

    /**
     * 增加经验/潜能/金钱
     * @param {number} [exp] - 经验值
     * @param {number} [pot] - 潜能值
     * @param {number} [money] - 金钱
     */
    add_exp(exp, pot, money) {
        if (exp) {
            exp += this.query_temp("exp_up", 0);

        }
        if (pot) {
            pot += this.query_temp("pot_up", 0);

        }
        const str = ["<hig>你获得了"];
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
    add_money(val) {
        this.money += val;

    }

    /** 检查并更新套装属性 */
    check_groupeq() {
        const eqs = {};
        for (let i = 0; i < this.equipment.length; i++) {
            const item = this.equipment[i];
            if (item && item.group_name) {
                eqs[item.group_name] = (eqs[item.group_name] || 0) + 1;
                const prop = item.group_prop(eqs[item.group_name]);
                if (prop) {
                    this.change_prop(prop, true);
                }
            }
        }
    }
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
    const str = [];
    let start = 0, i;
    for (i = 0; i < text.length; i++) {
        if (text[i] === "$") {
            start < i && str.push(text.substring(start, i));
            const ch = text[++i];
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

// ============ Mixin多态方法桩(writable, 供Object.assign覆写) ============
// class语法定义的方法为non-writable, 会被mixin的Object.assign抛TypeError
// 因此用defineProperties定义writable桩供IDE类型提示
Object.defineProperties(CHARACTER.prototype, {
    /** @type {(name: string, val?: number, temp?: number) => number} 查询临时属性(chara_prop mixin) */
    query_temp: { value: function (name, val, temp) { return 0; }, writable: true, configurable: true },
    /** @type {(name: string, val: number, append?: boolean) => void} 修改属性加成(chara_prop mixin) */
    change_prop: { value: function (name, val, append) { }, writable: true, configurable: true },
    /** @type {(id: string) => {level: number, exp: number, enable_skill: number}|null} 查询技能(chara_skill mixin) */
    query_skill: { value: function (id) { return null; }, writable: true, configurable: true },
    /** @type {() => void} 初始化技能(chara_skill mixin) */
    init_skill: { value: function () { }, writable: true, configurable: true },
    /** @type {() => void} 重新计算战斗属性(world/extends/char/combat) */
    recount: { value: function () { }, writable: true, configurable: true },
    /** @type {() => string} 第三人称称呼(chara_comm mixin) */
    call3: { value: function () { return this.name; }, writable: true, configurable: true },
    /** @type {() => string} 武器名称(chara_equip mixin) */
    weapon_name: { value: function () { return ""; }, writable: true, configurable: true },
    /** @type {() => string} 暗器名称(chara_equip mixin) */
    throwing_name: { value: function () { return ""; }, writable: true, configurable: true },
});

globalThis.CHARACTER = CHARACTER;
