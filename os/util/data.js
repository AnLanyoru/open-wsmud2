/**
 * 数据持久化模块 - 数据库操作/文件备份
 */

const fs_sync = require("fs");
const fs = fs_sync.promises;

const DB = __CONFIG.DB;

/**
 * @type {{
 *   close: function(): *,
 *   getRoles: function(number, number): Promise<Array<*>>,
 *   addRole: function(*): Promise<*>,
 *   deleteRole: function(number, string): Promise<*>,
 *   saveRole: function(*): Promise<*>,
 *   saveRoles: function(Array<*>): Promise<void>,
 *   localBak: function(*, *): void,
 *   saveRequest: function(Array<*>): Promise<void>,
 *   saveLogs: function(Array<*>): Promise<void>,
 *   saveData: function(string): Promise<void>,
 *   readData: function(): Promise<*>,
 *   getRoleData: function(number, string): *,
 *   change_name: function(string, string): *,
 *   change_userid: function(string, number, number): *,
 *   check_file: function(string): Promise<boolean>,
 *   initDataDir: function(): Promise<void>,
 *   getServers: function(): *
 * }}
 */
module.exports = {
    /** 关闭数据库连接 */
    close: function () {
        return DB.close();
    },
    /**
     * 获取角色列表
     * @param {number} userid
     * @param {number} server
     * @returns {Promise<Array<*>>}
     */
    getRoles: function (userid, server) {
        return DB.getRoles(userid, server);
    },
    /**
     * 添加角色
     * @param {*} role
     * @returns {Promise<*>}
     */
    addRole: async function (role) {
        return await DB.addRole(role);
    },
    /**
     * 删除角色
     * @param {number} userid
     * @param {string} roleid
     * @returns {Promise<*>}
     */
    deleteRole: function (userid, roleid) {
        return DB.deleteRole(userid, roleid);
    },
    /**
     * 保存角色
     * @param {*} role
     * @returns {Promise<*>}
     */
    saveRole: function (role) {
        return DB.saveRole(role);
    },
    /**
     * 批量保存角色(同时备份到文件)
     * @param {Array<{id: string, name: string, userid: number, title: string, level: number, data: string}>} roles
     * @returns {Promise<void>}
     */
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
    /**
     * 本地文件备份角色数据
     * @param {*} stream - 写入流
     * @param {{id: string, name: string, userid: number, title: string, level: number, data: string}} role
     */
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
    /**
     * 保存请求日志
     * @param {Array<{time: number, user: string, cmd: string}>} recs
     * @returns {Promise<void>}
     */
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
    /**
     * 保存错误日志
     * @param {Array<{time: number, user: string, cmd: string, msg: string}>} logs
     * @returns {Promise<void>}
     */
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
    /**
     * 保存全局数据
     * @param {string} content
     * @returns {Promise<void>}
     */
    saveData: async function (content) {
        let path = __PATH.DATA + "data.js";
        let dt = new Date();
        var f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        let _dst = __PATH.DATA + "/temp/temp" + f + ".js";
        await fs.copyFile(path, _dst);
        return fs.writeFile(path, content);
    },
    /**
     * 读取全局数据
     * @returns {Promise<*>}
     */
    readData: async function () {
        let path = __PATH.DATA + "data.js";
        try {
            const data = await fs.readFile(path);
            return JSON.toObject(data);
        } catch (error) {
            console.error('数据读取失败', path, error);
        }
    },
    /**
     * 获取角色数据
     * @param {number} userid
     * @param {string} id
     * @returns {*}
     */
    getRoleData: function (userid, id) {

        return DB.getData(userid, id);
    },
    /**
     * 修改角色名
     * @param {string} id
     * @param {string} name
     * @returns {*}
     */
    change_name: function (id, name) {
        return DB.updateRoleName(id, name);
    },
    /**
     * 修改角色所属用户
     * @param {string} id
     * @param {number} fromuserid
     * @param {number} touserid
     * @returns {*}
     */
    change_userid: function (id, fromuserid, touserid) {
        return DB.updateUserid(id, fromuserid, touserid);
    },
    /**
     * 检查文件是否存在
     * @param {string} path
     * @returns {Promise<boolean>}
     */
    check_file: async function (path) {
        try {
            await fs.access(path)
            return true;
        } catch (error) {
            return false;
        }
    },
    /**
     * 初始化数据目录(创建备份目录、复制默认数据)
     * @returns {Promise<void>}
     */
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
    /**
     * 获取服务器列表
     * @returns {*}
     */
    getServers: function () {
        return DB.getServers();
    }
};

