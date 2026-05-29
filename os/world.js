/**
 * WORLD 全局对象 - 游戏世界核心管理
 */

import "./util/util.js";
import { UTIL } from "./util/util.js";
import { BASE } from "./base.js";
import db from "./util/data.js";
import { USER } from "./char/user.js";
import { NPC } from "./char/npc.js";
import { OBJ } from "./item/obj.js";
import WORLD_DATA from "./data.js";
import USERLOGIN_MODULE from "./login.js";
import LISTENER_MODULE from "./ws.js";
import fs from "fs";

const WORLD = {
    USERS: [],
    COMMANDS: {},
    SKILLS: {},
    ROOMS: {},
    RUN_ROOMS: [],
    DEFAULT_SKILLS: {},
    AREAS: [],
    TASKS: [],
    SYSTEMTASKS: [],
    USER_EVENTS: [],
    OBJ_STROE: new Map(),
    NPC_STROE: new Map(),
    HEARTBEATCOUNT: 0,
    RECEIVED: [],
    LOGS: [],
    SERVERID: 0,
    SERVERS: [],
    CONNECT_COUNT: 0,
    DATA: WORLD_DATA,
    USERLOGIN: USERLOGIN_MODULE,
    DB: db,
    SocketCount: 0,
    LISTENER: LISTENER_MODULE,
    max_connect_count: 1100,
    max_user_count: 5100,
    MESSAGE: {
        stores: new Map(),
        NOTICES: [],

        /** @param {string} toid @param {CHARACTER} from @param {{content: string, time: number, attach?: *, rec?: boolean}} msg */
        pushUserMessage(toid, from, msg) {
            let user = this.stores.get(toid);
            if (!user) {
                user = new Map();
                this.stores.set(toid, user);
            }
            let store = user.get(from.id);
            if (!store) {
                store = { name: from.name, items: [] };
                user.set(from.id, store);
            }
            msg.index = store.items.length;
            store.items.push(msg);
        },

        /** @param {CHARACTER} me @returns {Array} */
        getUserMessages(me) {
            let store = this.stores.get(me.id);
            let newMessages = [];
            if (this.NOTICES.length) {
                let nt = this.NOTICES[this.NOTICES.length - 1];
                newMessages.push({
                    id: "notice",
                    content: nt.content.length > 50 ? nt.content.substring(0, 50) : nt.content,
                    time: nt.time,
                    name: "公告"
                });
            }
            if (store) {
                let diff_time = 24 * 3600000 * 30;
                let now = Date.now();
                store.forEach((x, y) => {
                    let last = x.items[x.items.length - 1];
                    if (last) {
                        if (now - last.time < diff_time)
                            newMessages.push({
                                id: y,
                                name: x.name,
                                content: last.content,
                                time: last.time
                            });
                    }
                });
            }
            return newMessages;
        },

        /** @param {CHARACTER} me @param {string} from @param {number} [count] @returns {Array} */
        getMessageFromID(me, from, count) {
            let items = [];
            if (from !== "notice") {
                let store = this.stores.get(me.id);
                if (!store) return;
                let list = store.get(from);
                if (!list) return items;
                items = list.items;
            } else {
                items = this.NOTICES;
            }
            count = count || 0;
            let ary = [];
            let diff_time = 24 * 3600000 * 30;
            let now = Date.now();
            for (let i = 0; i < 13; i++) {
                let index = items.length - count - i - 1;
                if (index < 0) break;
                if (now - items[index].time < diff_time)
                    ary.push(items[index]);
            }
            return ary;
        },

        /** @param {CHARACTER} me @param {string} from @param {number} index */
        getMessageByIndex(me, from, index) {
            let store = this.stores.get(me.id);
            if (!store) return;
            let list = store.get(from);
            return list && list.items[index];
        },

        /** @returns {string} */
        save() {
            let str = ["["];
            let now = Date.now();
            let diff_time = 24 * 3600000 * 30;
            this.stores.forEach((x, uid) => {
                if (str.length > 1) str.push(",");
                str.push("{id:\"");
                str.push(uid);
                str.push("\",items:[");
                let isReceive = false;
                x.forEach((st, from) => {
                    if (isReceive) str.push(",");
                    str.push("{uid:\"");
                    str.push(from);
                    str.push("\",name:\"");
                    str.push(st.name);
                    str.push("\",items:[");
                    let ishasmsg = false;
                    for (let i = 0; i < st.items.length; i++) {
                        let item = st.items[i];
                        if (now - item.time < diff_time) {
                            if (ishasmsg) str.push(",");
                            str.push("{time:");
                            str.push(item.time);
                            str.push(",content:");
                            str.push(JSON.stringify(item.content));
                            if (item.attach) {
                                str.push(",attach:[");
                                for (let j = 0; j < item.attach.length; j++) {
                                    str.push("{name:\"");
                                    str.push(item.attach[j].name);
                                    str.push("\",obj:\"");
                                    str.push(item.attach[j].obj);
                                    str.push("\",count:");
                                    str.push(item.attach[j].count || 1);
                                    str.push("}");
                                    if (j !== item.attach.length - 1) {
                                        str.push(",");
                                    }
                                }
                                str.push("]");
                                if (item.rec) {
                                    str.push(",rec:true");
                                }
                            }
                            str.push("}");
                            ishasmsg = true;
                        }
                    }
                    str.push("]}");
                    isReceive = true;
                });
                str.push("]}");
            });
            str.push("]");
            return str.join("");
        },

        /** @returns {string} */
        saveNotice() {
            if (this.NOTICES.length > 500) this.NOTICES.splice(0, this.NOTICES.length - 500);
            return JSON.stringify(this.NOTICES);
        },

        /** @param {{notices?: Array, messages?: Array}} data */
        load(data) {
            this.NOTICES = data.notices ?? [];
            let sts = data.messages ?? [];
            if (!sts) return;
            for (let i = 0; i < sts.length; i++) {
                let st = sts[i];
                let user = new Map();
                for (let j = 0; j < st.items.length; j++) {
                    let ust = st.items[j];
                    let obj = {
                        name: ust.name,
                        items: []
                    };
                    for (let k = 0; k < ust.items.length; k++) {
                        let msg = ust.items[k];
                        obj.items.push({
                            content: msg.content,
                            time: msg.time,
                            rec: msg.rec,
                            attach: msg.attach,
                            index: obj.items.length
                        });
                    }
                    user.set(ust.uid, obj);
                }
                this.stores.set(st.id, user);
            }
            console.log("消息数据已加载");
        },
    },
    STATS: {
        TOPS: [],
        EXP: [],
        SCORE: [],
        WEAPON: [],

        /** @param {Array} tops @param {string} [defname] @param {string} [key] @returns {Array} */
        load_tops(tops, defname = '武林高手', key = "") {
            tops = tops ?? new Array(10).fill({ path: "pub/gaoshou1" });
            const ary = [];
            for (let i = 0; i < tops.length; i++) {
                let item = tops[i];
                let npc;
                npc = NPC.CLONE("pub/gaoshou1");
                npc.name = defname;
                if (item.userid) {
                    this.loadTopUser(item, npc);
                } else {
                    npc.score = 10 - i;
                }
                npc.top_index = i + 1;
                npc.id = "top_" + key + "_" + i;
                ary.push(npc);
            }
            return ary;
        },

        /** @param {*} data @param {NPC} npc */
        loadTopUser(data, npc) {
            npc.title = data.title;
            npc.name = data.name;
            for (let i = 0; i < COPY_PROPS.length; i++) {
                npc[COPY_PROPS[i]] = data[COPY_PROPS[i]];
            }
            npc.skills = data.skills;
            if (data.eq) {
                npc.equipment = [];
                for (let i = 0; i < data.eq.length; i++) {
                    let item = data.eq[i];
                    if (!item) continue;
                    let obj = OBJ.CREATE(item[0]);
                    if (!obj) continue;
                    obj.load_db(item);
                    npc.equipment[i] = obj;
                }
            }
            npc.userid = data.userid;
            npc.temp = data.temp;
            npc.clear_prop();
            npc.init();
            npc.recount();
        },

        /** @param {USER} player */
        checkStats(player) {
            this.updateScore(player);
            WORLD.COMMANDS.biwu.checkStats(player);
        },

        /** @param {Array} tops @returns {string} */
        saveTops(tops) {
            let str = ["["];
            for (let i = 0; i < tops.length; i++) {
                let top = tops[i];
                if (top.userid) {
                    str.push("{userid:\"");
                    str.push(top.userid);
                    str.push("\",name:\"");
                    str.push(top.name);
                    str.push("\",title:\"");
                    str.push(top.title);
                    str.push("\"");
                    for (let j = 0; j < COPY_PROPS.length; j++) {
                        str.push(",");
                        str.push(COPY_PROPS[j]);
                        str.push(":");
                        str.push(top[COPY_PROPS[j]]);
                    }
                    if (top.skills) {
                        str.push(",skills:");
                        str.push(JSON.stringify(top.skills));
                    }
                    if (top.equipment) {
                        str.push(",eq:[");
                        for (let j = 0; j < top.equipment.length; j++) {
                            if (j > 0) str.push(",");
                            if (top.equipment[j]) top.equipment[j].save_db(str);
                            else str.push("null");
                        }
                        str.push("]");
                    }
                    if (top.temp) {
                        str.push(",temp:", JSON.stringify(top.temp));
                    }
                    str.push("}");
                } else {
                    str.push('{ path: "pub/gaoshou1"}');
                }
                if (i !== this.TOPS.length - 1) str.push(",");
            }
            str.push("]");
            return str.join("");
        },

        /** @returns {string} */
        saveWeapon() {
            return JSON.stringify(this.WEAPON);
        },

        /** @returns {string} */
        saveScore() {
            return JSON.stringify(this.SCORE);
        },

        /** @param {USER} me @param {EQUIPMENT} wea @param {Array} ary */
        updateEqitem(me, wea, ary) {
            let score = wea.query_score();
            if (!score) return;
            let cur_index = -1;
            let new_index = -1;
            for (let i = ary.length - 1; i >= 0; i--) {
                let item = ary[i];
                if (item.user === me.id) {
                    if (wea.id === item.id || score > item.score) {
                        cur_index = i;
                    } else {
                        return;
                    }
                }
                if (score > item.score) {
                    new_index = i;
                }
            }
            if (cur_index === -1 && new_index === -1) return;

            if (cur_index === -1) {
                let item = {
                    id: wea.id,
                    user: me.id,
                    score: score,
                    name: me.name,
                    desc: wea.get_desc(me),
                    wname: wea.color_name
                };
                ary.splice(new_index, 0, item);
                if (ary.length > 15)
                    ary.length = 15;
                return item;
            }

            let item = ary[cur_index];
            item.wname = wea.color_name;
            item.desc = wea.get_desc(me);
            item.id = wea.id;
            item.user = me.id;
            item.name = me.name;
            item.score = score;
            if (cur_index === new_index
                || new_index - cur_index === 1) {
                return item;
            }
            if (new_index === -1) {
                ary.splice(cur_index, 1);
                ary.push(item);
            } else if (cur_index > new_index) {
                ary.splice(cur_index, 1);
                ary.splice(new_index, 0, item);
            } else {
                ary.splice(new_index, 0, item);
                ary.splice(cur_index, 1);
            }
        },

        /** @param {USER} me @param {EQUIPMENT} wea */
        updateWeapon(me, wea) {
            if (!WORLD.is_server(me)) return;
            let eqs = this.EQ_STATS[wea.eq_type];
            this.updateEqitem(me, wea, eqs);
        },

        /** @param {USER} me @param {Array} ary */
        updateScoreItem(me, ary) {
            let score = me.score;
            let cur_index = -1;
            let new_index = -1;
            for (let i = ary.length - 1; i >= 0; i--) {
                let item = ary[i];
                if (item.id === me.id) {
                    cur_index = i;
                }
                if (score > item.score) {
                    new_index = i;
                }
            }
            if (cur_index === -1 && new_index === -1) return;

            if (cur_index === -1) {
                let item = { id: me.id, score: score, name: me.color_name || me.name };
                ary.splice(new_index, 0, item);
                if (ary.length > 30)
                    ary.length = 30;
                return;
            }

            let item = ary[cur_index];
            item.score = score;
            item.name = me.color_name || me.name;
            if (cur_index === new_index
                || new_index - cur_index === 1) {
                return;
            }

            if (new_index === -1) {
                ary.splice(cur_index, 1);
                ary.push(item);
            } else if (cur_index > new_index) {
                ary.splice(cur_index, 1);
                ary.splice(new_index, 0, item);
            } else {
                ary.splice(new_index, 0, item);
                ary.splice(cur_index, 1);
            }
        },

        /** @param {USER} me */
        updateScore(me) {
            if (!WORLD.is_server(me)) return;
            let ary = this.SCORE;
            this.updateScoreItem(me, ary);
            let fam = this.SC_STATS[me.family.id];
            if (!fam) return;
            this.updateScoreItem(me, fam);
        },
    },
    /** @type {number} -1关闭 0正常 >1 用户等级>连接 */
    status: -1,
    /** @type {*} 心跳服务句柄 */
    heart_beat_service: null,
    /** @type {*} 服务器配置 */
    SERVER: null,
    /** @type {COMMAND} 默认命令 */
    DEFAULT_COMMAND: null,
    /** @returns {void} 新socket接入计数 */
    SocketIn() {
        this.SocketCount++;
    },
    /**
     * 处理客户端连接
     * @param {*} socket
     * @returns {void}
     */
    connect(socket) {
        if (WORLD.status < 0)
            return socket.end();
        if (!WORLD.check_connect(socket))
            return socket.end();

        socket.user = new USER();

        socket.user.socket = socket;
        socket.user.wait_input = this.USERLOGIN.check_session.bind(this.USERLOGIN);

        socket.setTimeout(60000);
    },
    /**
     * 检查连接是否允许
     * @param {*} socket
     * @returns {boolean}
     */
    check_connect(socket) {
        return true;
    },
    /**
     * 登录前检查
     * @param {USER} user
     * @returns {boolean}
     */
    before_login(user) {
        if (this.status < 0) return false;
        if (this.status === 0) return true;
        return this.status <= user.user_level;
    },
    /**
     * 断开连接
     * @param {*} socket
     * @returns {void}
     */
    disconnect(socket) {
        if (socket.user) {
            socket.user.socket = null;
            socket.user.disconnect();
        }
        this.SocketCount--;
        if (socket.oserver) {
            socket.oserver.disconnect();
            socket.oserver = null;
        }
    },
    /**
     * 处理客户端请求
     * @param {string} request - 命令字符串
     * @param {*} socket
     * @returns {void}
     */
    request(request, socket) {
        if (!request) return;
        const user = socket.user;
        if (!user) {
            return;
        }
        if (user.request_count > 20) {
            return user.send("不要急，慢慢来。");
        }
        user.request_count = user.request_count + 1;
        const time = Date.now();
        try {
            user.command(request);
        } catch (e) {
            console.log(user.name, "命令错误：", request, e.message, e.stack);
            WORLD.log(user, request, e.message + e.stack);
        }
        WORLD.RECEIVED.push({
            time: time,
            cmd: request + " " + (Date.now() - time).toString(),
            user: user.id
        });
        if (WORLD.RECEIVED.length > 1000) {
            WORLD.saveRequest();
        }
    },
    /** @returns {void} 保存请求日志 */
    saveRequest() {
        db.saveRequest(WORLD.RECEIVED);
        WORLD.RECEIVED.length = 0;
    },
    /**
     * 启动服务器
     * @param {number} [sid] - 服务器ID
     * @returns {Promise<void>}
     */
    async startup(sid) {
        if (sid) {
            sid = parseInt(sid);
            this.SERVERS = await db.getServers();
            this.SERVER = this.getServer(sid);
        } else {
            this.SERVER = __CONFIG.def_server;
        }

        if (!this.SERVER) throw "服务器设置错误，无法启动";
        this.SERVERID = this.SERVER.id;

        await db.initDataDir();
        await loadResource();
        await this.DATA.load();
        await this.LISTENER.start(this.SERVER.port);
        console.log("服务", this.SERVER.name, "(" + this.SERVERID + ")启动");
        console.log("ws://" + this.SERVER.ip + ":" + this.SERVER.port);
        this.heartbeat_interval = __CONFIG.HEARTBEAT;
        this.heart_beat_service = setInterval(WORLD.heart_beat, this.heartbeat_interval);

        this.status = __CONFIG.CONNECT_LEVEL ?? 0;
        this.on_startup();
        if (this.status > 0)
            console.log('当前允许级别' + this.status + "账号登陆");
    },


    /**
     * 向所有在线用户发送消息
     * @param {string} msg
     * @returns {void}
     */
    sendAll(msg) {
        for (let i = 0; i < WORLD.USERS.length; i++) {
            WORLD.USERS[i].send(msg);
        }
    },
    /**
     * 根据ID获取用户
     * @param {string|number} id
     * @returns {USER|undefined}
     */
    getUser(id) {
        if (!id) return;
        for (let i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].id == id) return WORLD.USERS[i];
        }

    },
    /**
     * 根据名字查找用户
     * @param {string} name
     * @returns {USER|undefined}
     */
    find_user(name) {
        if (!name) return;
        for (let i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].name == name) return WORLD.USERS[i];
        }
    },
    /**
     * 用户登录事件回调
     * @param {USER} user
     * @returns {void}
     */
    on_user_login(user) {

    },
    /**
     * 跨服登录事件回调
     * @param {USER} user
     * @returns {void}
     */
    on_user_cross_login(user) {

    },
    /** @returns {void} 服务器启动回调 */
    on_startup() {

    },
    /**
     * 用户退出事件回调
     * @param {USER} user
     * @returns {void}
     */
    on_user_quit(user) {

    },
    /**
     * 用户重连事件回调
     * @param {USER} user
     * @returns {void}
     */
    on_user_relogin(user) {

    },
    /**
     * 心跳回调
     * @param {number} dt - 当前时间戳
     * @returns {void}
     */
    on_heart_beat(user) {

    },
    /** @returns {void} 服务器主心跳 */
    heart_beat() {
        let avtived_obj = null;
        try {
            const dt = Date.now();
            WORLD.CONNECT_COUNT = 0;
            for (let i = 0; i < WORLD.USERS.length; i++) {
                avtived_obj = WORLD.USERS[i];
                if (avtived_obj.socket) WORLD.CONNECT_COUNT++;
                avtived_obj.heart_beat(dt);
            }
            WORLD.on_heart_beat(dt);
            for (let i = 0; i < WORLD.RUN_ROOMS.length; i++) {
                avtived_obj = WORLD.RUN_ROOMS[i];
                avtived_obj.heart_beat(dt);
            }
            WORLD.HEARTBEATCOUNT++;
            if (WORLD.HEARTBEATCOUNT > 720) {
                WORLD.HEARTBEATCOUNT = 0;
                WORLD.save();
                console.log("数据已备份%d", Date.now() - dt);
            }
        } catch (e) {
            console.log(avtived_obj ? (avtived_obj.path ?? avtived_obj.name) : "", "心跳错误:", e, e.stack);
            WORLD.log(null, e.message, e.stack);
        }

    },
    /**
     * 用户登出处理
     * @param {USER} user
     * @returns {void}
     */
    login_out(user) {
        this.on_user_quit(user);
        if (user.serverid === WORLD.SERVERID) {
            user.save();
        }
        WORLD.USERS.remove(user);

        if (user.socket) {
            try {
                user.socket.end();
                user.socket.destroy();
            } catch (e) {
                console.log(e.message, e.stack);
            }
        }
    },
    /**
     * 向所有用户广播消息
     * @param {string} text
     * @returns {void}
     */
    send(text) {
        for (let i = 0; i < this.USERS.length; i++) {
            this.USERS[i].send(text);
        }
    },
    /**
     * 记录日志
     * @param {USER|null} user
     * @param {string} cmd
     * @param {string} msg
     * @returns {void}
     */
    log(user, cmd, msg) {
        WORLD.LOGS.push({
            time: Date.now(),
            cmd: cmd,
            user: user ? user.name : "",
            msg: msg
        });
        if (WORLD.LOGS.length > 500) {
            db.saveLogs(WORLD.LOGS);
            WORLD.LOGS.length = 0;
        }
    },
    /** @returns {void} 保存日志到文件 */
    saveLog() {
        db.saveLogs(WORLD.LOGS);
        WORLD.LOGS.length = 0;
    },
    /**
     * 判断用户是否在当前服务器
     * @param {USER} user
     * @returns {boolean}
     */
    is_server(user) {
        return user.serverid == WORLD.SERVERID;
    },
    /**
     * 保存所有数据
     * @returns {Promise<boolean>}
     */
    async save() {

        const roles = [];
        for (let i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].serverid != WORLD.SERVERID) continue;
            roles.push(WORLD.USERS[i].getData());
        }
        try {
            console.time('saved');
            await db.saveRoles(roles);
            console.log('玩家数据已保存');
            await this.DATA.save();
            console.log('全局数据已经保存');
            await this.saveLog();
            await this.saveRequest();
            console.log('日志数据已经保存');
            console.timeEnd('saved');
            return true;
        } catch (error) {
            console.error('玩家数据保存失败', error.message);
            return false;
        }
    },
    /** @returns {void} 生成堆内存快照 */
    writeHeapSnapshot() {
        const v8 = UTIL.require('v8');
        const dt = new Date();
        const fname = __PATH.DATA + "/" + dt.getFullYear() + "_" + dt.getMonth() + "_"
            + dt.getDate() + "_" + dt.getHours() + "_" + dt.getMinutes() + ".heapsnapshot";
        v8.writeHeapSnapshot(fname);
        console.log('快照保存到', fname);
    },
    /** @returns {void} 加载本地未保存的用户数据 */
    loadLocalData() {
        const data = db.getLocalRoles();
        if (!data || !data.length) return;
        console.log("加载上次未保存的本地用户%d", data.length);
        for (let i = 0; i < data.length; i++) {
            const user = new USER();
            user.loadData(data[i]);
            this.USERS.push(user);
        }
        db.deleteLocalRoles();
    },
    /**
     * 跨服响应回调
     * @param {string} id - 用户ID
     * @param {string} sid - 服务器ID
     * @returns {void}
     */
    on_cross_response(id, sid) {
        //允许跨服
    },
    /**
     * 是否允许跨服
     * @param {string} id
     * @returns {boolean}
     */
    can_cross(id) {
        //允许跨服
    },
    /**
     * 用户死亡事件回调
     * @param {CHARACTER} me
     * @param {CHARACTER} killer
     * @param {CORPSE} corpse
     * @returns {void}
     */
    on_user_die(me, killer, corpse) {

    },
    /** @returns {void} 资源加载完成回调 */
    on_resource_loaded() {

    },

    // ============ WORLD方法(由extends合并) ============

    /** 服务启动回调 */
    on_startup() {
        for (let fam in FAMILIES) {
            FAMILIES[fam].init();
        }
        WORLD.COMMANDS.jh.init();
    },

    /** @param {USER} user 玩家退出时调用 */
    on_user_quit(user) {
        if (WORLD.is_server(user)) {
            if (user.query_temp('pt')) {
                WORLD.COMMANDS['party'].on_user_login(user, false);
            }
            WORLD.on_user_save(user);
        } else {
            if (user.query_temp('cross_type') == 'duizhan') {
                WORLD.PUB_USERS.push(user);
                user.disconnect_time = 0;
            }
        }
    },

    /** @param {USER} user 玩家退出或关闭时保存 */
    on_user_save(user) {

    },

    /** @param {number} now 心跳回调 */
    on_heart_beat(now) {

    },

    /** @param {*} socket @returns {boolean} */
    check_connect(socket) {
        if (WORLD.SERVER.istest) return true;
        return true;
    },

    /** @returns {Promise<boolean>} */
    async close() {
        WORLD.status = 5;
        console.log('正在尝试关闭数据连接');
        for (let user of this.USERS) {
            if (user.socket)
                user.socket.end();
        }
        console.log('关闭网络连接');
        clearInterval(this.heart_beat_service);
        if (await WORLD.save()) {
            console.log('关闭数据连接');
            return true;
        }
        return false;
    },
};

const COPY_PROPS = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
    , "hp", "max_hp", "mp", 'age', 'score'];

/**
 * 递归加载资源文件
 * @param {string} basePath - 基础路径
 * @param {string} [path] - 当前路径
 * @returns {number} 加载的文件数
 */
async function loadResource() {
    async function preloadDir(basePath, dirPath) {
        dirPath = dirPath || basePath;
        const files = fs.readdirSync(dirPath);
        let count = 0;
        for (let i = 0; i < files.length; i++) {
            const sub_path = dirPath + files[i];
            const stat = fs.statSync(sub_path);
            if (stat.isDirectory()) {
                count += await preloadDir(basePath, sub_path + "/");
            } else if (files[i].endsWith('.js')) {
                const fname = sub_path.replace(basePath, "").replace(".js", "");
                const fkey = basePath + fname;
                await BASE.PRELOAD(fkey, sub_path);
                count++;
            }
        }
        return count;
    }
    function readdir(basePath, path) {
        path = path || basePath;
        const files = fs.readdirSync(path);
        let count = 0;
        for (let i = 0; i < files.length; i++) {
            const sub_path = path + files[i];
            const stat = fs.statSync(sub_path);
            if (stat.isDirectory()) {
                count += readdir(basePath, sub_path + "/");
            } else {
                const fname = sub_path.replace(basePath, "").replace(".js", "");
                BASE.CREATE(basePath, fname);
                count++;
            }
        }
        return count;
    }
    const dirs = [
        __PATH.EXTENDS, __PATH.COMMAND, __PATH.FAMILY,
        __PATH.OBJ, __PATH.AREA, __PATH.SKILL,
        __PATH.MAP, __PATH.TASK, __PATH.NPC,
    ];
    try {
        // Phase 1: preload all modules
        let preloadSum = 0;
        for (const dir of dirs) {
            const count = await preloadDir(dir);
            console.log("preload %s %d", dir, count);
            preloadSum += count;
        }
        console.log('模块预加载%d', preloadSum);

        // Phase 2: create instances (sync from cache)
        let sum = 0;
        for (const dir of dirs) {
            const count = readdir(dir);
            console.log("%s %d", dir, count);
            sum += count;
        }
        console.log('资源脚本加载%d', sum);
        WORLD.on_resource_loaded();
    } catch (e) {
        console.log("error: ", e, e.stack);
    }
}

export { WORLD };
