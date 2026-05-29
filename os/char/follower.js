/**
 * FOLLOWER 随从类 - 玩家的跟随者/NPC伙伴
 */
import "../util/util.js";
import { CHARACTER } from "./character.js";
import { USER } from "./user.js";
import { NPC } from "./npc.js";
import { FAMILIES } from "../skill/family.js";
import { CORPSE } from "../item/corpse.js";
import { ROOM } from "../room/room.js";
import { UTIL } from "../util/util.js";
import { OBJ } from "../item/obj.js";

export class FOLLOWER extends CHARACTER {

    /**
     * @param {FOLLOWER} obj - 要初始化的随从实例
     */
    static __initInstance(obj) {
        /** @type {number} */
        obj.hp = obj.max_hp = 100;
        /** @type {number} */
        obj.mp = obj.max_mp = 100;
        /** @type {number} */
        obj.str = obj.con = obj.dex = obj.int = obj.per = obj.age = 20;
        /** @type {FAMILY} */
        obj.family = FAMILIES.NONE;
        /** @type {boolean} */
        obj.auto_pfm = true;
        /** @type {string|null} */
        obj.master = null;
        /** @type {number} */
        obj.level = 3;
        /** @type {string|null} */
        obj.master_name = null;
        /** @type {number} */
        obj.max_item_count = 10;
        /** @type {Object} */
        obj.settings = {
            auto_kill: 1,
            auto_dice: 1
        };
    }

    constructor() {
        super();
        FOLLOWER.__initInstance(this);
    }

    /**
     * 查询随从设置
     * @param {string} name
     * @returns {number}
     */
    query_setting(name) {
        if (!this.settings) return 0;
        return this.settings[name] || 0;
    }

    /**
     * 设置随从配置
     * @param {string} name
     * @param {string|number} value
     */
    set_setting(name, value) {
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
     * 发送消息(代为翻译人称)
     * @param {string} text
     */
    send(text) {
        if (this.listener) {
            text = text.replace('你', this.name);
            this.listener.send(text);
        }
    }

    /**
     * 通知失败
     * @param {string} text
     * @returns {boolean} false
     */
    notify_fail(text) {
        this.send(text);
        return false;
    }

    /**
     * 通知消息
     * @param {string} text
     */
    notify(text) {
        this.send(text);
    }

    /**
     * 设置消息监听者
     * @param {CHARACTER} me - 消息触发者(主人)
     * @param {USER} target - 监听目标
     */
    set_listener(me, target) {
        if (me.id == this.master) this.listener = target;
    }

    /** @type {Map<string, FOLLOWER>} 随从存储 */
    static STORES = new Map();

    /**
     * 清除所有随从
     * @param {USER} me
     */
    static CLEAR(me) {
        if (!me.follower) return;
        for (let i = 0; i < me.follower.length; i++) {
            const npc = FOLLOWER.STORES.get(me.id + "_" + me.follower[i].id);
            if (npc) {
                FOLLOWER.STORES.delete(me.id + "_" + me.follower[i].id);
                npc.set_state(null);
                npc.environment && npc.environment.item_changed(npc, false);
                npc.clear_status();
            }
        }
    }

    /**
     * 重置随从(不出现在当前场景)
     * @param {USER} me
     */
    static RESET(me) {
        if (!me.follower) return;
        for (let i = 0; i < me.follower.length; i++) {
            const npc = FOLLOWER.STORES.get(me.id + "_" + me.follower[i].id);
            if (npc) {
                npc.set_state(null);
                npc.environment && npc.environment.item_changed(npc, false);
            }
        }
    }

    /**
     * 从用户数据初始化随从
     * @param {USER} me
     * @param {Array<{id: string, path: string}>} datas
     */
    static INIT_FROM_USER(me, datas) {

        for (let j = 0; j < datas.length; j++) {
            const data = datas[j];
            let my_npc = FOLLOWER.STORES.get(me.id + "_" + data.id);
            if (my_npc) continue;
            if (!datas[j].id) continue;
            my_npc = new FOLLOWER();
            const obj = NPC.CLONE(data.path);
            for (let i = 0; i < SAVE_NUMPROP.length; i++) {
                my_npc[SAVE_NUMPROP[i]] = data.prop[i] || 0;
            }
            for (let i = 0; i < SAVE_STRPROP.length; i++) {
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

    /**
     * 初始化单个随从
     * @param {USER} me
     * @param {{path: string, id: string}} par
     * @returns {FOLLOWER|undefined}
     */
    static INIT(me, par) {
        if (!par || !par.path) return;
        let npc;
        const id = me.id + "_" + par.id;
        if (par.id) {
            npc = FOLLOWER.STORES.get(id);
            if (npc) return npc;
        }
        const obj = NPC.CLONE(par.path);
        if (!obj) return;
        npc = new FOLLOWER();
        for (let i = 0; i < SAVE_NUMPROP.length; i++) {
            npc[SAVE_NUMPROP[i]] = obj[SAVE_NUMPROP[i]] || 0;
        }
        for (let i = 0; i < SAVE_STRPROP.length; i++) {
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

    /**
     * 替换随从(版本更新)
     * @param {USER} me
     * @param {FOLLOWER} old - 旧随从
     * @param {NPC} npc - 新NPC模板
     */
    static REPLACE(me, old, npc) {
        if (!old || !npc) return;
        const copys = ["str", "con", "dex", "int", "gender", "kar", "per", "name", "title", "desc", "on_master_learn", "on_master_enter"];
        for (let i = 0; i < copys.length; i++) {
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
            for (let i = 0; i < npc.items.length; i++) {
                old.items.push(npc.items[i]);
            }
            npc.items.length = 0;
        }

        for (let sk in npc.skills) {
            const oldSkill = old.skills[sk];
            if (oldSkill && oldSkill.addin && oldSkill.addin.length)
                continue;
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
            for (let j = old.status.length - 1; j >= 0; j--) {
                const item = old.status[j];
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
        for (let i = 0; i < me.follower.length; i++) {
            if (me.follower[i].id == old.id) {
                me.follower[i].path = npc.path;
                break;
            }
        }
    }

    /**
     * 获取随从
     * @param {USER} me
     * @param {{id: string}} par
     * @returns {FOLLOWER|undefined}
     */
    static GET(me, par) {
        const id = me.id + "_" + par.id;
        return FOLLOWER.STORES.get(id);
    }

    /**
     * 创建随从
     * @param {USER} me
     * @param {{path: string, id: string}} par
     * @param {function(FOLLOWER)} callback
     */
    static CREATE(me, par, callback) {
        if (!par || !par.path) return;
        const id = me.id + "_" + par.id;
        const npc = FOLLOWER.STORES.get(id);
        if (npc) return callback(npc);

    }

    /**
     * 序列化随从数据
     * @param {USER} me
     * @returns {string}
     */
    save(me) {
        const str = ["prop:["];
        for (let i = 0; i < SAVE_NUMPROP.length; i++) {
            str.push(this[SAVE_NUMPROP[i]] || 0);
            str.push(",");
        }
        str.push("0],");
        const items = this.items || [];
        str.push("items:[");
        if (items) {
            for (let i = 0; i < items.length; i++) {
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
            for (let i = 0; i < this.equipment.length; i++) {
                if (i > 0) str.push(",");
                if (this.equipment[i]) this.equipment[i].save_db(str);
                else str.push("null");
            }
            str.push("]");
        }
        return str.join("");
    }

    /**
     * 保存所有随从数据
     * @param {USER} me
     * @returns {string} JSON字符串
     */
    static SAVE(me) {
        if (!me.follower) return "[]";
        const str = ["["];
        for (let i = 0; i < me.follower.length; i++) {
            const item = me.follower[i];
            if (str.length > 1) str.push(",");
            str.push('{path:"');
            str.push(me.follower[i].path);
            str.push('",id:"');
            str.push(me.follower[i].id);
            str.push('"');
            const npc = FOLLOWER.STORES.get(me.id + "_" + item.id);
            if (npc) {
                str.push(",");
                str.push(npc.save(me));
            }
            str.push('}');

        }
        str.push("]");
        return str.join("");
    }

    /**
     * 随从死亡
     * @param {CHARACTER} killer
     * @returns {boolean|undefined}
     */
    die(killer) {
        if (!this.environment) return;
        if (this.on_die && this.on_die(killer) == false) {
            this.hp = 1;
            return false;
        }
        this.clear_status();
        this.send_room(DIE_MSG.random());
        const corpse = new CORPSE();
        corpse.init(this, false);
        this.environment.item_changed(corpse, true);
        this.environment.item_changed(this, false);
        this.environment = null;
    }

    /**
     * 随从心跳
     * @param {number} dt
     */
    heart_beat(dt) {
        if (!this.hp) return;
        if (!this.fight_type) {
            if (this.hp < this.max_hp) {
                this.add_hp(parseInt(this.max_hp / 3));
            }
            if (this.mp < this.max_mp) {
                this.add_mp(parseInt(this.max_mp / 3));
            }
            if (this.chat_msg) {
                const r = this.random(10);
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

    /**
     * 设置随从状态
     * @param {*} state
     * @param {boolean} [isauto]
     */
    set_state(state, isauto) {
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

    /**
     * 查询主人专用命令列表
     * @returns {string} JSON
     */
    query_mastercommands() {
        if (this.master_json) return this.master_json;
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
            for (let i = 0; i < this.actions.length; i++) {
                json.commands.push({
                    cmd: this.actions[i].cmd,
                    name: this.actions[i].name
                });
            }
        }
        this.master_json = JSON.stringify(json)
        return this.master_json;
    }

    /**
     * 查询命令列表(区分主人/他人)
     * @param {USER} player
     * @returns {string}
     */
    query_commands(player) {
        if (player.id == this.master) {
            return this.query_mastercommands(player);
        }
        if (this.json) return this.json;
        const json = {};
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

    /**
     * 回应询问
     * @param {USER} me
     * @param {string} par - 询问内容
     */
    on_ask(me, par) {
        switch (par) {
            case "主人":
                me.notify(this.name + "说道：我的主人就是" + this.master_name + "呀。");
                break;
        }
    }

    /**
     * 加入队伍回调
     * @param {USER} me
     */
    on_teamin(me) {
        if (!this.team) return;
        for (let i = 0; i < this.team.length; i++) {
            const tm = this.team[i];
            if (this.master == tm.id) {
                this.do_follow(tm);
            }
        }
    }

    /**
     * 离开队伍回调
     * @param {USER} me
     */
    on_teamout(me) {
        if (!this.team) return;
        for (let i = 0; i < this.team.length; i++) {
            const tm = this.team[i];
            if (this.master == tm.id) {
                this.do_follow(null);
                if (this.environment && this.environment.is_fb()) {
                    this.environment.item_changed(this, false, this.name + "离开了。");
                }
            }
        }
    }

    /**
     * 完整显示名称
     * @returns {string}
     */
    long_name() {
        if (this.color_name) return this.color_name;
        const str = [];
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

    /**
     * 主人进入房间回调
     * @param {USER} me
     */
    on_enter(me) {
        if (me.id == this.master) {
            this.on_master_enter && this.on_master_enter(me);
        }
    }

    /**
     * 主人离开房间回调
     * @param {USER} me
     * @param {ROOM} nextrm
     * @returns {boolean}
     */
    on_master_leave(me, nextrm) {
        if (this.state || !this.team || this.team != me.team) return false;
        if (this.hp <= 0) return false;
        if (me.environment === this.environment) return false;

        if (nextrm.is_fb() || nextrm.parent.id == "home") {
            return true;
        }

        return false;
    }
}

/** @type {string[]} 需保存的数值属性 */
const SAVE_NUMPROP = ["str", "con", "dex", "int", "gender", "max_mp", "limit_mp", "exp", "pot", "kar", "per"
    , "hp", "mp", "max_item_count", "money", 'level'];
/** @type {string[]} 需保存的字符串属性 */
const SAVE_STRPROP = ["id", "name", "title", "desc"];

/** @type {string[]} 死亡消息 */
const DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];

globalThis.FOLLOWER = FOLLOWER;
