
this.inherits(COMMAND);
this.command = "login";
this.allow_login = true;
this.enter = function (user, id) {
    if (user.id) return;

    if (user.serverid !== WORLD.SERVERID) return;

    user.ip_address = user.socket.remoteAddress;
    const oldUser = this.check_user(user, id);
    if (!oldUser) return;
    if (oldUser.id) {
        this.relogin(oldUser, user);
    } else {
        this.loginIn(user, id);
    }
}
this.check_user = function (loginuser, id) {
    for (var i = 0; i < WORLD.USERS.length; i++) {
        let user = WORLD.USERS[i];
        if (user.id === id) {
            return user;
        }
        //其他检测loginuser
    }
    return {};
}
this.relogin = async function (oldUser, user) {
    if (oldUser.userid === user.userid) {
        if (!this.on_user_relogin(oldUser, user) !== false) return;
        // 验证新连接token中的密码与数据库一致
        try {
            var dbUser = await WORLD.DB.getUserByID(user.userid);
            if (!dbUser || dbUser.pwd !== user.password) {
                return user.send("{type:'loginerror',msg:'密码已修改，请<CMD onclick=\\'HideAndShow(\"#login_panel\")\\'>重新登录</CMD>'}");
            }
        } catch (e) {
            return user.send("{type:'loginerror',msg:'登录验证失败'}");
        }
        if (oldUser.loginTime > user.loginTime) {
            return user.send("{type:'loginerror',msg:'已有更新的登录，请<CMD onclick=\\'HideAndShow(\"#login_panel\")\\'>重新登录</CMD>'}");
        }
        oldUser.password = user.password;
        oldUser.loginTime = user.loginTime;

        oldUser.ip_address = user.socket.remoteAddress;
        oldUser.disconnect(true);
        user.socket.setTimeout(0);
        return oldUser.relogin(user);
    } else {
        WORLD.log(null, "登陆失败：" + oldUser.id + ",原始ID："
            + oldUser.userid + "，现在ID：" + user.userid);
        return user.send("{type:'loginerror',msg:'当前使用的登陆凭证和角色不一致'}");
    }
}
this.on_user_relogin = function (user, me) {

    if (user.state && user.state.id == "cross") {
        if (user.state.is_over || Date.now() - user.state.stime > 1800000) {
            user.moveto(user.query_temp("enter_room") || "yz/wumiao");
            return true;
        } else {
            me.send("{type:'cross',sid:" + user.state.sid + ",pid:'" + user.id + "',cross_type:'" + user.state.cross_type + "'}");
        }
        return false;
    }

    return true;
}

this.loginIn = async function (user, id) {
    try {
        const data = await WORLD.DB.getRoleData(user.userid, id);
        if (!data) return user.send("{type:'loginerror',msg:'角色读取失败，请重新登陆 '}");

        oldUser = WORLD.getUser(id);
        if (oldUser) return user.send("{type:'loginerror',msg:'重复登录'}");
        if (data.pwd !== user.password)
            return user.send("{type:'loginerror',msg:'密码失效，请<CMD onclick=\\'Process.relogin()\\'>重新登录</CMD>'}");

        WORLD.USERS.push(user);

        user.loadData(data);
        user.do_login();
        user.wait_input = null;
        if (user.socket)
            user.socket.setTimeout(0);
        this.on_user_login(user);
    } catch (e) {
        console.error('登陆失败', e);
        WORLD.log(user, "登陆失败", e.message);
        user.send("{type:'loginerror',msg:'数据加载失败'}");
    }
}




this.on_user_login = function (user) {
    user.send("欢迎登陆<HIW>MUD游戏</HIW>");


    const area = user.environment.parent;
    area.on_login && area.on_login(user);

    if (user.force_skill.on_relive) {
        user.force_skill.on_relive(user);
    }

}
