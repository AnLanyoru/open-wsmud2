


const APIBASE = require('./base');
let SERVERS = null;
const { DB } = __CONFIG;
class GameAPI extends APIBASE {

    async servers(user) {
        if (!SERVERS) {
            SERVERS = await DB.getServers();
            if (!SERVERS) SERVERS = [];
            const hasDef = SERVERS.some(s => s.id === __CONFIG.def_server.id);
            if (!hasDef) SERVERS.push(__CONFIG.def_server);
        }
        return SERVERS;
    }
    async reload() {
        SERVERS = null;
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








