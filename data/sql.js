const db = require('./db');


module.exports = {

    connect: async function (path) {
        await db.init(path);
    },
    close: function () {
        return db.close();
    },
    getUserBy: function (type, value) {
        return this.getUser(type + "=?", [value]);
    },
    getUserByID: function (id) {
        return this.getUser("id=?", [id]);
    },
    getUser: function (cond, paras) {
        let sql = "select id,name,pwd,phone,state,level from users";

        if (cond) {
            sql += " where " + cond;
        }
        return db.get(sql, paras);
    },
    getUsers: function (cond, paras) {
        let sql = "select id,name,pwd,phone,state,create_time from users";

        if (cond) {
            sql += " where " + cond;
        }
        return db.all(sql, paras);
    },
    checkUserName: function (name) {
        let sql = "select name,phone from users where name=?";// or phone=?
        return db.get(sql, [name]);
    },
    updateUser: async function (user) {
        let sql = "update users set name=?,phone=?,pwd=? where id=?";
        let result = await db.query(sql, [user.name, user.phone, user.pwd, user.id]);
        return result.changes === 1;
    },
    createUser: async function (user) {

        let result = await db.query("insert into users(name,pwd,phone) values(?,?,?)",
            [user.name, user.pwd, user.phone]);
        if (!(result.lastID > 0)) return false;
        user.id = result.lastID;
        return true;
    },



    getServers: function () {
        let sql = "select id,name, ip,port,istest,isdef,create_time,start_time from servers";

        return db.all(sql);
    },
    getServer: function (id) {
        let sql = "select id,name, ip,port,istest,isdef from servers where id=?";

        return db.get(sql, [id]);
    },
    saveServer: async function (data) {
        let sql = "update servers set name=?, ip=?,port=?,istest=?,isdef=? where id=?";

        let result = await db.query(sql, [data.name, data.ip, data.port, data.istest, data.isdef, data.id]);

        return result.changes === 1;
    },
    addServer: async function (data) {
        let sql = "insert into servers(name,ip,port,istest,isdef) values(?,?,?,?,?)";
        let result = await db.query(sql,
            [data.name, data.ip, data.port, data.istest, data.isdef]);

        return result.lastID;

    },
    deleteServer: function (id) {
        return db.query("delete from servers where id =?", [id]);
    },

    getRoles: function (uid, server) {
        return db.all("select a.id,a.name,a.title,a.level from players a where a.userid=? and a.sid=?",
            [uid, server]);

    },
    addRole: function (role) {

        return db.query("insert into players(userid,id,name,title,level,sid,data) values(?,?,?,?,?,?,?)",
            [role.userid, role.id, role.name, role.title, role.level, role.server, role.data]);

    },
    deleteRole: async function (userid, roleid) {

        let sql = "insert into players_bak(id,name,userid,title,level,sid,data,create_time,update_time) select id,name,userid,title,level,sid,data,create_time,update_time from players where id=? and userid=?";
        let result = await db.query(sql, [roleid, userid]);
        if (result.changes != 1)
            return false;
        sql = "delete from players where id=? and userid=?";
        result = await db.query(sql, [roleid, userid]);
        if (result.changes != 1)
            return false;
        return true;

    },
    saveRole: function (role) {
        return db.query("update players set name=?,title=?,level=?,data=? where userid=? and id=?",
            [role.name, role.title, role.level, role.data, role.userid, role.id]);
    },
    existsRoleName: function (name) {
        let sql = "select name from players where name=?";
        return db.get(sql, [name]);
    },

    getData: function (userid, id) {
        return db.get("select a.id,a.name,a.title,a.level,a.data,b.pwd,b.level user_level from players a left join users b on a.userid=b.id where a.userid=? and a.id=?",
            [userid, id]);
    },
    updateRoleName: function (id, userid, name) {
        return db.query("update players set name=? where id=? and userid=?",
            [name, id, userid]);
    },
    updateUserid: function (id, fromuserid, touserid) {
        return db.query("update players set userid=? where id=? and userid=?",
            [touserid, id, fromuserid]);
    }

};

