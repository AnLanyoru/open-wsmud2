


module.exports = {
    DB: require('./data/sql'),
    init: async function () {
        if (!(this.WEB_PORT > 1000)) throw new Error('缺少环境配置WEB_PORT');
        if (!(this.def_server.port > 1000)) throw new Error('缺少环境配置WS_PORT');
        if (!this.MD5) throw new Error('缺少环境配置md5');
        if (!this.DESIV) throw new Error('缺少环境配置DESIV');
        if (!this.SESSION_SECRET) throw new Error('缺少环境配置SESSION_SECRET');
        await this.DB.connect('database.db');
    },
    WEB_PORT: parseInt(process.env.WEB_PORT),
    CONNECT_LEVEL: 0,
    MD5: process.env.MD5_PREFIX,
    SESSION_SECRET: process.env.SESSION_SECRET,
    HEARTBEAT: 5000,

    DESIV: process.env.DESIV ? Buffer.from(process.env.DESIV, 'utf8') : null,

    def_server: {
        ip: "127.0.0.1",
        port: parseInt(process.env.WS_PORT),
        id: 100,
        name: "本地测试",
        istest: true
    }
};