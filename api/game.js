


const APIBASE = require('./base');
let SERVERS = null;
const { DB } = __CONFIG;
class GameAPI extends APIBASE {

    checkAdmin() {
        const user = this.getUser();
        if (!user || user.level < 6) return false;
        return true;
    }

    async servers(user) {
        if (!SERVERS) {
            try {
                SERVERS = await DB.getServers();
            } catch (e) {
                console.error('getServers DB error:', e);
                SERVERS = [];
            }
            if (!SERVERS || !Array.isArray(SERVERS)) SERVERS = [];
            SERVERS.forEach(s => { s.port = parseInt(s.port) || 0; });
            console.log('servers API returned:', JSON.stringify(SERVERS.map(s => ({ id: s.id, name: s.name, ip: s.ip, port: s.port }))));
        }
        return SERVERS;
    }
    async reload() {
        if (!this.checkAdmin()) return { code: 0, result: '无权限' };
        SERVERS = null;
        return { code: 1 };
    }
    async add_server(data) {
        if (!this.checkAdmin()) return { code: 0, result: '无权限' };
        const { name, ip, port, isdef, istest } = data;
        if (!name || !ip || !port) return { code: 0, result: '缺少参数' };
        const id = await DB.addServer({ name, ip, port: parseInt(port), isdef: isdef ? 1 : 0, istest: istest ? 1 : 0 });
        SERVERS = null;
        return { code: 1, id };
    }
    async save_server(data) {
        if (!this.checkAdmin()) return { code: 0, result: '无权限' };
        const { id, name, ip, port, isdef, istest } = data;
        if (!id || !name || !ip || !port) return { code: 0, result: '缺少参数' };
        await DB.saveServer({ id, name, ip, port: parseInt(port), isdef: isdef ? 1 : 0, istest: istest ? 1 : 0 });
        SERVERS = null;
        return { code: 1 };
    }
    async delete_server(data) {
        if (!this.checkAdmin()) return { code: 0, result: '无权限' };
        if (!data.id) return { code: 0, result: '缺少服务器ID' };
        await DB.deleteServer(data.id);
        SERVERS = null;
        return { code: 1 };
    }
    async search_role(paras) {
        const { type, value } = paras;
        if (!type || !value) return { code: 0, result: "错误参数" };
        if (!ALLOW_TYPES[type]) return { code: 0, result: "错误参数" };
        let cond = "";
        paras = [value]
        if (type === "uname") {
            cond = "where a.name=?";
        } else if (type === 'name') cond = 'where b.name=? or b.name is null'
        else if (type === 'phone') cond = 'where a.phone=?';

        let result = await DB.query_role(cond, paras);
        return { code: 1, result: result };
    }
}

const ALLOW_TYPES = {
    uname: true,
    name: true,
    phone: true
};
module.exports = GameAPI;








