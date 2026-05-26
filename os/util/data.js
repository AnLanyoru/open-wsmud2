
const fs_sync = require("fs");
const fs = fs_sync.promises;

const DB = __CONFIG.DB;

module.exports = {
    close: function () {
        return DB.close();
    },
    getRoles: function (userid, server) {
        return DB.getRoles(userid, server);
    },
    addRole: async function (role) {
        return await DB.addRole(role);
    },
    deleteRole: function (userid, roleid) {
        return DB.deleteRole(userid, roleid);
    },
    saveRole: function (role) {
        return DB.saveRole(role);
    },
    saveRoles: async function (roles) {
        const dt = new Date();
        const path = __PATH.DATA + "bak/data" + dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getHours() + ".js";
        const stream = fs_sync.createWriteStream(path, { flags: 'a' });
        try {
            stream.write('[');
            for (let role of roles) {
                await DB.saveRole(role);
                this.localBak(stream, role);

            }
            stream.write('0]');
        } catch (error) {
            console.error('备份数据失败：', error);
        } finally {
            stream.end();
        }

    },
    localBak: function (stream, role) {
        stream.write('{id:"');
        stream.write(role.id);
        stream.write('",name:"');
        stream.write(role.name);
        stream.write('",userid:');
        stream.write(role.userid.toString());
        stream.write(',title:"');
        stream.write(role.title);
        stream.write('",level:');
        stream.write(role.level.toString());
        stream.write(',data:');
        stream.write(role.data);
        stream.write('},');
    },
    saveRequest: function (recs) {
        var dt = new Date();
        var f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        var path = __PATH.DATA + "req/request" + f + ".txt";
        var ary = [];
        for (var i = 0; i < recs.length; i++) {
            var r = recs[i];
            ary.push(r.time);
            ary.push(" ");
            ary.push(r.user);
            ary.push(" ");
            ary.push(r.cmd);
            ary.push("\r\n");
        }
        return fs.appendFile(path, ary.join(""));
    },
    saveLogs: function (logs) {
        var dt = new Date();
        var f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        var path = __PATH.DATA + "log/log" + f + ".txt";
        var ary = [];
        for (var i = 0; i < logs.length; i++) {
            var r = logs[i];
            ary.push(r.time);
            ary.push(" ");
            ary.push(r.user);
            ary.push(" ");
            ary.push(r.cmd);
            ary.push(" ");
            ary.push(r.msg);
            ary.push("\r\n");
        }
        return fs.appendFile(path, ary.join(""));
    },
    saveData: async function (content) {
        let path = __PATH.DATA + "data.js";
        let dt = new Date();
        var f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        let _dst = __PATH.DATA + "/temp/temp" + f + ".js";
        await fs.copyFile(path, _dst);
        return fs.writeFile(path, content);
    }, readData: async function () {
        let path = __PATH.DATA + "data.js";
        try {
            const data = await fs.readFile(path);
            return JSON.toObject(data);
        } catch (error) {
            console.error('数据读取失败', path, error);
        }
    },
    getRoleData: function (userid, id) {

        return DB.getData(userid, id);
    },
    change_name: function (id, name) {
        return DB.updateRoleName(id, name);
    },
    change_userid: function (id, fromuserid, touserid) {
        return DB.updateUserid(id, fromuserid, touserid);
    },
    check_file: async function (path) {
        try {
            await fs.access(path)
            return true;
        } catch (error) {
            return false;
        }
    },
    initDataDir: async function () {
        __PATH.BASE_DATA = __PATH.DATA;
        __PATH.DATA = __PATH.DATA + WORLD.SERVERID + "/";

        if (!await this.check_file(__PATH.DATA)) {
            console.log('创建备份文件夹....');
            await fs.mkdir(__PATH.DATA);
        }
        var paths = await fs.readdir(__PATH.DEF_DATA);
        for (var i = 0; i < paths.length; i++) {
            var _src = __PATH.DEF_DATA + paths[i];
            var _dst = __PATH.DATA + paths[i];
            if (!await this.check_file(_dst)) {
                var stat = await fs.stat(_src);
                if (stat.isFile()) {
                    await fs.copyFile(_src, _dst);
                    console.log('创建备份文件 ', _dst, "....");
                } else {
                    await fs.mkdir(_dst);
                    console.log('创建备份文件夹 ', _dst, "....");
                }
            }

        }
    },
    getServers: function () {
        return DB.getServers();
    }
};

