/**
 * 数据持久化模块 - 数据库操作/文件备份
 */

import fs_sync from 'fs';

const fs = fs_sync.promises;

const DB = __CONFIG.DB;

export default {
    /** 关闭数据库连接 */
    close() {
        return DB.close();
    },
    /**
     * 获取角色列表
     * @param {number} userid
     * @param {number} server
     * @returns {Promise<Array<*>>}
     */
    getRoles(userid, server) {
        return DB.getRoles(userid, server);
    },
    /**
     * 添加角色
     * @param {*} role
     * @returns {Promise<*>}
     */
    async addRole(role) {
        return await DB.addRole(role);
    },
    /**
     * 删除角色
     * @param {number} userid
     * @param {string} roleid
     * @returns {Promise<*>}
     */
    deleteRole(userid, roleid) {
        return DB.deleteRole(userid, roleid);
    },
    /**
     * 保存角色
     * @param {*} role
     * @returns {Promise<*>}
     */
    saveRole(role) {
        return DB.saveRole(role);
    },
    /**
     * 批量保存角色(同时备份到文件)
     * @param {Array<{id: string, name: string, userid: number, title: string, level: number, data: string}>} roles
     * @returns {Promise<void>}
     */
    async saveRoles(roles) {
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
     * @returns {void}
     */
    localBak(stream, role) {
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
    saveRequest(recs) {
        const dt = new Date();
        const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        const path = __PATH.DATA + "req/request" + f + ".txt";
        const ary = [];
        for (let i = 0; i < recs.length; i++) {
            const r = recs[i];
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
    saveLogs(logs) {
        const dt = new Date();
        const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        const path = __PATH.DATA + "log/log" + f + ".txt";
        const ary = [];
        for (let i = 0; i < logs.length; i++) {
            const r = logs[i];
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
    async saveData(content) {
        const path = __PATH.DATA + "data.js";
        const dt = new Date();
        const f = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        const tempDir = __PATH.DATA + "temp/";
        if (!await this.check_file(tempDir)) {
            await fs.mkdir(tempDir);
        }
        const _dst = tempDir + "temp" + f + ".js";
        if (await this.check_file(path)) {
            await fs.copyFile(path, _dst);
        }
        return fs.writeFile(path, content);
    },
    /**
     * 读取全局数据
     * @returns {Promise<*>}
     */
    async readData() {
        const path = __PATH.DATA + "data.js";
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
    getRoleData(userid, id) {

        return DB.getData(userid, id);
    },
    /**
     * 修改角色名
     * @param {string} id
     * @param {string} name
     * @returns {*}
     */
    change_name(id, name) {
        return DB.updateRoleName(id, name);
    },
    /**
     * 修改角色所属用户
     * @param {string} id
     * @param {number} fromuserid
     * @param {number} touserid
     * @returns {*}
     */
    change_userid(id, fromuserid, touserid) {
        return DB.updateUserid(id, fromuserid, touserid);
    },
    /**
     * 检查文件是否存在
     * @param {string} path
     * @returns {Promise<boolean>}
     */
    async check_file(path) {
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
    async initDataDir() {
        __PATH.BASE_DATA = __PATH.DATA;
        __PATH.DATA = __PATH.DATA + WORLD.SERVERID + "/";

        if (!await this.check_file(__PATH.DATA)) {
            console.log('创建备份文件夹....');
            await fs.mkdir(__PATH.DATA);
        }
        // 确保子目录存在
        for (const sub of ['bak', 'log', 'req', 'temp']) {
            const dir = __PATH.DATA + sub;
            if (!await this.check_file(dir)) {
                await fs.mkdir(dir);
            }
        }
        const paths = await fs.readdir(__PATH.DEF_DATA);
        for (let i = 0; i < paths.length; i++) {
            const _src = __PATH.DEF_DATA + paths[i];
            const _dst = __PATH.DATA + paths[i];
            if (!await this.check_file(_dst)) {
                const stat = await fs.stat(_src);
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
    getServers() {
        return DB.getServers();
    }
};
