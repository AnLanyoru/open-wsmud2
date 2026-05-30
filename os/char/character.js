/**
 * CHARACTER 生物基类
 */
import { ITEM } from "../item.js";
import { OBJ } from "../item/obj.js";
import { SKILL } from "../skill/skill.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util/util.js";
import { WEAPON_TYPE, BASE_SKILLS, EQUIP_TYPE, SKILL_TYPES } from "../const.js";
import { EQUIPMENT } from "../item/equipment.js";
/** @typedef {import("../room/room.js").ROOM} ROOM */
/*global CHARACTER ROOM ITEM*/

export class CHARACTER extends ITEM {

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
    /** @type {number} 内力上限(独立于max_mp, 由内功技能加成) — dazuo/makelove使用, USER&FOLLOWER持久化 */
    limit_mp = 0;
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
    /** @type {number} 福缘/运气 — USER&FOLLOWER持久化, 影响掉落/暴击等 */
    kar = 20;
    /** @type {number} 经验值 */
    exp = 0;
    /** @type {number} 潜能值 */
    pot = 0;
    /** @type {number} 阅历积分 */
    score = 0;

    // ============ 身份标识 ============

    /** @type {number} 用户权限等级 0=普通 6=管理员 */
    user_level = 0;
    /** @type {FAMILY} 所属门派 — call/is_team/send_fam 等5个基类方法使用 */
    family = null;
    /** @type {boolean} 是否禁止战斗 — USER和NPC设置, 多处检查 */
    no_fight = false;

    // ============ 环境与交互 ============

    /** @type {ROOM|null} 当前所在房间 */
    environment = null;
    /** @type {Object<string, *>|null} 当前活动状态 */
    state = null;
    /** @type {((me: CHARACTER, req: string) => void)|null} 等待用户输入的回调 — character.js:319 传(this, req) */
    wait_input = null;

    // ============ 技能与装备 ============

    /** @type {Object<string, {level: number, exp: number, enable_skill: string|null}>|null} 技能映射 */
    skills = null;
    /** @type {Array<*>|null} buff/debuff状态列表 */
    status = null;
    /** @type {EQUIPMENT[]|null} 装备列表(按EQUIP_TYPE索引) */
    equipment = null;
    /** @type {Object<string, number>|null} 属性加成映射 */
    prop = null;
    /** @type {Object<string, *>|null} 临时数据 */
    temp = null;
    /** @type {[string, number][]|null} 战斗属性修饰 — add_combat_prop推入[name,val]元组, clear时遍历索引回退 */
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
    /** @type {boolean} 自动释放绝招 — NPC/MONSTER/FOLLOWER默认true */
    auto_pfm = false;
    /** @type {Object<string, number>|null} 伤害记录(按玩家ID) — notify_hp/end_fight使用 */
    damages = null;
    /** @type {boolean} 是否记录伤害统计 — end_fight检查 */
    record_damage = false;
    /** @type {number} 攻击速度(ms) — recount计算, do_escape/begin_attack使用 */
    gjsd = 0;
    /** @type {number} 闪避值 — recount计算, do_escape使用 */
    ds = 0;
    /** @type {number} 攻击力 — recount计算 */
    gj = 0;
    /** @type {number} 防御力 — recount计算 */
    fy = 0;
    /** @type {number} 命中值 — recount计算 */
    mz = 0;
    /** @type {number} 招架值 — recount计算 */
    zj = 0;
    /** @type {number} 暴击率(%) — recount计算 */
    bj = 0;

    // ============ 社交与移动属性 ============

    /** @type {CHARACTER|null} 跟随目标 */
    follow_target = null;
    /** @type {CHARACTER[]|null} 跟随者列表 */
    follow_targets = null;
    /** @type {CHARACTER[]|null} 队伍引用 */
    team = null;
    /** @type {number} 武器切换冷却时间戳 */
    release_time = 0;
    /** @type {Array|null} 掉落列表 */
    drop_list = null;
    /** @type {string|null} 主人ID — NPC/FOLLOWER标识所属玩家 */
    master = null;
    /** @type {ROOM|null} 死亡复活房间 — NPC/MONSTER使用 */
    die_room = null;
    /** @type {string[]|null} 闲聊消息列表 — NPC/MONSTER/FOLLOWER使用 */
    chat_msg = null;

    // ============ 回调属性 ============

    /** @type {((path?: string, par?: string) => void)|null} 对象创建回调 */
    on_create;
    /** @type {(() => void)|null} 对象克隆回调 */
    on_clone;
    /** @type {((killer: CHARACTER) => (boolean|void))|null} 死亡回调，返回false阻止默认死亡处理 */
    on_die;
    /** @type {((me: CHARACTER) => void)|null} 团队退出回调 */
    on_teamout;
    /** @type {(() => void)|null} 复活回调 */
    on_relive;
    /** @type {((dt: number) => void)|null} 心跳回调 */
    on_heart_beat;
    /** @type {((killer?: CHARACTER, corpse?: object) => void)|null} 死亡后回调 */
    on_died;
    /** @type {((target: CHARACTER, win: boolean) => void)|null} 战斗结束回调 */
    on_fight_over;
    /** @type {(() => void)|null} 技能变更回调 */
    on_skillchanged;

    constructor() {
        super();
    }

    // ============ 基础方法 ============

    /**
     * 发送消息给自身(不考虑状态)
     * @param {string} msg — 所有调用点均传入字符串, USER覆写用socket.send
     * @returns {void}
     */
    send(msg) { return undefined; }

    /**
     * 发送命令列表(客户端交互菜单) — USER覆写用arguments处理变长(命令名, 显示名, ...)偶数对
     * @returns {void}
     */
    send_commands() { return undefined; }

    /**
     * 操作失败通知 — 发送错误消息并返回false用于return链
     * @param {string} text — 错误提示文本, 实际调用均传入字符串
     * @returns {boolean} 始终返回false, 调用点用 return this.notify_fail(...) 中断执行
     */
    notify_fail(text) {
        this.send(text);
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
     * 角色死亡处理 — 所有子类覆写, end_attack/combat等调用
     * @param {CHARACTER} [killer] - 击杀者
     * @returns {boolean|void} 返回false阻止死亡(如on_die回调拒绝)
     */
    die(killer) { return undefined; }

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
     * @param {ITEM} [target] - 消息的主要填充$对象
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
     * 查询用户设置 — USER/FOLLOWER覆写返回number, 基类返回false
     * @param {string} name - 设置项名称
     * @returns {boolean|number} 基类返回false(boolean), 子类返回0或数值
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
                    eqs[i] = /** @type {EQUIPMENT} */ (/** @type {unknown} */ (OBJ.CREATE(item.path)));
                }
            }
            this.equipment = /** @type {EQUIPMENT[]} */ (/** @type {unknown} */ (eqs));
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

    // ============ 属性/临时数据系统 ============

    /**
     * 增加属性
     * @param {string} p - 属性名
     * @param {number} v - 增加值
     */
    add_prop(p, v) {
        if (!p) return;
        if (!this.prop) {
            this.prop = {};
        }
        const v1 = this.prop[p] || 0;

        this.prop[p] = v1 + v;
    }

    /** 清除所有属性 */
    clear_prop() {
        this.prop = {};
    }

    /**
     * 查询属性加值
     * @param {string} name - 属性名
     * @returns {number}
     */
    query_prop(name) {
        if (this.prop)
            return this.prop[name] || 0;
        return 0;
    }

    /**
     * 查询内功加成比例
     * @returns {number}
     */
    query_force_rad() {
        if (this.force_skill && this.force_skill.force_rad)
            return this.force_skill.force_rad || 0.1;
        return 0.1;
    }

    /**
     * 增加内力上限
     * @param {number} count
     */
    add_maxmp(count) {
        this.max_mp += count;
        this.recount();
        this.notify("<hig>你增加了" + count + "点内力。</hig>");
    }

    /**
     * 批量变更属性
     * @param {Object<string, number|Object>} prop - 属性对象
     * @param {boolean} isadd - true增加 false移除
     */
    change_prop(prop, isadd) {
        if (!prop) return;
        for (let item in prop) {
            switch (item) {
                case "desc":
                    break;
                case "skill":
                    const sks = prop[item];
                    for (let sk in sks) {
                        let lv = this.query_skill(sk, 0);
                        if (!lv) {
                            this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);
                            continue;
                        }
                        const sk_base = SKILL.get(sk);
                        if (!sk_base) continue;
                        sk_base.release_prop(this, lv);

                        this.add_prop(sk, isadd ? sks[sk] : -sks[sk]);

                        lv = this.query_skill(sk, 0);

                        sk_base.attach_prop(this, lv);
                        if (this.is_player) {
                            this.notify('{type:"dialog",dialog:"skills",id:"' + sk + '",level:' + lv + '}');
                        }

                    }
                    break;
                default:
                    this.add_prop(item, isadd ? prop[item] : -prop[item]);
                    break;
            }
        }
    }

    /**
     * 增加副本分数
     * @param {number} v - 分数值
     * @param {number} [max] - 最大分数
     */
    add_fbscore(v, max) {
        const fb = this.environment.query_fb_first(this.query_teamid());
        if (!fb) return;
        fb.score = (fb.score || 0) + v;
        if (max > 0 && fb.score > max) fb.score = max;
    }

    /**
     * 查询副本分数
     * @param {*} [v]
     * @returns {number}
     */
    query_fbscore(v) {
        const first_room = this.environment.query_fb_first(this.query_teamid());
        if (!first_room) return 0;
        return first_room.score || 0;
    }

    /**
     * 增加积分 — 仅USER覆写, NPC的score通过add_fbscore独立管理
     * @param {number} val
     * @returns {void}
     */
    add_score(val) { return undefined; }

    /**
     * 添加战斗临时属性
     * @param {string} name - 属性名
     * @param {number} val - 属性值
     */
    add_combat_prop(name, val) {
        this.add_prop(name, val);
        if (!this.combat_props) this.combat_props = [];
        this.combat_props.push([name, val]);
        if (name === 'max_hp') {
            this.max_hp += val;
        }
    }

    /**
     * 清除战斗临时属性
     * @param {string} [name]
     * @param {number} [val]
     */
    clear_combat_prop(name, val) {
        if (this.combat_props) {
            for (let i = 0; i < this.combat_props.length; i++) {
                this.add_prop(this.combat_props[i][0], -this.combat_props[i][1]);
                if (this.combat_props[i][0] === 'max_hp') {
                    this.max_hp -= this.combat_props[i][1];
                    this.notify_hp();
                }
            }
            this.combat_props = null;
            this.recount();
        }
    }

    // ============ 技能系统 ============

    /**
     * 查询技能等级(含属性加成)
     * @param {string} name - 技能ID
     * @param {number} [def] - 默认值
     * @returns {number}
     */
    query_skill(name, def) {
        if (!this.skills || !this.skills[name]) return def || 0;
        return this.skills[name].level + this.query_prop(name);
    }

    /**
     * 批量设置技能(NPC初始化用)
     * @param {...[string, number, (string|string[])?]} arguments - [技能ID, 等级, 启用基本技能]
     */
    skill_map() {
        this.skills = this.skills || {};
        for (let i = 0; i < arguments.length; i++) {
            const item = arguments[i];
            if (!item) continue;
            const skill_base = SKILL.get(item[0]);
            if (!skill_base) {
                console.log(item[0] + " not exits")
                continue;
            }
            const skill = {
                level: item[1] || 1,
                exp: 0,
                enable_skill: null
            };
            this.skills[skill_base.id] = skill;
            if (item[2]) {
                let enables = item[2];
                if (typeof enables == "string") enables = [enables];
                for (let j = 0; j < enables.length; j++) {

                    skill[enables[j]] = true;
                    this.skills[enables[j]].enable_skill = item[0];
                }
            }
        }
    }

    /**
     * 移除技能
     * @param {string} skillid - 技能ID
     * @returns {boolean|undefined}
     */
    remove_skill(skillid) {
        const skill = this.skills[skillid];
        if (!skill) return;
        const baseskill = SKILL.get(skillid);
        if (!baseskill) return false;

        if (baseskill.type == SKILL_TYPES.BASE) {
            if (skill.enable_skill) {
                const old_skill = SKILL.get(skill.enable_skill);
                if (!old_skill || !this.skills[skill.enable_skill]) {
                    return false;
                }
                old_skill.disenable(this, skillid);
                this.skills[skill.enable_skill][skillid] = false;
            }
        } else {
            for (let key in this.skills) {
                if (this.skills[key].enable_skill == skillid) {

                    this.skills[key].enable_skill = null;
                }
            }
        }
        baseskill.release_prop(this, this.query_skill(skillid));
        delete this.skills[skillid];
        this.init_skill();
        this.recount();
        this.add_score(-baseskill.query_score(skill.level, this));
        baseskill.on_remove && baseskill.on_remove(this);
        return true;
    }

    /**
     * 设置技能等级
     * @param {string} skid - 技能ID
     * @param {number} level - 等级
     */
    set_skill(skid, level) {
        if (!this.skills) this.skills = {};
        let item = this.skills[skid];
        const skill_base = SKILL.get(skid);
        if (!skill_base) return;
        if (!item) {
            item = {
                level: level,
                exp: 0,
                enable_skill: null
            };
            this.skills[skid] = item;
            skill_base.attach_prop(this, level);
        } else {
            skill_base.release_prop(this, this.query_skill(skid));
            item.level = level;
            skill_base.attach_prop(this, this.query_skill(skid));
        }
        this.init_skill();
        this.recount();
    }

    /**
     * 查询当前技能等级上限
     * @returns {number}
     */
    skill_limit() {
        if (this.exp < 100) return 10;
        switch (this.level) {
            case 1: return Math.round(Math.pow(this.exp * 20, 1 / 3));
            case 2: return Math.round(Math.pow(this.exp * 30, 1 / 3));
            case 3: return Math.round(Math.pow(this.exp * 40, 1 / 3));
            case 4: return Math.round(Math.pow(this.exp * 50, 1 / 3));
            case 5: return Math.round(Math.pow(this.exp * 60, 1 / 3));
            case 6: return Math.round(Math.pow(this.exp * 60, 1 / 3));
            default:
                return Math.round(Math.pow(this.exp * 10, 1 / 3));
        }
    }

    /**
     * 查询技能引用绝招
     * @param {*} skill - 技能对象
     * @returns {PERFORM|undefined}
     */
    query_ref_skill(skill) {
        if (!skill || !skill.ref) return;
        const refs = skill.ref.split("/");
        const sp_skill = SKILL.get(refs[0]);
        if (sp_skill) {
            return sp_skill.get_pfm(refs[1]);
        }
    }

    /**
     * 判断某技能是否装备到指定基本技能
     * @param {string} skid - 技能ID
     * @param {string} type - 基本技能类型
     * @returns {boolean|undefined}
     */
    is_enable_skill(skid, type) {
        if (!this.skills) return;
        const item = this.skills[skid];
        if (!item) return;
        return item[type];
    }

    /**
     * 装备技能到基本技能
     * @param {string} base - 基本技能ID
     * @param {string|null} skill - 特殊技能ID, null为取消装备
     * @returns {boolean}
     */
    enable_skill(base, skill) {
        if (!this.skills) return;
        const baseskill = this.skills[base];
        if (!baseskill) return;
        if (baseskill.enable_skill) {
            let old_skill = this.skills[baseskill.enable_skill];
            if (!old_skill) return;
            old_skill[base] = false;

            old_skill = SKILL.get(baseskill.enable_skill);
            if (old_skill) {
                old_skill.disenable(this, base);
            }
        }
        if (skill) {
            const sp_skill = this.skills[skill];

            if (baseskill && sp_skill) {
                const sp_skill_base = SKILL.get(skill);
                if (!sp_skill_base || sp_skill_base.enable(this, base) !== true)
                    return false;
                baseskill.enable_skill = skill;
                sp_skill[base] = true;
            }
        } else {
            baseskill.enable_skill = null;
        }
        this.init_skill();
        this.recount();

        return true;
    }

    /** 初始化当前使用的战斗技能 */
    init_skill() {
        this.attack_skill = this.query_used_skill(this.query_weapon_type());
        this.noweapon_skill = this.query_used_skill(WEAPON_TYPE.NONE);
        this.dodge_skill = this.query_used_skill(BASE_SKILLS.DODGE);
        this.parry_skill = this.query_used_skill(BASE_SKILLS.PARRY);
        this.force_skill = this.query_used_skill(BASE_SKILLS.FORCE);
        this.on_skillchanged && this.on_skillchanged();
        this.auto_skills = null;
    }

    /**
     * 查询当前使用的技能(含装备选择)
     * @param {string} skname - 基本技能名
     * @returns {SKILL}
     */
    query_used_skill(skname) {
        if (!this.skills) {
            return WORLD.DEFAULT_SKILLS[skname];
        }
        const skill = this.skills[skname];
        if (skill) {

            const skill_base = SKILL.get(skill.enable_skill || skname);
            if (!skill_base) skill.enable_skill = null;
            else return skill_base;
        }
        return WORLD.DEFAULT_SKILLS[skname];
    }

    /**
     * 查询状态叠加层数
     * @param {string} sid - 状态ID
     * @returns {number}
     */
    query_status(sid) {
        if (!this.status) return 0;
        for (let i = 0; i < this.status.length; i++) {
            if (this.status[i].id == sid) {
                return this.status[i].count;
            }
        }
        return 0;
    }

    /**
     * 添加状态/效果 (Buff/Debuff 系统核心)
     *
     * override: 0=不可叠加(幂等) 1=叠加层数 2=刷新持续时间
     * @param {StatusItem} buff - 状态定义
     * @param {CHARACTER} [from] - 来源角色
     * @returns {boolean|undefined}
     */
    add_status(buff, from) {
        if (this.hp <= 0) return false;
        if (!this.status) this.status = [];
        const sid = buff.id;
        buff.override = buff.override || 0;
        buff.count = buff.count || 1;
        buff.max_count = buff.max_count || 10;

        buff.start_time = Date.now();
        if (buff.on_interval) {
            buff.over_count = buff.over_count || 0;
        }
        if (this.ig_control && !buff.no_diff) {
            if (buff.is_busy || buff.is_faint || buff.is_miss || buff.is_rash) {
                return false;
            }
        }
        if (buff.downside && buff.duration && !buff.no_diff) {
            buff.duration = Math.round(buff.duration * (100 - this.query_prop("diff_downside_per")) / 100);
            if (buff.duration <= 0) {
                return false;
            }
        }
        if (buff.is_busy && !buff.no_diff) {
            if (from) {
                buff.duration = buff.duration + from.query_prop("busy");
                buff.duration = buff.duration * (100 + from.query_prop("busy_per")) / 100;
            }
            buff.duration = buff.duration - this.query_prop("diff_busy");
            buff.duration = Math.round(buff.duration * (100 - this.query_prop("diff_busy_per")) / 100);
            if (buff.duration <= 0) {
                return false;
            }
        }
        for (let i = 0; i < this.status.length; i++) {

            if (this.status[i].id == sid) {
                const item = this.status[i];
                if (item.override != buff.override) return false;
                if (item.override == 0) {
                    return false;
                }
                if (item.override == 1) {
                    if (item.max_count <= item.count) {
                        return false;
                    }
                    item.count += buff.count;
                    clearTimeout(item.handler);
                    if (item.duration)
                        item.handler = this.call_out(this.remove_status, item.duration, sid);
                    this.change_buff(item, true, buff.count);
                    item.start_time = buff.start_time;
                    this.status_changed(item, "refresh");
                } else {

                    item.handler && clearTimeout(item.handler);
                    this.change_buff(item, false, item.count);
                    this.status_changed(item, "remove");
                    if (buff.duration)
                        item.handler = this.call_out(this.remove_status, buff.duration, sid);
                    this.status[i] = buff;
                    buff.start_time = buff.start_time;
                    this.change_buff(buff, true, buff.count);
                    this.status_changed(buff, "add");
                }
                return;
            }
        }
        if (buff.duration)
            buff.handler = this.call_out(this.remove_status, buff.duration, sid);
        this.status.push(buff);

        this.change_buff(buff, true, buff.count);
        this.status_changed(buff, "add");
    }

    /**
     * 清除指定类型的负面状态
     * @param {*} type - 负面状态类型
     * @returns {number|undefined} 清除的状态数量
     */
    clear_downside(type) {
        if (!this.status) return;
        let removed = "0";
        let count = 0;
        for (let i = 0; i < this.status.length; i++) {
            const item = this.status[i];
            if ((item.downside || false) == type && !item.no_clear) {

                this.change_buff(item, false, item.count);
                item.handler && clearTimeout(item.handler);
                this.status.splice(i, 1);
                i--;
                removed += ',"' + item.id + '"';
                count++;
            }
        }
        if (removed.length == 1 || !this.environment) return;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                player.send(msg);
            }
        }
        return count;

    }


    /** 清除战斗状态(战斗结束后) */
    clear_combat_status() {
        if (!this.status || !this.status.length) return;
        let removed = "0";
        for (let i = this.status.length - 1; i >= 0; i--) {
            const item = this.status[i];
            if (item.only_combat) {
                this.change_buff(item, false, item.count);
                item.handler && clearTimeout(item.handler);
                this.status.splice(i, 1);
                removed += ',"' + item.id + '"';
            }
        }
        if (removed.length == 1 || !this.environment) return;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                player.send(msg);
            }
        }
    }

    /**
     * 按条件批量移除状态
     * @param {function(*): boolean} func - 判断函数
     */
    remvoe_statuses(func) {
        if (!this.status || !this.status.length) return;
        let removed = "0";
        for (let i = this.status.length - 1; i >= 0; i--) {
            const item = this.status[i];
            if (func(item)) {
                this.change_buff(item, false, item.count);
                item.handler && clearTimeout(item.handler);
                this.status.splice(i, 1);
                removed += ',"' + item.id + '"';
            }
        }
        if (removed.length == 1 || !this.environment) return;
        const items = this.environment.items;
        const msg = '{type:"status",id:"' + this.id + '",sid:[' + removed + '],action:"remove"}';
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                player.send(msg);
            }
        }
    }

    /** 清除所有状态 */
    clear_status() {
        if (!this.status || !this.status.length) return;
        for (let i = 0; i < this.status.length; i++) {
            const item = this.status[i];
            this.change_buff(item, false, item.count);
            item.handler && clearTimeout(item.handler);
        }
        this.status.length = 0;
        if (!this.environment) return;
        const msg = '{type:"status",id:"' + this.id + '",action:"clear"}';
        const items = this.environment.items;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                player.send(msg);
            }
        }
    }

    /**
     * 变更状态效果
     * @param {*} buff - 状态对象
     * @param {boolean} isadd - true添加 false移除
     * @param {number} buff_count - 层数
     */
    change_buff(buff, isadd, buff_count) {
        if (isadd) {
            if (buff.prop) {
                for (let i = 0; i < buff_count; i++) {
                    this.change_prop(buff.prop, true);
                }
                this.recount();
            }
            if (buff.on_attach) buff.on_attach(this);
            if (buff.ig_control) this.ig_control = buff.duration;

            if (buff.start_msg) {
                this.send_room(buff.start_msg);
            }
            if (buff.is_busy) this.is_busy = buff.duration;
            if (buff.is_miss) this.is_miss = buff.duration;
            if (buff.is_rash) this.is_rash = buff.duration;
            if (buff.is_shadow) this.is_shadow = buff.duration;
            if (buff.is_faint) {
                this.is_faint = buff.duration;
            }
        } else {
            if (buff.prop) {
                for (let i = 0; i < buff_count; i++) {
                    this.change_prop(buff.prop, false);
                }
                this.recount();
            }
            if (buff.on_expire) buff.on_expire(this);
            if (buff.is_busy) this.is_busy = 0;
            if (buff.is_miss) this.is_miss = 0;
            if (buff.is_rash) this.is_rash = 0;
            if (buff.ig_control) this.ig_control = 0;
            if (buff.is_shadow) this.is_shadow = 0;
            if (buff.is_faint) {
                this.is_faint = 0;
            }
            if (this.hp > 0 && buff.finish_msg) {
                this.send_room(buff.finish_msg);
            }
            this.remove_temp(buff.id);
        }

    }

    /**
     * 拼接状态数据到JSON
     * @param {string[]} str - 输出数组
     */
    appdend_status(str) {
        if (!this.status) return;
        const now = Date.now();
        str.push(",status:[");
        for (let i = 0; i < this.status.length; i++) {
            if (i > 0) str.push(",");
            const item = this.status[i];
            str.push('{sid:"');
            str.push(item.id);
            str.push('",name:"');
            str.push(item.name);
            str.push('",duration:');
            if (item.on_interval) {
                str.push(item.duration * item.duration_count);
            } else {
                str.push(item.duration);
            }
            str.push(',overtime:');
            str.push(now - item.start_time);
            if (item.override === 1) {
                str.push(',"count":');
                str.push(item.count);
            }
            if (item.downside) {
                str.push(',downside:');
                str.push(true);
            }
            str.push('}');
        }
        str.push("]");
    }

    /** 通知客户端当前状态 */
    notify_status() {
        if (!this.status) return;
        const str = ['{type:"status",id:\"'];
        str.push(this.id);
        str.push("\",action:'load',items:[");
        const now = Date.now();
        for (let i = 0; i < this.status.length; i++) {
            if (i > 0) str.push(",");
            const item = this.status[i];
            str.push('{sid:"');
            str.push(item.id);
            str.push('",name:"');
            str.push(item.name);
            str.push('",duration:');
            if (item.on_interval) {
                str.push(item.duration * item.duration_count);
            } else {
                str.push(item.duration);
            }

            str.push(',overtime:');
            str.push(now - item.start_time);
            if (item.override === 1) {
                str.push(',"count":');
                str.push(item.count);
            }
            if (item.downside) {
                str.push(',downside:');
                str.push(true);
            }
            str.push('}');
        }
        str.push("]}");
        this.send(str.join(""));
    }

    /**
     * 状态变更通知
     * @param {*} item - 状态对象
     * @param {string} type - 变更类型(add/remove/refresh)
     */
    status_changed(item, type) {
        const str = [];
        str.push('{type:"status","action":"');
        str.push(type);
        str.push('",id:"');
        str.push(this.id);
        str.push('",sid:"');
        str.push(item.id);
        str.push('"');
        if (type === "add") {
            str.push(',"name":"');
            str.push(item.name);
            str.push('","duration":');
            if (item.on_interval) {
                str.push(item.duration * item.duration_count);
            } else {
                str.push(item.duration);

            }
            if (item.override === 1) {
                str.push(',"count":');
                str.push(item.count);
            }
            if (item.downside) {
                str.push(',downside:');
                str.push(true);
            }
        } else if (type === "refresh") {
            str.push(',count:');
            str.push(item.count);
        }
        str.push('}');
        if (!this.environment) return;
        const msg = str.join("");
        const items = this.environment.items;
        for (let i = 0; i < items.length; i++) {
            const player = items[i];
            if (player.is_player) {
                player.send(msg);
            }
        }
    }

    /**
     * 移除状态
     * @param {string} sid - 状态ID
     * @param {boolean} [isall] - 是否移除全部层数
     */
    remove_status(sid, isall) {
        if (!this.status) return;
        for (let i = this.status.length - 1; i >= 0; i--) {
            if (this.status[i].id === sid) {
                const item = this.status[i];
                if (item.handler) clearTimeout(item.handler);
                item.handler = null;


                if (item.on_interval && !isall) {
                    item.over_count++;
                    if (item.on_interval) {
                        if (item.on_interval(this, item.over_count) === false) {
                            item.duration_count = item.duration_count || 2;
                            item.over_count = item.duration_count;
                        }
                    }
                    if (item.duration_count === 0 || (item.duration_count > 1 && item.duration_count > item.over_count)) {
                        if (item.duration)
                            item.handler = this.call_out(this.remove_status, item.duration, sid);
                        return;
                    }
                }

                this.change_buff(item, false, 1);

                if (item.override === 1) {
                    item.count--;

                    if (item.count === 0 || isall) {

                        this.change_buff(item, false, item.count);

                        this.status_changed(item, "remove");
                        this._splice_status(i, item);
                    } else {
                        if (item.duration)
                            item.handler = this.call_out(this.remove_status, item.duration, sid);
                        item.start_time = Date.now();
                        this.status_changed(item, "refresh");
                    }
                } else {
                    this.status_changed(item, "remove");
                    this._splice_status(i, item);
                }

                return;
            }
        }
    }

    /**
     * 从状态数组中安全移除
     * @param {number} index - 索引
     * @param {*} item - 状态对象
     * @returns {*[]|undefined}
     */
    _splice_status(index, item) {
        if (this.status[index] === item) {
            return this.status.splice(index, 1);
        }
        for (let i = 0; i < this.status.length; i++) {
            if (this.status[i] === item) {
                return this.status.splice(i, 1);
            }
        }
    }

    // ============ 装备系统 ============

    /**
     * 设置初始佩戴物品
     * @param {...[string, number, 1|0]} arguments - [物品路径, 数量, 是否装备]
     */
    set_objects() {
        if (!arguments.length) return;
        if (!this.items) this.items = [];
        for (let i = 0; i < arguments.length; i++) {
            const item = arguments[i];
            const obj = OBJ.CREATE(item[0], item[1]);
            if (!obj) continue;
            if (item[2] && obj.is_equipment) {
                if (!this.equipment) this.equipment = []
                this.equipment[/** @type {EQUIPMENT} */ (/** @type {unknown} */ (obj)).eq_type] = /** @type {EQUIPMENT} */ (/** @type {unknown} */ (obj));
            } else {
                this.items.push(obj);
            }
        }

    }

    /**
     * 卸下装备
     * @param {EQUIPMENT} obj - 装备对象
     * @param {boolean} [notsend] - 是否不发送消息
     * @param {number} [recover_time=0] - 冷却时间
     * @returns {boolean|undefined}
     */
    unequip(obj, notsend, recover_time = 0) {
        if (!obj || !obj.is_equipment || !this.equipment) return;
        if (obj.uneq(this, notsend) == false) {
            return false;
        }
        if (obj != this.equipment[obj.eq_type]) return;
        if (!this.items) this.items = [];
        this.items.push(obj);
        this.equipment[obj.eq_type] = null;
        if (obj.eq_type == EQUIP_TYPE.WEAPON) {
            this.remove_status('weapon', true);
            if (obj.is_shortcut) {
                this.send("{type:'addAction',id:'" + obj.id + "',name:'" + obj.name + "'}");
            }
        }

        if (obj.eq_type === EQUIP_TYPE.WEAPON)
            this.weapon_changed(false);
        this.recount();
        if (recover_time > 0 && this.is_player) {
            this.set_temp('eq_wea', obj.id, 60000);
        }
    }

    /**
     * 装备物品
     * @param {EQUIPMENT} obj - 装备对象
     * @returns {boolean|undefined}
     */
    equip(obj) {
        if (!obj || !obj.is_equipment) return;
        if (!this.equipment) this.equipment = []
        const equiped = this.equipment[obj.eq_type];
        if (equiped == obj) {
            return;
        }
        if (equiped) {
            equiped.uneq(this);
            this.equipment[equiped.eq_type] = null;
            this.items.push(equiped);
            if (equiped.eq_type == EQUIP_TYPE.WEAPON) {
                this.remove_status('weapon', true);
            }
            if (equiped.on_use) {
                equiped.notify_action(this, false);
            }
            if (equiped.is_shortcut) {
                this.send("{type:'addAction',id:'" + equiped.id + "',name:'" + equiped.name + "'}");
            }
        }
        if (obj.eq(this) == false) {
            if (equiped) {
                if (obj.eq_type === EQUIP_TYPE.WEAPON)
                    this.weapon_changed(false);
                this.recount();
            }
            return false;
        }
        this.items.remove(obj);
        this.equipment[obj.eq_type] = obj;
        if (obj.eq_type === EQUIP_TYPE.WEAPON)
            this.weapon_changed(true);
        this.recount();
        if (obj.is_shortcut) {
            this.send("{type:'removeAction',id:'" + obj.id + "'}");
        }
        if (obj.eq_type == EQUIP_TYPE.WEAPON) {
            if (this.fight_type) {
                this.release_time = 3000 + Date.now();
                this.send('{type:"dispfm",rtime:3000}');
            }
            if (this.query_temp('jxtm')) {
                this.remove_status('force');
            }
        }
    }

    /**
     * 武器变更处理
     * @param {boolean} iseq - 是否装备武器
     */
    weapon_changed(iseq) {
        this.attack_skill = this.query_used_skill(this.query_weapon_type());
        this.on_skillchanged && this.on_skillchanged();
        if (!this.auto_skills) return;

        for (let item of this.auto_skills) {
            if (WEAPON_TYPES[item.type]) {
                item.ban_use = !iseq;
            }
        }
    }

    /**
     * 添加物品
     * @param {OBJ|string} obj
     * @param {number} [count]
     * @returns {OBJ|undefined}
     */
    add_obj(obj, count) {
        if (!obj) return;
        if (typeof obj == "string") {
            obj = OBJ.clone_to(obj, this, count);
            if (!obj) return;
        } else {
            obj = this.push_item(obj);
        }
        return obj;
    }

    /**
     * 移除物品
     * @param {OBJ|string} obj
     * @param {number} [count]
     * @returns {OBJ|undefined}
     */
    remove_obj(obj, count) {
        if (typeof obj == "string") {
            obj = this.find_obj(obj);
        }
        if (!obj) return;
        count = count || obj.count || 1;
        this.remove_item(obj, count);
        return obj;
    }

    /**
     * 获取当前武器
     * @returns {EQUIPMENT|undefined}
     */
    query_weapon() {
        if (this.equipment) {
            return this.equipment[EQUIP_TYPE.WEAPON];
        }
    }

    /**
     * 获取当前武器类型
     * @returns {string}
     */
    query_weapon_type() {
        if (this.equipment) {
            const eq = this.equipment[EQUIP_TYPE.WEAPON];
            if (eq) return eq.weapon_type;
        }
        return WEAPON_TYPE.NONE;
    }

    /**
     * 获取武器名称
     * @returns {string}
     */
    weapon_name() {
        if (this.equipment && this.equipment[EQUIP_TYPE.WEAPON]) {
            return this.equipment[EQUIP_TYPE.WEAPON].color_name;
        }
        return "";
    }

    /**
     * 获取暗器名称
     * @returns {string}
     */
    throwing_name() {
        if (this.equipment && this.equipment[EQUIP_TYPE.THROWING]) {
            return this.equipment[EQUIP_TYPE.THROWING].color_name;
        }
        return "";
    }

    /**
     * 是否有暗器可用
     * @returns {boolean}
     */
    can_throwing() {
        if (this.equipment) {
            const th = this.equipment[EQUIP_TYPE.THROWING];
            if (!th) return false;
            return true;
        }
        return false;
    }

    /**
     * 获取指定类型装备
     * @param {number} type - 装备类型 (EQUIP_TYPE)
     * @returns {EQUIPMENT|undefined}
     */
    get_equipment(type) {
        return this.equipment && this.equipment[type];
    }

    /**
     * 设置掉落列表
     * @param {...*} arguments - 掉落定义
     */
    set_drop() {
        this.drop_list = this.drop_list || [];
        for (let i = 0; i < arguments.length; i++) {
            this.drop_list.push(arguments[i]);
        }
    }

    /**
     * 查询掉落物品
     * @returns {OBJ[]|undefined}
     */
    query_drop() {
        if (!this.drop_list) return;
        return OBJ.create_by_odds(this.drop_list);

    }

    // ============ 移动与跟随系统 ============

    /**
     * 移动到新房间
     * @param {ROOM|string} rm - 目标房间或房间路径
     * @param {string} [leave_msg] - 离开消息
     * @param {string} [in_msg] - 进入消息
     * @param {string} [dir] - 方向
     * @returns {boolean|undefined}
     */
    moveto(rm, leave_msg, in_msg, dir) {
        const cur_room = this.environment;
        let next_room = rm;
        if (typeof rm === "string") {
            const _ROOM = /** @type {typeof ROOM} */ (/** @type {*} */ (globalThis).ROOM);
            next_room = _ROOM.Get(rm);
            if (!next_room) return false;
            if (next_room.parent === cur_room.parent) {
                if (cur_room.owner) {
                    next_room = next_room.query_copy(cur_room.owner);
                }
            } else {
                const my_room = next_room.query_copy2(this);
                if (my_room) {
                    next_room = my_room;
                }
            }
        }
        if (!next_room) return false;

        if (next_room.is_full()) {
            next_room = next_room.create_shadow();
            if (!next_room) {
                return this.notify("那里人太多了，你过不去。");
            }
        }
        if (cur_room) {
            if (cur_room.do_leave(this, dir, leave_msg) === false) {
                return false;
            }
        }

        next_room.do_enter(this, true, in_msg);
        this.notify_follower(dir);
        if (cur_room && next_room.parent !== cur_room.parent) {
            cur_room.parent.on_leaved(this);
        }
    }

    /**
     * 跟随目标
     * @param {CHARACTER|null} target - 目标或null停止跟随
     */
    do_follow(target) {
        if (target) {
            if (target.query_setting("no_follow")) {
                return this.notify(target.name + "不允许别人跟随。");
            }
            if (this.follow_target) {
                this.follow_target.follow_targets.remove(this);
                this.send_room("$N不再跟随$n一起行动。", this.follow_target);
            }
            this.follow_target = target;
            if (!target.follow_targets) {
                target.follow_targets = [];
            }
            target.follow_targets.push(this);
            this.send_room("<hig>$N决定跟随$n一起行动。</hig>", target);
        } else {
            if (!this.follow_target) return this.notify("你目前没有跟随别人一起行动。");
            this.follow_target.follow_targets.remove(this);
            this.send_room("$N不再跟随$n一起行动。", this.follow_target);
            this.follow_target = null;
        }
    }

    /** 清除所有跟随关系 */
    clear_follow() {
        if (this.follow_target) {
            this.follow_target.follow_targets.remove(this);
            this.follow_target = null;
        }
        if (this.follow_targets) {
            for (let item of this.follow_targets) {
                item.follow_target = null;
            }
            this.follow_targets = null;
        }
    }

    /**
     * 通知跟随者移动
     * @param {string} dir - 方向
     */
    notify_follower(dir) {
        if (this.follow_targets) {
            for (let i = 0; i < this.follow_targets.length; i++) {
                const item = this.follow_targets[i];
                if (!item.environment) continue;
                if (!item.is_player) {
                    if (item.on_master_leave) {
                        if (item.on_master_leave(this, this.environment) == false) {
                            continue;
                        }
                    } else {
                        if (item.environment.is_fb() != this.environment.is_fb()) {
                            continue;
                        }
                    }
                    item.moveto(this.environment,
                        sendOutMessage(item, dir), sendInMessage(item));
                } else {
                    item.moveto(this.environment,
                        sendOutMessage(item, dir), sendInMessage(item));
                }
            }
        }
    }

    /**
     * 尝试逃跑
     * @returns {boolean}
     */
    do_escape() {
        const eny = this.query_enemy();
        if (!eny) return true;
        if (eny.on_escape) return eny.on_escape(this);
        let is_esc = this.random(this.ds / 2) + this.ds > eny.mz;
        if (eny.is_faint) is_esc = true;
        if (!is_esc) {
            this.send_room("<cyn>$N转身想跑，$n一把拦住$P：想跑？没门！\n</cyn>", eny);
            this.add_status({
                id: "busy",
                name: "忙乱",
                duration: this.gjsd,
                is_busy: true
            });
        }
        return is_esc;
    }


    /**
     * 退出队伍
     * @param {string} msg - 退出原因
     */
    team_out(msg) {
        const tm = this.team;
        if (!tm) return;
        for (let i = 0; i < tm.length; i++) {
            if (!tm[i].is_player && tm[i].master == this.id) {
                tm[i].on_teamout && tm[i].on_teamout();
                this.notify(tm[i].name + "退出了队伍。");
                tm[i].team = null;
                tm.splice(i, 1);
                i--;
            }
        }
        this.team = null;
        const iscap = this == tm[0];
        tm.remove(this);
        checkTeamfb(this);
        if (!tm.length) {
            this.send("你的队伍解散了。");
            this.send('{"type":"dialog","dialog":"team",dismiss:true}');
        } else {
            const first = tm[0];
            const dissmsg = '{"type":"dialog","dialog":"team",dismiss:true}';
            this.send("<hic>你退出了队伍。</hic>");


            if (tm.length > 1) {
                if (iscap) {
                    first.send_team("<hic>" + this.name + msg + "，" + first.name + "现在是队长。</hic>");
                } else {
                    first.send_team("<hic>" + this.name + msg + "。</hic>");
                }
                first.send_team('{"type":"dialog","dialog":"team",remove:"' + this.id + '"}');
                this.send(dissmsg);
            } else {
                if (first.team) {
                    checkTeamfb(first);
                    first.send("<hic>" + this.name + msg + "，你的队伍解散了。</hic>");
                    first.team.length = 0;
                    first.team = null;
                    first.send(dissmsg);
                    this.send(dissmsg);
                }
            }

        }
    }

    // ============ 通用显示方法 ============

    /**
     * 获取等级描述(含颜色)
     * @returns {string}
     */
    get_level_desc() {
        if (!this.level) return level_descs[this.level];
        const cc = level_color[this.level];
        return "<" + cc + ">" + level_descs[this.level] + "</" + cc + ">";
    }

    /**
     * 获取等级颜色
     * @returns {string}
     */
    get_level_color() {
        return level_color[this.level];
    }

    /**
     * 完整显示名称
     * @returns {string}
     */
    long_name() {

        if (this.title) return this.title + " " + this.name;
        return this.name;

    }

    /**
     * 查询称号
     * @param {string} type - 称号类型
     * @returns {string|undefined}
     */
    query_title(type) {
        return this.title;
    }

    /**
     * 查询年龄
     * @returns {number}
     */
    query_age() {
        return this.age;
    }

    /**
     * 门派称谓
     * @param {boolean} [isbad]
     * @returns {string}
     */
    call(isbad) {
        return this.family.call(this, isbad);
    }

    /**
     * 自称
     * @param {boolean} [isbad]
     * @returns {string}
     */
    callme(isbad) {
        return this.family.call_me(this);
    }

    /**
     * 同门师兄弟姐妹称谓
     * @param {CHARACTER} target
     * @returns {string}
     */
    fam_call(target) {
        const age1 = target.query_age();
        const age2 = this.query_age();
        if (age1 < age2) {
            return this.gender === 1 ? "师兄" : "师姐";
        }
        return this.gender === 1 ? "师弟" : "师妹";
    }

    /**
     * 第三人称代称
     * @returns {string}
     */
    call3() {
        return this.gender == 1 ? "他" : "她";
    }

    /**
     * 是否隐藏
     * @returns {boolean}
     */
    is_hidden() {
        return this.hp <= 0 || this.query_temp('hidden');
    }

    /**
     * 是否是队友
     * @param {CHARACTER} p
     * @returns {boolean}
     */
    is_team(p) {
        if (!p) return false;
        if (p.team)
            return this.team == p.team;
        return this.family == p.family;
    }

    /**
     * 向队伍发送消息
     * @param {string} msg
     * @param {boolean} [nome] - 是否排除自己
     */
    send_team(msg, nome) {
        if (!this.team) return this.send(msg);
        for (let i = 0; i < this.team.length; i++) {
            if (nome && this.team[i] == this) continue;
            this.team[i].send(msg);
        }
    }

    /**
     * 向门派发送消息
     * @param {string} str
     */
    send_fam(str) {
        this.family.send(str);
    }

    /**
     * 查询队伍ID
     * @returns {string|null}
     */
    query_teamid() {
        if (this.follow_target) return this.follow_target.query_teamid();
        return null;
    }


    /**
     * 查询可执行命令菜单 — 子类覆写接收(me)返回JSON字符串, 基类返回undefined
     * @param {CHARACTER} [me] - 观察者角色
     * @returns {void}
     */
    query_commands(me) {

    }

    /**
     * 查询外观描述
     * @param {CHARACTER} me - 观察者
     * @param {string} [eqcmd] - 查看装备命令
     * @returns {string}
     */
    query_desc(me, eqcmd) {
        const str = [];
        str.push(this.long_name());
        str.push("\n");
        const call3 = this == me ? "你" : this.call3();
        str.push(call3, "看起来约", get_agestr(this.query_age()), "岁。\n");
        str.push(call3, "长得", get_perdesc(this), "。\n");
        str.push(call3, get_skill_desc(this.query_skill(this.attack_skill.id)), "。\n");
        str.push(call3, get_status(this), "\n");
        this.format_equipments(call3, str, eqcmd);
        return str.join("");
    }

    /**
     * 格式化装备显示
     * @param {string} call3 - 第三人称代词
     * @param {string[]} str - 输出数组
     * @param {string} [eqcmd]
     */
    format_equipments(call3, str, eqcmd) {
        if (this.query_setting("hide_equip")) {
            return str.push("看样子", call3, "不想让别人看自己的装备。");
        } else if (this.equipment && this.equipment.length) {
            const eqstr = [];
            for (let i = 0; i < this.equipment.length; i++) {
                const item = this.equipment[i];
                if (!item) continue;
                eqstr.push("<span cmd='", eqcmd || "look", " ", (i),
                    " of ", this.id, "'>◆", item.color_name, "</span>\n");
            }
            if (eqstr.length) {
                return str.push(call3, "装备着：\n", eqstr.join(""));
            }
        }
        str.push(call3, "光着身子，什么都没穿。\n");
    }

    // ============ 战斗系统 ============

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

    }

    /**
     * 开始比试(fight)
     * @param {CHARACTER} target
     */
    do_fight(target) {
        this.begin_attack(target, 1);
    }

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
    }

    /**
     * 添加敌人
     * @param {CHARACTER} target
     */
    add_enemy(target) {
        if (!this.enemy) {
            this.enemy = [];
        }
        this.enemy.push(target);
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    /**
     * 是否可以攻击
     * @returns {boolean}
     */
    can_attack() {
        return this.hp > 0 && this.fight_type > 0 && !this.is_faint && !this.is_busy;
    }

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
    }

    /**
     * 查询攻击部位
     * @returns {{name: string, hert: number, crit: number}}
     */
    query_part() {
        return CHARACTER_PARTS.random();
    }


    /**
     * 恢复满血满蓝，清除冷却
     */
    full() {

        this.hp = this.max_hp;
        this.mp = this.max_mp;
        this.clear_distime();
        this.release_time = 0;
        this.notify_hp();
    }

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
    }

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
    }

    // ============ 战斗方法(由extends合并) ============

    /**
     * 重新计算战斗属性
     */
    recount() {
        this.gjsd = 4000 - this.query_prop("gjsd");
        this.gjsd = parseInt(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
        if (this.gjsd < 500) this.gjsd = 500;

        this.gj = parseInt(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
        this.fy = parseInt(((this.str + this.con) / 10 + this.query_prop("fy") + this.query_prop("con") * this.con / 10) * (100 + this.query_prop("fy_per")) / 100);
        this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
        this.ds = parseInt((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 5) * (100 + this.query_prop("ds_per")) / 100);
        this.zj = parseInt((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 5) * (100 + this.query_prop("zj_per")) / 100);
        this.bj = parseInt(this.dex / 10 + this.query_prop("bj_per"));

        this.diff_sh_per = this.query_prop('diff_sh_per');
        this.diff_fy_per = this.query_prop('diff_fy_per');
    }

    /**
     * 暴击判定
     * @param {CHARACTER} target
     * @param {{crit: number}} part
     * @param {number} bj_per
     * @returns {boolean}
     */
    crit(target, part, bj_per) {
        if (this.random(100) < bj_per
            + (part ? part.crit : 0) - target.query_prop("diff_bj")) {
            return true;
        }
    }

    /**
     * 执行一次攻击
     * @param {Object} par - 攻击参数
     * @returns {number|void}
     */
    do_attack(par) {
        if (this.is_faint || this.hp <= 0 || !this.fight_type) return;
        var target = par.target;
        if (!target) {
            target = this.query_enemy();
            if (!target) return;
        }
        var weapon = this.query_weapon();
        var attackskill = par.no_weapon ? this.noweapon_skill : this.attack_skill;

        if (attackskill.on_before_attack
            && !par.is_throwing
            && !par.no_append_before) attackskill.on_before_attack(this, target, par);
        if (this.force_skill.on_before_attack && !par.no_append_before) {
            this.force_skill.on_before_attack(this, target, par);
        }

        this.attack_part = par.part ?? target.query_part();

        var attack_msg = par.attack_msg;
        if (attack_msg === undefined) {
            attack_msg = attackskill.query_attack_action(this, target);
        }
        if (par.attack_before) {
            attack_msg = par.attack_before + attack_msg;
        }
        var weapon_type = par.no_weapon ?
            WEAPON_TYPE.NONE : (weapon ? weapon.weapon_type : WEAPON_TYPE.NONE);
        if (attack_msg) this.send_combat(attack_msg, target);

        var sh = par.gj ?? this.gj, mz = par.mz ?? this.mz;
        par.is_dodge = false; par.is_parry = false;
        if (target.is_faint || this.is_shadow) {
            par.is_dodge = false;
            par.is_parry = false;
        }
        else if (target.is_rash) {
            par.is_dodge = false;
            par.is_parry = (target.is_busy || par.no_parry) ? false : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        } else if (this.is_miss && !par.no_dodge) {
            par.is_dodge = true;
            par.is_parry = (target.is_busy || par.no_parry) ? false : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        } else if (target.is_miss || par.no_dodge) {
            par.is_dodge = false;
            par.is_parry = (target.is_busy || par.no_parry) ? false : (Math.random() * (target.zj / 2) + target.zj / 2 > mz);
        } else if (target.is_busy || par.no_parry) {
            par.is_dodge = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
            par.is_parry = false;
        } else {
            par.is_dodge = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
            par.is_parry = Math.random() * (target.zj / 2) + target.zj / 2 > mz;
        }
        if (par.is_dodge) {
            if (par.on_dodge) par.on_dodge(target);
        } else if (target.dodge_skill.on_dodge) {
            target.dodge_skill.on_dodge(target, this, par);
        }
        if (par.is_dodge) {
            sh = 0;
            this.send_combat((par.miss_msg || target.dodge_skill.query_dodge_action()) + "\n", target);
        } else {
            if (target.parry_skill.on_parry &&
                !par.no_parry && !target.is_busy && !target.is_faint) {
                target.parry_skill.on_parry(target, this, par);
            }
            if (par.on_parry) {
                par.on_parry(target, par.is_parry);
            }
            par.bj = par.bj ?? this.bj;
            if (par.is_parry) {
                sh = 0;
            } else {
                if (weapon && weapon.do_attack &&
                    ((par.no_weapon && weapon_type === WEAPON_TYPE.NONE)
                        || (!par.no_weapon && weapon_type !== WEAPON_TYPE.NONE))
                    && !par.is_throwing) {
                    sh += weapon.do_attack(this, target, par);
                }
                if (attackskill.on_attack && !par.is_throwing) {
                    sh += attackskill.on_attack(this, target, par);
                }
                sh = sh * this.attack_part.hert;
                if (!par.no_power) {
                    sh = sh + sh * this.query_prop("add_sh_per") / 100;

                    par.iscirt = par.cirt ? par.cirt(target, this.attack_part, par.bj) : this.crit(target,
                        this.attack_part, par.bj);

                    if (par.iscirt)
                        sh = sh * (150 + (par.add_bjsh_per ?? this.query_prop("add_bjsh_per"))) / 100;
                }
            }
            let power_gj = par.power_gj ?? 0;
            if (this.force_skill.do_force_attack) {
                power_gj += this.force_skill.do_force_attack(this, target, par);
            }
            if (power_gj > 0 && (!weapon || weapon.weapon_type === WEAPON_TYPE.NONE)) {
                power_gj = power_gj + power_gj * this.query_prop("add_sh_per") / 100;
                if (par.iscirt)
                    power_gj = power_gj * (150 + (par.add_bjsh_per ?? this.query_prop("add_bjsh_per"))) / 100;
            }

            if (power_gj > 0) sh += power_gj;
            if (target.force_skill.on_force_parry) {
                par.power_gj = power_gj;
                sh -= target.force_skill.on_force_parry(target, this, sh, par);
                if (this.hp <= 0 || !target.fight_type) {
                    return;
                }
            }
            if (sh > 0)
                sh = target.damage(sh, this, par.diff_fy);

            if (par.is_parry) {
                this.send_combat((par.parry_msg || target.parry_skill.query_parry_action(target, this, weapon_type)) + "\n", target);
                if (sh > 0) {
                    target.send_combat(query_status_msg(target.hp, target.max_hp));
                    target.on_damage && target.on_damage(this, sh);
                }
            }
            else {
                if (sh > 0) {
                    this.send_combat(damage_msg(sh, par.is_throwing ? WEAPON_TYPE.THROWING : weapon_type,
                        target, par.iscirt, par.damage_msg)
                        , target);
                    target.send_combat(query_status_msg(target.hp, target.max_hp));
                    target.on_damage && target.on_damage(this, sh);
                } else {
                    this.send_combat("结果没有造成任何伤害。\n", true);
                }
            }
        }
        if (this.fight_type) {
            if (!par.no_append_target && target.fight_type) {
                target.dodge_skill.on_dodge_over
                    && target.dodge_skill.on_dodge_over(target, this, par);

                if (!par.is_dodge)
                    target.parry_skill.on_parry_over &&
                        target.parry_skill.on_parry_over(target, this, par);
            }
            if (!par.no_append) {
                attackskill.on_attack_over && attackskill.on_attack_over(this, target, par, sh);
                this.force_skill.on_force_over &&
                    this.force_skill.on_force_over(this, target, par, sh);
            }
        }
        return sh;
    }

    /**
     * 接收攻击伤害(简化版)
     * @param {number} sh - 伤害值
     * @param {number} mz - 命中值
     * @param {string} gjmsg - 攻击消息
     * @param {string} shmsg - 伤害消息
     * @param {string} dsmsg - 闪避消息
     * @param {string} parrymsg - 招架消息
     * @returns {boolean} 是否闪避
     */
    from_attack(sh, mz, gjmsg, shmsg, dsmsg, parrymsg) {
        gjmsg && this.send_room(gjmsg);
        var is_dodge = mz > 0 ? Math.random() * (this.ds / 2) + this.ds / 2 > mz : false;
        if (is_dodge) {
            this.send_room((dsmsg || this.dodge_skill.query_dodge_action()), this);
        } else {
            this.send_room(shmsg);
            this.damage(sh);
            this.send_combat(query_status_msg(this.hp, this.max_hp));

            if (this.fight_type === 1 && this.hp < 0) {
                this.hp = 1;
            } else if (this.hp <= 0) {
                this.die();
                this.end_fight();
            }
        }
        return is_dodge;
    }

    /**
     * 恢复气血
     * @param {number} hp
     * @returns {number}
     */
    do_recover(hp) {
        hp = hp + hp * this.query_prop('recover_per') / 100;
        if (!(hp > 0)) return 0;
        return this.add_hp(parseInt(hp));
    }

    /**
     * 计算最终伤害(含免伤/防御/内功减免)
     * @param {number} sh - 原始伤害
     * @param {CHARACTER} [from] - 攻击者
     * @param {number} [diff_fy] - 额外忽视防御
     * @returns {number}
     */
    damage(sh, from, diff_fy) {
        if (!(sh > 0)) return 0;
        let diff_sh_per = this.diff_sh_per;
        let fy = this.fy;
        if (diff_fy > 0) {
            diff_sh_per -= diff_sh_per * diff_fy / 100;
            fy -= fy * diff_fy / 100;
        }
        let diff_fy_per = from ? from.diff_fy_per : 0;
        if (diff_sh_per > 0 && diff_fy_per > 0) {
            diff_sh_per -= diff_fy_per;
            if (diff_sh_per < 0) {
                diff_fy_per = -diff_sh_per;
            }
        }
        if (fy > 0 && diff_fy_per > 0) {
            fy -= fy * diff_fy_per / 100;
            if (fy < 0) fy = 0;
        }
        if (diff_sh_per > 0)
            sh = sh - sh * diff_sh_per / 100;
        if (fy > 0 && sh > 0)
            sh = (sh / (sh + fy) * sh);
        sh = sh - this.query_prop("diff_sh");

        if (sh > 0 && this.equipment && this.equipment[1] && this.equipment[1].on_defense) {
            sh = this.equipment[1].on_defense(this, from, sh);
        }
        if (sh > 0 && this.force_skill.on_damage) {
            sh = this.force_skill.on_damage(this, from, sh);
        }

        if (sh > 0) {
            sh = parseInt(sh);
            if (this.record_damage && from) {
                if (!this.damages) this.damages = {};
                let damag = (this.damages[from.id] || 0) + sh;
                this.damages[from.id] = damag;
                this.sum_damages = (this.sum_damages ?? 0) + sh;
            }
            this.add_hp(-sh);
            return sh;
        }
        return 0;
    }

    /**
     * 计算伤害(无防御减免, 无记录)
     * @param {number} sh
     * @param {CHARACTER} [from]
     * @returns {number}
     */
    damage2(sh, from) {
        if (!sh) return;

        if (this.record_damage && from) {
            if (!this.damages) this.damages = {};
            var damag = (this.damages[from.id] || 0) + sh;
            this.damages[from.id] = damag;
        }
        if (this.force_skill.on_damage) {
            sh = this.force_skill.on_damage(this, from, sh);
            if (!sh) return 0;
        }
        this.add_hp(-sh);
        return sh;
    }

    /**
     * 纯扣血(无减免, 触发内功回调)
     * @param {number} sh
     * @param {CHARACTER} [from]
     * @returns {number}
     */
    damage3(sh, from) {
        if (!(sh > 0)) return;

        this.add_hp(-sh);
        if (this.force_skill.on_damage) {
            this.force_skill.on_damage(this, from, 0);
        }
        return sh;
    }

    /**
     * 重新自动攻击(PFM切换后触发)
     */
    reauto_attack() {
        if (!this.auto_pfm && this.fight_type) {
            if (this.attack_handler) clearTimeout(this.attack_handler);
            this.auto_attack();
        }
    }

    /**
     * 自动攻击循环
     */
    auto_attack() {
        var target = this.query_enemy();
        if (this.hp <= 0) {
            if (this.fight_type && target) {
                return target.end_attack(this);
            }
            return this.end_fight();
        }
        if (!target) {
            return this.end_fight();
        }

        if (this.is_faint) {
            this.attack_handler = this.call_out(this.auto_attack, this.is_faint);
            return;
        }
        if (this.release_time) {
            var diff_time = this.release_time - Date.now();
            if (diff_time > 0) {
                this.attack_handler = this.call_out(this.auto_attack, diff_time);
                return;
            }
            this.release_time = 0;
        }
        var sh = 0;

        if (this.is_busy) {
            if (this.auto_pfm && this.busy_pfm) {
                if (!this.check_pfms(target)) {
                }
            } else {
                this.attack_handler = this.call_out(this.auto_attack, this.is_busy);
                return;
            }
        } else {
            if (!this.auto_pfm || !this.check_pfms(target)) {
                if (target.fight_type) {
                    sh = this.do_attack({
                        target: target,
                        gj: this.gj,
                        mz: this.mz
                    });
                }
            }
        }
        if (!sh || this.end_attack(target, sh)) {
            this.attack_handler = this.call_out(this.auto_attack, this.gjsd);
        }
    }

    /**
     * 释放绝招
     * @param {CHARACTER} target
     * @param {PERFORM} pfm
     * @param {number} level
     * @param {string} sktype
     * @returns {boolean}
     */
    use_pfm(target, pfm, level, sktype) {
        if (!pfm) return false;
        var isrelease = false;
        if (this.query_prop('no_pfm')) {
            this.send_room("<red>$N释放技能" + pfm.name + "，但是没有产生任何效果。</red>\n");
            this.remove_status('bikou');
            isrelease = true;
        } else if (target && target.parry_skill && target.parry_skill.on_parry_pfm) {
            isrelease = target.parry_skill.on_parry_pfm(target, this, pfm, level);
        } else {
            isrelease = pfm.use(this, target, level, sktype) !== false;
        }
        if (isrelease !== false) {
            this.add_mp(-pfm.query_mp(this, level) || 0);
            this.set_temp("used_pfm", pfm.id, 20000);
            return true;
        }
        return false;
    }

    /**
     * 检查并释放自动绝招
     * @param {CHARACTER} target
     * @returns {boolean}
     */
    check_pfms(target) {
        if (!this.auto_skills) this.init_pfms();
        if (!this.auto_skills) return false;
        this.attack_count = this.attack_count || this.pfm_rate || 3;

        if (this.random(this.attack_count) !== 0) {
            this.attack_count--;
            return false;
        }
        var now = Date.now();
        var canuser = [];
        for (var i = 0; i < this.auto_skills.length; i++) {
            var item = this.auto_skills[i];
            if (item.ban_use) {
                continue;
            }
            if (this.is_busy && !item.pfm.allow_busy) {
                continue;
            }
            if (item.release_time) {
                if (item.release_time > now) {
                    continue;
                }
                item.release_time = 0;
            }
            if (item.pfm.query_mp(this, item.level) <= this.mp)
                canuser.push(item);
        }
        if (!canuser.length) return false;

        var skill = canuser.random();
        if (!skill) return false;
        if (this.use_pfm(target, skill.pfm, skill.level, skill.type)) {
            var rtime = skill.pfm.query_releasetime(this, skill.levelvel);

            if (rtime > 0)
                this.release_time = rtime + now;
            else {
                this.release_time = 0;
                rtime = 0;
            }

            skill.release_time = now +
                skill.pfm.query_distime(this, skill.level, skill.is_ref) + rtime;

            return this.release_time > 0 || target.hp <= 0;
        }
        return false;
    }

    /**
     * 初始化自动绝招列表
     */
    init_pfms() {
        this.auto_skills = [];
        if (!this.skills) return;
        var bases = ["", "force", "unarmed", "dodge", "parry", "bite", "throwing"];
        var weapon = this.query_weapon_type();
        if (weapon !== WEAPON_TYPE.NONE) bases[0] = weapon;
        if (this.is_player && !this.throwing_name()) {
            bases[6] = "";
        }
        for (var base of bases) {
            if (!base) continue;
            var base_skill = this.skills[base];
            if (!base_skill) continue;

            var sp_skill = SKILL.get(base_skill.enable_skill || base);

            var level = base_skill.enable_skill ?
                this.query_skill(base_skill.enable_skill)
                : this.query_skill(base);
            if (sp_skill && sp_skill.pfm) {
                for (var p in sp_skill.pfm) {
                    this.add_auto_pfm(sp_skill.pfm[p], base, level, false);
                }
            }
            if (base_skill.enable_skill) {
                var ref_pfm = this.query_ref_skill(this.skills[base_skill.enable_skill]);
                if (ref_pfm) {
                    this.add_auto_pfm(ref_pfm, base, level / 2, true);
                }
            }
        }
    }

    /**
     * 添加自动绝招
     * @param {PERFORM} pfmitem
     * @param {string} baseSkill
     * @param {number} level
     * @param {boolean} is_ref
     */
    add_auto_pfm(pfmitem, baseSkill, level, is_ref) {
        if (pfmitem.no_auto) return;
        if (pfmitem.enable_skill && pfmitem.enable_skill !== baseSkill) return;
        if (pfmitem.check && pfmitem.check(this, level, baseSkill) === false) return;

        if (pfmitem.allow_busy) this.busy_pfm = true;
        this.auto_skills.push({
            pfm: pfmitem,
            level: level,
            id: baseSkill + "/" + pfmitem.pid,
            type: baseSkill,
            is_ref: is_ref
        });
    }

    /**
     * 设置技能冷却时间
     * @param {number} rtime - 冷却时间(ms)
     */
    set_releasetime(rtime) {
        let release_time = Date.now() + rtime;
        if (this.is_player) {
            this.notify('{type:"dispfm",id:"all",rtime:'
                + rtime + ',distime:0}');
        } else {
            if (!this.auto_skills) this.init_pfms();
        }
        this.release_time = release_time;
        if (!this.auto_skills) return;
        for (let askill of this.auto_skills) {
            if (!askill.release_time || askill.release_time < release_time) {
                askill.release_time = release_time;
            }
        }
    }
}

// ============================================================
// 模块级辅助函数与数据
// ============================================================

/**
 * 根据视角类型拆分消息模板中的$占位符
 * @param {CHARACTER} me - 发起者
 * @param {string} text - 消息模板
 * @param {number} type - 视角类型: 1本人 2目标 3第三人称
 * @param {ITEM} target - 消息的主要填充$目标对象
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
                case "N":
                    str.push(type === 1 ? "你" : me.name);
                    break;
                case "n":
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

// ============ 战斗相关辅助(由extends合并) ============

const catch_hunt_msg = [
    "<HIW>$N和$n仇人相见分外眼红，立刻打了起来！</HIW>",
    "<HIW>$N对著$n大喝：「可恶，又是你！」</HIW>",
    "<HIW>$N和$n一碰面，二话不说就打了起来！</HIW>",
    "<HIW>$N一眼瞥见$n，「哼」的一声冲了过来！</HIW>",
    "<HIW>$N一见到$n，愣了一愣，大叫：「我宰了你！」</HIW>",
    "<HIW>$N喝道：「$n，我们的帐还没算完，看招！」</HIW>",
    "<HIW>$N喝道：「$n，看招！」</HIW>"];

const guard_msg = [
    "<CYN>$N注视著$n的行动，企图寻找机会出手。\n</CYN>",
    "<CYN>$N正盯著$n的一举一动，随时准备发动攻势。\n</CYN>",
    "<CYN>$N缓缓地移动脚步，想要找出$n的破绽。\n</CYN>",
    "<CYN>$N目不转睛地盯著$n的动作，寻找进攻的最佳时机。\n</CYN>",
    "<CYN>$N慢慢地移动著脚步，伺机出手。\n</CYN>",
];

const status_msg = [
    "($N<HIG>看起来充满活力，一点也不累。</HIG>)\n",
    "($N<HIG>似乎有些疲惫，但是仍然十分有活力。</HIG>)\n",
    "($N<HIY>看起来可能有些累了。</HIY>)\n",
    "($N<HIY>动作似乎开始有点不太灵光，但是仍然有条不紊。</HIY>)\n",
    "($N<HIY>气喘嘘嘘，看起来状况并不太好。</HIY>)\n",
    "($N<RED>似乎十分疲惫，看来需要好好休息了。</RED>)\n",
    "($N<RED>已经一副头重脚轻的模样，正在勉力支撑著不倒下去。</RED>)\n",
    "($N<RED>看起来已经力不从心了。</RED>)\n",
    "($N<HIR>摇头晃脑、歪歪斜斜地站都站不稳，眼看就要倒在地上。</HIR>)\n",
    "($N<HIR>已经陷入半昏迷状态，随时都可能摔倒晕去。</HIR>)\n"
];

/**
 * 查询血量状态消息
 * @param {number} hp
 * @param {number} maxhp
 * @returns {string}
 */
function query_status_msg(hp, maxhp) {
    var ratio = parseInt(hp * 10 / maxhp);
    if (ratio < 0) ratio = 0;
    if (ratio > 9) ratio = 9;
    return status_msg[9 - ratio];
}

/** @param {string} msg @param {number} damage @param {boolean} iscrit */
function damage_msg2(msg, damage, iscrit) {
    return msg + "\n$N对$n造成" + (iscrit ? ("<hir>" + damage + "</hir>点暴击伤害") : ("<wht>" + damage + "</wht>点伤害"));
}

/**
 * @param {number} damage
 * @param {string} type
 * @param {CHARACTER} ob
 * @param {boolean} iscrit
 * @param {string} [msg]
 * @returns {string}
 */
function damage_msg(damage, type, ob, iscrit, msg) {
    if (msg) {
        return msg + "\n$N对$n造成" + (iscrit ? ("<hir>" + damage + "</hir>点暴击伤害") : ("<wht>" + damage + "</wht>点伤害"));
    }

    if (damage === 0) return "结果没有造成任何伤害。";
    var sh = iscrit ? "<hir>" + damage + "</hir>点暴击伤害" : "<wht>" + damage + "</wht>点伤害";
    if (ob.hp > 0) {
        damage = damage * 100 / ob.hp;
    } else
        damage = 120;
    switch (type) {
        case WEAPON_TYPE.BLADE:
        case WEAPON_TYPE.WHIP:
            if (damage < 5) return "结果只是轻轻地划破$p的皮肉，造成" + sh + "。";
            else if (damage < 10) return "结果在$p$l划出一道细长的血痕，造成" + sh + "！";
            else if (damage < 20) return "结果「嗤」地一声划出一道伤口，造成" + sh + "！";
            else if (damage < 40) return "结果「嗤」地一声划出一道血淋淋的伤口，造成" + sh + "！";
            else if (damage < 80) return "结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$w已在$p$l划出一道深及见骨的可怕伤口，造成" + sh + "！！";
        case WEAPON_TYPE.SWORD:
            if (damage < 10) return "结果只是轻轻地刺破$p的皮肉，造成" + sh + "！";
            else if (damage < 20) return "结果在$p$l刺出一个创口，造成" + sh + "！";
            else if (damage < 40) return "结果「噗」地一声刺入了$n$l寸许，造成" + sh + "！";
            else if (damage < 60) return "结果「噗」地一声刺进$n的$l，使$p不由自主地退了几步，造成" + sh + "！";
            else if (damage < 80) return "结果「噗嗤」地一声，$w已在$p$l刺出一个血肉模糊的血窟窿，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$w已在$p的$l对穿而出，鲜血溅得满地，造成" + sh + "！！";
        case WEAPON_TYPE.NONE:
        case WEAPON_TYPE.STAFF:
        case WEAPON_TYPE.CLUB:
            if (damage < 5) return "结果只是轻轻地碰到，比拍苍蝇稍微重了点，造成" + sh + "！";
            else if (damage < 10) return "结果在$p的$l造成一处瘀青，造成" + sh + "！";
            else if (damage < 25) return "结果一击命中，$n的$l登时肿了一块老高，造成" + sh + "！";
            else if (damage < 40) return "结果一击命中，$n闷哼了一声显然吃了不小的亏，造成" + sh + "！";
            else if (damage < 50) return "结果「砰」地一声，$n退了两步，造成" + sh + "！";
            else if (damage < 60) return "结果这一下「砰」地一声打得$n连退了好几步，差一点摔倒，造成" + sh + "！";
            else if (damage < 80) return "结果重重地击中，$n「哇」地一声吐出一口鲜血，造成" + sh + "！";
            else return "结果只听见「砰」地一声巨响，$n像一捆稻草般飞了出去，造成" + sh + "！！";
        case "force":
            if (damage < 10) return "结果只是把$n打得退了半步，毫发无损，造成" + sh + "！";
            else if (damage < 20) return "结果$n痛哼一声，在$p的$l造成一处瘀伤，造成" + sh + "！";
            else if (damage < 30) return "结果一击命中，把$n打得痛得弯下腰去，造成" + sh + "！";
            else if (damage < 40) return "结果$n闷哼了一声，脸上一阵青一阵白，显然受了点内伤，造成" + sh + "！";
            else if (damage < 60) return "结果$n脸色一下变得惨白，昏昏沉沉接连退了好几步，造成" + sh + "！";
            else if (damage < 75) return "结果重重地击中，$n「哇」地一声吐出一口鲜血，造成" + sh + "！";
            else if (damage < 90) return "结果「轰」地一声，$n全身气血倒流，口中鲜血狂喷而出，造成" + sh + "！";
            else return "结果只听见几声喀喀轻响，$n一声惨叫，像滩软泥般塌了下去，造成" + sh + "！！";

        case WEAPON_TYPE.THROWING:
            if (damage < 5) return "结果只是轻轻地划破$p的皮肉，造成" + sh + "。";
            else if (damage < 10) return "结果在$p$l划出一道细长的血痕，造成" + sh + "！";
            else if (damage < 20) return "结果「嗤」地一声划出一道伤口，造成" + sh + "！";
            else if (damage < 40) return "结果「嗤」地一声划出一道血淋淋的伤口，造成" + sh + "！";
            else if (damage < 80) return "结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$T已在$p$l划出一道深及见骨的可怕伤口，造成" + sh + "！！";
        default:
            return "<wht>结果造成" + sh + "。</wht>";
    }
}

// ============ 移动相关辅助 ============

var dirs = {
    "north": "北方",
    "south": "南方",
    "east": "东方",
    "west": "西方",
    "northup": "北边",
    "southup": "南边",
    "eastup": "东边",
    "westup": "西边",
    "northdown": "北边",
    "southdown": "南边",
    "eastdown": "东边",
    "westdown": "西边",
    "northeast": "东北",
    "northwest": "西北",
    "southeast": "东南",
    "southwest": "西南",
    "up": "上",
    "down": "下",
    "enter": "里",
    "out": "外"
};

/**
 * 生成离开房间的消息文本
 * @param {CHARACTER} player - 离开的角色
 * @param {string} dir - 方向名称
 * @returns {string}
 */
function sendOutMessage(player, dir) {
    dir = dirs[dir] || "";
    if (player.is_fighting()) {
        return player.name + "往" + dir + "落荒而逃了。";
    }
    var eq = player.hp * 100 / player.max_hp;
    if (eq < 5) {
        return player.name + "撑起满是<HIR>鲜血</HIR>的躯体，一瘸一拐地朝" + dir + "挪去。";
    } else if (eq < 10) {
        return player.name + "一边擦着嘴角的<HIR>鲜血</HIR>，一边朝" + dir + "走去。";
    } else if (eq < 30) {
        return player.name + "灰头土脸、狼狈不堪地向" + dir + "离去。";
    } else if (eq < 50) {
        return player.name + "一声不吭的转身朝" + dir + "走去，脸色好像有些难看。";
    }
    return player.name + "往" + dir + "离开。";
}

/**
 * 生成进入房间的消息文本
 * @param {CHARACTER} player - 进入的角色
 * @param {string} dir - 方向名称
 * @returns {string}
 */
function sendInMessage(player, dir) {
    if (player.fight_type) {
        return player.name + "跌跌撞撞地跑了过来，模样有些狼狈。";
    }
    var eq = player.hp * 100 / player.max_hp;
    if (eq < 5) {
        return player.name + "撑着满是<HIR>鲜血</HIR>的躯体，一瘸一拐地挪了过来。";
    } else if (eq < 10) {
        return player.name + "一边擦着嘴角的<HIR>鲜血</HIR>，一边走了过来，龇牙咧嘴的。";
    } else if (eq < 30) {
        return player.name + "灰头土脸、狼狈不堪地走了过来。";
    } else if (eq < 50) {
        return player.name + "像斗败了的公鸡，垂头丧气地走了过来。";
    }
    return player.name + "走了过来。";
}

// ============ 显示相关辅助 ============

/** @type {string[]} 等级称号 */
const level_descs = ["普通百姓", "武士", "武师", "宗师", "武圣", "武帝", "武神"];
/** @type {string[]} 等级颜色 */
const level_color = ["", "wht", "hig", "hiy", "hiz", "hio", "ord"];

function get_perdesc(obj) {
    const ary = obj.gender === 1 ? boy_pers : girl_pers;
    let per = obj.per + obj.query_prop("per");
    let index = parseInt(per / 2);
    if (index < 0) index = 0;
    if (index >= ary.length) index = ary.length - 1;
    return ary[index];
}

function get_agestr(age) {
    let index = parseInt((age || 10) / 10);
    if (index >= age_strs.length) index = age_strs.length - 1;
    return age_strs[index];
}

function get_skill_desc(level) {
    if (!level) return "看上去似乎不会任何武功。";

    if (level < 1000)
        return "的武功看上去似乎" + skill_levels[parseInt(level / 50)];
    let v = parseInt((level - 1000) / 500);
    if (v > 6) v = 6;
    return "的武功看上去似乎" + skill_levels[v + 20];
}

function get_status(obj) {
    let p = parseInt(obj.hp * 10 / obj.max_hp);
    if (p < 0) p = 0;
    if (p >= Look_status.length) p = Look_status.length - 1;
    return Look_status[p];
}

/** @type {string[]} 男性容貌描述 */
const boy_pers = [
    "<BLU>眉歪眼斜，瘌头癣脚，不象人样</BLU>",
    "<BLU>呲牙咧嘴，黑如锅底，奇丑无比</BLU>",
    "<BLU>面如桔皮，头肿如猪，让人不想再看第二眼</BLU>",
    "<HIB>贼眉鼠眼，身高三尺，宛若猴状</HIB>",
    "<HIB>肥头大耳，腹圆如鼓，手脚短粗，令人发笑</HIB>",
    "<NOR>面颊凹陷，瘦骨伶仃，可怜可叹</NOR>",
    "<NOR>傻头傻脑，痴痴憨憨，看来倒也老实</NOR>",
    "<NOR>相貌平平，不会给人留下什么印象</NOR>",
    "<YEL>膀大腰圆，满脸横肉，恶形恶相</YEL>",
    "<YEL>腰圆背厚，面阔口方，骨格不凡</YEL>",
    "<RED>眉目清秀，端正大方，一表人才</RED>",
    "<RED>双眼光华莹润，透出摄人心魄的光芒</RED>",
    "<HIY>举动如行云游水，独蕴风情，吸引所有异性目光</HIY>",
    "<HIY>双目如星，眉梢传情，所见者无不为之心动</HIY>",
    "<HIR>粉面朱唇，身姿俊俏，举止风流无限</HIR>",
    "<HIR>丰神如玉，目似朗星，令人过目难忘</HIR>",
    "<MAG>面如美玉，粉妆玉琢，俊美不凡</MAG>",
    "<MAG>飘逸出尘，潇洒绝伦</MAG>",
    "<MAG>丰神俊朗，长身玉立，宛如玉树临风</MAG>",
    "<HIM>神清气爽，骨格清奇，宛若仙人</HIM>",
    "<HIM>一派神人气度，仙风道骨，举止出尘</HIM>"
];

/** @type {string[]} 女性容貌描述 */
const girl_pers = [
    "<BLU>丑如无盐，状如夜叉</BLU>",
    "<BLU>歪鼻斜眼，脸色灰败，直如鬼怪一般</BLU>",
    "<BLU>八字眉，三角眼，鸡皮黄发，让人一见就想吐</BLU>",
    "<HIB>眼小如豆，眉毛稀疏，手如猴爪，不成人样</HIB>",
    "<HIB>一嘴大暴牙，让人一看就没好感</HIB>",
    "<NOR>满脸疙瘩，皮色粗黑，丑陋不堪</NOR>",
    "<NOR>干黄枯瘦，脸色腊黄，毫无女人味</NOR>",
    "<YEL>身材瘦小，肌肤无光，两眼无神</YEL>",
    "<YEL>虽不标致，倒也白净，有些动人之处</YEL>",
    "<RED>肌肤微丰，雅淡温宛，清新可人</RED>",
    "<RED>鲜艳妍媚，肌肤莹透，引人遐思</RED>",
    "<HIR>娇小玲珑，宛如飞燕再世，楚楚动人</HIR>",
    "<HIR>腮凝新荔，肌肤胜雪，目若秋水</HIR>",
    "<HIW>粉嫩白至，如芍药笼烟，雾里看花</HIW>",
    "<HIW>丰胸细腰，妖娆多姿，让人一看就心跳不已</HIW>",
    "<MAG>娇若春花，媚如秋月，真的能沉鱼落雁</MAG>",
    "<MAG>眉目如画，肌肤胜雪，真可谓闭月羞花</MAG>",
    "<MAG>气质美如兰，才华馥比山，令人见之忘俗</MAG>",
    "<HIM>灿若明霞，宝润如玉，恍如神妃仙子</HIM>",
    "<HIM>美若天仙，不沾一丝烟尘</HIM>",
    "<HIM>宛如<HIW>玉雕冰塑</HIW>，似梦似幻，已不再是凡间人物</HIM>"
];

/** @type {string[]} 气血状态描述 */
const Look_status = [
    "<HIR>受伤过重，已经有如风中残烛，随时都可能断气。</HIR>",
    "<HIR>受伤过重，已经奄奄一息，命在旦夕了。</HIR>",
    "<HIR>伤重之下已经难以支撑，眼看就要倒在地上。</HIR>",
    "<RED>受了相当重的伤，只怕会有生命危险。</RED>",
    "<RED>已经伤痕累累，正在勉力支撑著不倒下去。</RED>",
    "<RED>气息粗重，动作开始散乱，看来所受的伤著实不轻。</RED>",
    "<HIY>受伤不轻，看起来状况并不太好。</HIY>",
    "<HIY>受了几处伤，不过似乎并不碍事。</HIY>",
    "<HIY>看起来可能受了点轻伤。</HIY>",
    "<HIG>似乎受了点轻伤，不过光从外表看不大出来。</HIG>",
    "<HIG>看起来气血充盈，并没有受伤。</HIG>"
];

/** @type {string[]} 年龄段描述 */
const age_strs = ["几", "十多", "二十多", "三十多", "四十多", "五十多", "六十多", "七十多", "八十多", "九十多"
    , "一百多"];

/** @type {string[]} 武功等级描述 */
const skill_levels = [
    "<BLU>初学乍练</BLU>",
    "<BLU>不知所以</BLU>",
    "<HIB>粗通皮毛</HIB>",
    "<HIB>渐有所悟</HIB>",
    "<YEL>半生不熟</YEL>",
    "<YEL>马马虎虎</YEL>",
    "<HIY>平淡无奇</HIY>",
    "<HIY>触类旁通</HIY>",
    "<HIG>心领神会</HIG>",
    "<HIG>挥洒自如</HIG>",
    "<HIC>驾轻就熟</HIC>",
    "<HIC>出类拔萃</HIC>",
    "<CYN>初入佳境</CYN>",
    "<CYN>神乎其技</CYN>",
    "<MAG>威不可当</MAG>",
    "<HIW>豁然贯通</HIW>",
    "<HIW>超群绝伦</HIW>",
    "<RED>登峰造极</RED>",
    "<WHT>登堂入室</WHT>",
    "<HIM>一代宗师</HIM>",
    "<WHT>超凡入圣</WHT>",
    "<HIO>出神入化</HIO>",
    "<HIO>独步天下</HIO>",
    "<HIR>空前绝后</HIR>",
    "<HIR>旷古绝伦</HIR>",
    "<HIW>深不可测</HIW>",
    "<HIW>返璞归真</HIW>"];

// ============ 战斗相关辅助 ============

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

/** @type {Object<string, boolean>} 需要武器的技能类型 */
const WEAPON_TYPES = {
    "sword": true,
    "blade": true,
    "staff": true,
    "club": true,
    "whip": true
}

