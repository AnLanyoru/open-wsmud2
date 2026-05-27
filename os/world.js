/**
 * WORLD 全局对象 - 游戏世界核心管理
 */

require("./util/util");
const db = require("./util/data");

/**
 * @type {{
 *   USERS: USER[],
 *   COMMANDS: Object<string, COMMAND>,
 *   SKILLS: Object<string, SKILL>,
 *   ROOMS: Object<string, ROOM>,
 *   RUN_ROOMS: ROOM[],
 *   DEFAULT_SKILLS: Object<string, SKILL>,
 *   AREAS: AREA[],
 *   TASKS: USERTASK[],
 *   SYSTEMTASKS: TASK[],
 *   USER_EVENTS: Array<{id: string}>,
 *   OBJ_STROE: Map<string, OBJ>,
 *   NPC_STROE: Map<string, NPC>,
 *   HEARTBEATCOUNT: number,
 *   RECEIVED: Array<{time: number, cmd: string, user: string}>,
 *   LOGS: Array<{time: number, cmd: string, user: string, msg: string}>,
 *   SERVERID: number,
 *   SERVERS: Array<*>,
 *   CONNECT_COUNT: number,
 *   DATA: *,
 *   USERLOGIN: *,
 *   DB: *,
 *   SocketCount: number,
 *   LISTENER: *,
 *   max_connect_count: number,
 *   max_user_count: number,
 *   MESSAGE: {stores: Map<*, *>, NOTICES: Array<*>},
 *   STATS: {TOPS: Array<*>, EXP: Array<*>, SCORE: Array<*>, WEAPON: Array<*>},
 *   status: number,
 *   heart_beat_service: *,
 *   SERVER: *,
 *   DEFAULT_COMMAND: COMMAND,
 *   SocketIn: function(): void,
 *   connect: function(*): void,
 *   check_connect: function(*): boolean,
 *   before_login: function(USER): boolean,
 *   disconnect: function(*): void,
 *   request: function(string, *): void,
 *   saveRequest: function(): void,
 *   startup: function(number=): Promise<void>,
 *   sendAll: function(string): void,
 *   getUser: function(string|number): USER|undefined,
 *   find_user: function(string): USER|undefined,
 *   on_user_login: function(USER): void,
 *   on_user_cross_login: function(USER): void,
 *   on_startup: function(): void,
 *   on_user_quit: function(USER): void,
 *   on_user_relogin: function(USER): void,
 *   on_heart_beat: function(number): void,
 *   heart_beat: function(): void,
 *   login_out: function(USER): void,
 *   send: function(string): void,
 *   log: function(USER|null, string, string): void,
 *   saveLog: function(): void,
 *   is_server: function(USER): boolean,
 *   save: function(): Promise<boolean>,
 *   writeHeapSnapshot: function(): void,
 *   loadLocalData: function(): void,
 *   on_cross_response: function(string, string): void,
 *   can_cross: function(string): boolean,
 *   on_user_die: function(CHARACTER, CHARACTER, CORPSE): void,
 *   on_resource_loaded: function(): void,
 *   auto_get: function
 * }}
 */
WORLD = {
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
    DATA: require('./data'),
    USERLOGIN: require('./login'),
    DB: db,
    SocketCount: 0,
    LISTENER: require("./ws"),
    max_connect_count: 1100,
    max_user_count: 5100,
    MESSAGE: {
        stores: new Map(),
        NOTICES: [],
    },
    STATS: {
        TOPS: [],
        EXP: [],
        SCORE: [],
        WEAPON: [],
    },
    /** @type {number} -1关闭 0正常 >1 用户等级>连接 */
    status: -1,
    /** 新socket接入计数 */
    SocketIn: function () {
        this.SocketCount++;
    },
    /**
     * 处理客户端连接
     * @param {*} socket
     */
    connect: function (socket) {
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
    check_connect: function (socket) {
        return true;
    },
    /**
     * 登录前检查
     * @param {USER} user
     * @returns {boolean}
     */
    before_login: function (user) {
        if (this.status < 0) return false;
        if (this.status === 0) return true;
        return this.status <= user.user_level;
    },
    /**
     * 断开连接
     * @param {*} socket
     */
    disconnect: function (socket) {
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
     */
    request: function (request, socket) {
        if (!request) return;
        var user = socket.user;
        if (!user) {
            return;
        }
        if (user.request_count > 20) {
            return user.send("不要急，慢慢来。");
        }
        user.request_count = user.request_count + 1;
        var time = Date.now();
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
    /** 保存请求日志 */
    saveRequest: function () {
        db.saveRequest(WORLD.RECEIVED);
        WORLD.RECEIVED.length = 0;
    },
    /**
     * 启动服务器
     * @param {number} [sid] - 服务器ID
     * @returns {Promise<void>}
     */
    startup: async function (sid) {
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
        loadResource();
        await this.DATA.load();
        await this.LISTENER.start(this.SERVER.port);
        console.log("服务", this.SERVER.name, "(" + this.SERVERID + ")启动");
        console.log("ws://" + this.SERVER.ip + ":" + this.SERVER.port);
        this.heart_beat_service = setInterval(WORLD.heart_beat, __CONFIG.HEARTBEAT);

        this.status = __CONFIG.CONNECT_LEVEL ?? 0;
        this.on_startup();
        if (this.status > 0)
            console.log('当前允许级别' + this.status + "账号登陆");
    },


    /**
     * 向所有在线用户发送消息
     * @param {string} msg
     */
    sendAll: function (msg) {
        for (var i = 0; i < WORLD.USERS.length; i++) {
            WORLD.USERS[i].send(msg);
        }
    },
    /**
     * 根据ID获取用户
     * @param {string|number} id
     * @returns {USER|undefined}
     */
    getUser: function (id) {
        if (!id) return;
        for (var i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].id == id) return WORLD.USERS[i];
        }

    },
    /**
     * 根据名字查找用户
     * @param {string} name
     * @returns {USER|undefined}
     */
    find_user: function (name) {
        if (!name) return;
        for (var i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].name == name) return WORLD.USERS[i];
        }
    },
    /**
     * 用户登录事件回调
     * @param {USER} user
     */
    on_user_login: function (user) {

    },
    /**
     * 跨服登录事件回调
     * @param {USER} user
     */
    on_user_cross_login: function (user) {

    },
    /** 服务器启动回调 */
    on_startup: function () {

    },
    /**
     * 用户退出事件回调
     * @param {USER} user
     */
    on_user_quit: function (user) {

    },
    /**
     * 用户重连事件回调
     * @param {USER} user
     */
    on_user_relogin: function (user) {

    },
    /**
     * 心跳回调
     * @param {number} dt - 当前时间戳
     */
    on_heart_beat: function (user) {

    },
    /** 服务器主心跳 */
    heart_beat: function () {
        var avtived_obj = null;
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
     */
    login_out: function (user) {
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
     */
    send: function (text) {
        for (var i = 0; i < this.USERS.length; i++) {
            this.USERS[i].send(text);
        }
    },
    /**
     * 记录日志
     * @param {USER|null} user
     * @param {string} cmd
     * @param {string} msg
     */
    log: function (user, cmd, msg) {
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
    /** 保存日志到文件 */
    saveLog: function () {
        db.saveLogs(WORLD.LOGS);
        WORLD.LOGS.length = 0;
    },
    /**
     * 判断用户是否在当前服务器
     * @param {USER} user
     * @returns {boolean}
     */
    is_server: function (user) {
        return user.serverid == WORLD.SERVERID;
    },
    /**
     * 保存所有数据
     * @returns {Promise<boolean>}
     */
    save: async function () {

        var roles = [];
        for (var i = 0; i < WORLD.USERS.length; i++) {
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
    /** 生成堆内存快照 */
    writeHeapSnapshot: function () {
        let v8 = UTIL.require('v8');
        let dt = new Date();
        let fname = __PATH.DATA + "/" + dt.getFullYear() + "_" + dt.getMonth() + "_"
            + dt.getDate() + "_" + dt.getHours() + "_" + dt.getMinutes() + ".heapsnapshot";
        v8.writeHeapSnapshot(fname);
        console.log('快照保存到', fname);
    },
    /** 加载本地未保存的用户数据 */
    loadLocalData: function () {
        let data = db.getLocalRoles();
        if (!data || !data.length) return;
        console.log("加载上次未保存的本地用户%d", data.length);
        for (let i = 0; i < data.length; i++) {
            let user = new USER();
            user.loadData(data[i]);
            this.USERS.push(user);
        }
        db.deleteLocalRoles();
    },
    /**
     * 跨服响应回调
     * @param {string} id - 用户ID
     * @param {string} sid - 服务器ID
     */
    on_cross_response: function (id, sid) {
        //允许跨服
    },
    /**
     * 是否允许跨服
     * @param {string} id
     * @returns {boolean}
     */
    can_cross: function (id) {
        //允许跨服
    },
    /**
     * 用户死亡事件回调
     * @param {CHARACTER} me
     * @param {CHARACTER} killer
     * @param {CORPSE} corpse
     */
    on_user_die: function (me, killer, corpse) {

    },
    /** 资源加载完成回调 */
    on_resource_loaded: function () {

    }
};

/**
 * 递归加载资源文件
 * @param {string} basePath - 基础路径
 * @param {string} [path] - 当前路径
 * @returns {number} 加载的文件数
 */
function loadResource() {
    let fs = require("fs");
    function readdir(basePath, path) {
        path = path || basePath;
        let files = fs.readdirSync(path);
        let count = 0;
        for (let i = 0; i < files.length; i++) {
            let sub_path = path + files[i];
            let stat = fs.statSync(sub_path);
            if (stat.isDirectory()) {
                count += readdir(basePath, sub_path + "/");
            } else {
                let fname = sub_path.replace(basePath, "").replace(".js", "");
                BASE.CREATE(basePath, fname);
                count++;
            }
        }
        return count;
    }
    try {
        let sum = 0;
        let count = readdir(__PATH.EXTENDS);
        console.log("%s %d ", __PATH.EXTENDS, count);
        sum += count;
        count = readdir(__PATH.COMMAND);
        console.log("%s%d ", __PATH.COMMAND, count);
        sum += count;
        count = readdir(__PATH.FAMILY);
        console.log("%s %d ", __PATH.FAMILY, count);
        sum += count;


        count = readdir(__PATH.OBJ);
        console.log("%s %d ", __PATH.OBJ, count);
        sum += count;

        count = readdir(__PATH.AREA);
        console.log("%s %d ", __PATH.AREA, count);
        sum += count;

        count = readdir(__PATH.SKILL);
        console.log("%s %d ", __PATH.SKILL, count);
        sum += count;

        count = readdir(__PATH.MAP);
        console.log("%s %d ", __PATH.MAP, count);
        sum += count;
        count = readdir(__PATH.TASK);
        console.log("%s %d ", __PATH.TASK, count);
        sum += count;
        console.log('资源脚本加载%d', sum);
        WORLD.on_resource_loaded();
    } catch (e) {
        console.log("error: ", e, e.stack);
    }
}
