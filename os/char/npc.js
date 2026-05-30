/**
 * NPC 非玩家角色类
 */
import { CHARACTER } from "./character.js";
import { ROOM } from "../room/room.js";
import { OBJ } from "../item/obj.js";
import { WORLD } from "../world.js";
import { BASE } from "../base.js";
import { EQUIPMENT } from "../item/equipment.js";

export class NPC extends CHARACTER {

    /**
     * @param {NPC} obj - 要初始化的NPC实例
     */

    // ============ 核心属性 ============

    /** @type {boolean} 是否自动释放绝招 */
    auto_pfm = true;
    /** @type {string} NPC名称 */
    name;
    /** @type {number} NPC等级 */
    level = 0;
    /** @type {string} NPC描述 */
    desc;

    // ============ 功能属性 ============

    /** @type {string[]|null} 闲聊消息列表 */
    chat_msg = null;
    /** @type {number} 闲聊触发概率(百分比) */
    chat_chance = 0;
    /** @type {OBJ[]|null} 出售物品列表 */
    sell_list = null;
    // json 从 ITEM 继承(string|null), NPC用JSON.stringify()写入字符串
    /** @type {ROOM|null} 死亡后重生房间 */
    die_room = null;
    /** @type {boolean} 是否禁止刷新(不重生) */
    no_refresh = false;
    /** @type {number} 击杀奖励积分 */
    score = 0;
    /** @type {string|null} 任务主人ID */
    master = null;
    /** @type {Object<string, Function>|null} 对话问题 */
    question = null;

    /**
     * 设置询问回调
     * @param {string} name - 询问关键词
     * @param {(me: CHARACTER) => void} func - 回调函数
     */
    set_ask(name, func) {
        if (!this.question) this.question = {};
        this.question[name] = func;
    }

    /**
     * 处理询问
     * @param {CHARACTER} me - 询问者
     * @param {string} par - 询问内容
     * @returns {void|false}
     */
    on_ask(me, par) {
        if (!this.question) return;
        var item = this.question[par];
        if (!item) return;
        return item.call(this, me);
    }

    /** @type {boolean} 禁止战斗标识 */
    no_fight = false;

    // ============ 回调函数(由资源文件设置) — getter形式避免class field遮蔽子类方法 ============

    /** @type {((me: USER) => CHARACTER|false|void)|null} 查找师傅回调 — bai.js:38 检查 ==false 拒绝拜师 */
    get on_master() { return undefined; }
    /** @type {((me: CHARACTER) => boolean|void)|null} 检查技能回调 — checkskill.js:35只传1参, skill参数实际未使用 */
    get on_checkskill() { return undefined; }
    /** @type {((me: CHARACTER, target: CHARACTER) => void)|null} 绝招回调 — 暂未被调用, 由资源文件设置 */
    get on_pfm() { return undefined; }
    /**
     * 双修回调 — 资源文件覆写
     * @param {USER} me
     */
    on_makelove(me) { return undefined; }
    /**
     * 主人进入回调 — 资源文件覆写
     * @param {USER} me
     */
    on_master_enter(me) { return undefined; }
    /**
     * 玩家离开回调, 玩家与npc在同一房间玩家要离开时触发 — 资源文件覆写
     * @param {USER} me
     * @param {string} dir - 离开方向
     */
    on_leave(me, dir) { return undefined; }

    // ============ 由mixin提供的多态方法(见文件末尾writable定义) ============

    constructor() {
        super();
    }

    /**
     * 设置闲聊消息
     * @param {string[]} items - 消息列表
     * @param {number} [chance] - 触发概率
     */
    set_chat_msg(items, chance) {
        if (items) {
            this.chat_msg = items;
        }
    }

    /** 随机发送闲聊消息 */
    do_chat_msg() {
        if (!this.is_fighting() && this.is_living && this.chat_msg) {
            this.do_say(this.chat_msg.random());
        }
    }

    /**
     * 格式化装备显示
     * @param {string} call3 - 第三人称代词
     * @param {string[]} str - 输出数组
     * @param {string} [eqcmd] - 查看命令前缀
     */
    format_equipments(call3, str, eqcmd) {
        if (this.equipment && this.equipment.length) {
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
        str.push(call3, "穿着一件<wht>布衣</wht>。\n");
    }

    /**
     * 设置出售物品列表
     * @param {...string} arguments - 物品路径列表
     */
    set_goods() {
        if (!arguments.length) return;
        this.sell_list = [];
        for (let i = 0; i < arguments.length; i++) {
            const item = arguments[i];
            const obj = OBJ.CREATE(item);
            if (!obj) continue;
            obj.count = -1;
            this.sell_list.push(obj);
        }
    }

    /**
     * 查询操作命令JSON(缓存)
     * @param {CHARACTER} [player] - 观察者
     * @returns {string}
     */
    query_commands(player) {

        if (this.json) return this.json;

        this.json = this.query_commands_json(player, false);
        return this.json;
    }

    /**
     * 构建操作命令JSON
     * @param {CHARACTER} player - 观察者
     * @param {boolean} isyb - 是否元宝商人
     * @returns {string} JSON字符串
     */
    query_commands_json(player, isyb) {
        const json = {};
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
            for (let cmd in this.question) {
                json.commands.push({
                    cmd: "ask " + this.id + " about " + cmd,
                    name: "询问" + cmd
                });
            }
        }
        if (this.actions) {
            for (let cmd in this.actions) {
                if (!this.actions[cmd].name) continue;
                json.commands.push({
                    cmd: cmd + " " + this.id,
                    name: this.actions[cmd].name
                });
            }
        }
        return JSON.stringify(json);
    }

    /**
     * 更新房间内交互命令
     * @param {Object<string, {name: string, action: function}>} acts
     */
    update_action(acts) {
        this.json = null;
        this.actions = acts;
    }

    /**
     * NPC死亡处理
     * @param {CHARACTER} killer - 击杀者
     * @returns {boolean|undefined}
     */
    die(killer) {
        if (!this.environment) return;
        if (this.on_die && this.on_die(killer) == false) {
            this.hp = 1;
            return false;
        }
        this.hp = 0;
        this.clear_status();
        this.send_room(DIE_MSG.random());
        this.clear_follow();
        const corpse = new CORPSE();

        const isinfb = this.environment.is_fb();
        corpse.init(this, isinfb);
        this.die_room = this.environment;
        this.environment.item_changed(corpse, true);
        this.environment.item_changed(this, false);
        if (isinfb && this.score && killer && killer.add_fbscore) {
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

    /** NPC复活刷新 */
    relive() {
        if (!this.die_room) return;
        const room = ROOM.Get(this.die_room.path);
        let obj = room.find_obj_bypath(this.path);
        if (obj) return;
        obj = NPC.CLONE(this.path);
        room.item_changed(obj, true);
        this.die_room = null;
        this.equipment = null;
        this.items = null;
        this.skills = null;
    }

    /**
     * 销毁NPC
     * @param {string} [msg] - 离开消息
     */
    destroy(msg) {
        if (this.environment) {
            this.environment.item_changed(this, false, msg);
        }
        this.clear_follow();

    }

    /**
     * NPC心跳处理
     * @param {number} dt - 当前时间戳
     */
    heart_beat(dt) {

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
            const eny = this.query_enemy();
            if (!eny) {
                this.hp = 1;
                this.fight_type = 0;
            }
        }

    }



    /**
     * 创建NPC实例到指定环境 — 6处调用均为ROOM, 无CHARACTER调用者
     * @param {string} path - NPC模板路径
     * @param {ROOM} env - 目标房间
     * @param {((npc: NPC) => void)} [oncreate] - 创建后回调
     * @param {number} [count=1] - 创建数量
     * @returns {NPC}
     */
    static CREATE(path, env, oncreate, count) {
        if (!path || !env) return;

        count = count || 1;
        let obj = null;
        for (let i = 0; i < count; i++) {
            obj = NPC.CLONE(path);
            env.item_changed(obj, true);
            if (oncreate) oncreate(obj);
        }
        return obj;
    }

    /**
     * 克隆NPC实例
     * @param {string} path - NPC模板路径
     * @returns {NPC}
     */
    static CLONE(path) {
        const base = NPC.GET(path);
        const item = Object.create(base);
        item.clone();
        return item;
    }

    /**
     * 获取NPC模板(带缓存)
     * @param {string} path - NPC模板路径
     * @returns {NPC}
     */
    static GET(path) {
        let base = WORLD.NPC_STROE.get(path);
        if (!base) {
            base = BASE.CREATE(__PATH.NPC, path);
            if (!base) throw new Error('没有人物' + path + "的定义。");
        }
        return base;
    }
    /**
     * 发言 — NPC闲聊时调用, 默认空实现由资源文件覆写
     * @param {string} [msg] - 闲聊消息
     * @returns {void}
     */
    do_say(msg) { return undefined; }
}

/** @type {string[]} NPC死亡消息 */
const DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];

