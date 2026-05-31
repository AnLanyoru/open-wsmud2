


module.exports = {
    DB: require('./data/sql'),
    init: async function () {
        if (!(this.WEB_PORT > 1000)) throw new Error('缺少环境配置WEB_PORT');
        if (!(parseInt(process.env.WS_PORT) > 1000)) throw new Error('缺少环境配置WS_PORT');
        if (!this.MD5) throw new Error('缺少环境配置md5');
        if (!this.DESIV) throw new Error('缺少环境配置DESIV');
        if (!this.SESSION_SECRET) throw new Error('缺少环境配置SESSION_SECRET');
        await this.DB.connect('database.db');
        // 首次启动：将 def_server 写入数据库作为种子数据
        const servers = await this.DB.getServers();
        if (!servers || servers.length === 0) {
            console.log('首次启动，写入默认服务器...');
            await this.DB.addServer({
                name: this.def_server.name,
                ip: this.def_server.ip,
                port: this.def_server.port,
                isdef: 1,
                istest: 0
            });
        }
    },
    WEB_HOST: process.env.WEB_HOST || "0.0.0.0",
    WEB_PORT: parseInt(process.env.WEB_PORT),
    CONNECT_LEVEL: 0,
    MD5: process.env.MD5_PREFIX,
    SESSION_SECRET: process.env.SESSION_SECRET,
    HEARTBEAT: 5000,

    DESIV: process.env.DESIV ? Buffer.from(process.env.DESIV, 'utf8') : null,

    def_server: {
        ip: process.env.WS_HOST || "127.0.0.1",
        port: parseInt(process.env.WS_PORT),
        id: 100,
        name: process.env.SERVER_NAME || "本地测试",
        istest: 0
    }
};