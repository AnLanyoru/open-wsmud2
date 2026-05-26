
require("./util/util");
const db = require("./util/data");
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
    status: -1,//-1关闭 0正常 >1 用户等级>连接
    SocketIn: function () {
        this.SocketCount++;
    },
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
    check_connect: function (socket) {
        return true;
    },
    before_login: function (user) {
        if (this.status < 0) return false;
        if (this.status === 0) return true;
        return this.status <= user.user_level;
    },
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
    }, request: function (request, socket) {
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
    }, saveRequest: function () {
        db.saveRequest(WORLD.RECEIVED);
        WORLD.RECEIVED.length = 0;
    },
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


    sendAll: function (msg) {
        for (var i = 0; i < WORLD.USERS.length; i++) {
            WORLD.USERS[i].send(msg);
        }
    },
    getUser: function (id) {
        if (!id) return;
        for (var i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].id == id) return WORLD.USERS[i];
        }

    }, find_user: function (name) {
        if (!name) return;
        for (var i = 0; i < WORLD.USERS.length; i++) {
            if (WORLD.USERS[i].name == name) return WORLD.USERS[i];
        }
    },
    on_user_login: function (user) {

    },
    on_user_cross_login: function (user) {

    },
    on_startup: function () {

    },
    on_user_quit: function (user) {

    },
    on_user_relogin: function (user) {

    }
    ,
    on_heart_beat: function (user) {

    },
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
    }, send: function (text) {
        for (var i = 0; i < this.USERS.length; i++) {
            this.USERS[i].send(text);
        }
    }, log: function (user, cmd, msg) {
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
    }, saveLog: function () {
        db.saveLogs(WORLD.LOGS);
        WORLD.LOGS.length = 0;
    }
    ,
    is_server: function (user) {
        return user.serverid == WORLD.SERVERID;
    },
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
    writeHeapSnapshot: function () {
        let v8 = UTIL.require('v8');
        let dt = new Date();
        let fname = __PATH.DATA + "/" + dt.getFullYear() + "_" + dt.getMonth() + "_"
            + dt.getDate() + "_" + dt.getHours() + "_" + dt.getMinutes() + ".heapsnapshot";
        v8.writeHeapSnapshot(fname);
        console.log('快照保存到', fname);
    }
    ,
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
    on_cross_response: function (id, sid) {
        //允许跨服
    },
    can_cross: function (id) {
        //允许跨服
    }, on_user_die: function (me, killer, corpse) {

    }, on_resource_loaded: function () {

    }
};
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
