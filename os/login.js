/**
 * 登录/会话解密模块
 */

import crypto from 'crypto';
import { WORLD } from "./world.js";

const USERLOGIN = {
    max_idcount: 10,
    max_ipcount: 12,
    /**
     * 登录错误处理
     * @param {USER} user - 用户对象
     * @param {string} msg - 错误消息
     * @param {boolean} [close=true] - 是否关闭连接
     * @returns {boolean} false
     */
    login_error(user, msg, close = true) {
        user.send(`{type:'loginerror',msg:'${msg}'}`);
        if (close)
            user.socket?.end();
        return false;
    },
    /**
     * 解密用户会话信息
     * @param {string} key - 加密密钥(截取前16位)
     * @param {string} session - Base64编码的加密会话数据
     * @returns {{id: number, name: string, pwd: string, loginTime: number, level: number}|null} 解密失败返回null
     */
    encryptUser(key, session) {
        if (!key || !session) return null;
        if (key.length >= 16) key = key.substr(0, 16);
        try {
            key = Buffer.from(key, 'utf8');
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, __CONFIG.DESIV);
            let txt = decipher.update(session, 'base64', 'utf8');
            txt += decipher.final('utf8');
            const str = txt.split("%");
            if (str.length !== 5) return null;
            const id = parseInt(str[0]);
            if (id > 0)
                return {
                    id: id,
                    name: str[1],
                    pwd: str[2],
                    loginTime: parseInt(str[3]),
                    level: parseInt(str[4])
                };
        } catch (e) {
            return null;
        }

    },

    // ============ 登录扩展(由extends合并) ============

    /** @param {*} loginuser @param {number} id @returns {boolean} */
    check_user(loginuser, id) {
        return true;
    },

    /** @param {USER} user @param {string} str */
    async check_session(user, str) {
        if (user.userid) {
            return this.login_error(user, '参数错误');
        }
        str = str.split(" ");

        if (str.length < 2) {
            return this.login_error(user, '参数错误');
        }
        var cookieUser = this.encryptUser(str[0], str[1]);
        if (!cookieUser || cookieUser.id === 0) {
            return this.login_error(user, "登录参数错误，请使用账号密码<CMD onclick=\\'HideAndShow(\"#login_panel\")\\'>重新登录</CMD>");
        }

        try {
            var dbUser = await WORLD.DB.getUserByID(cookieUser.id);
            if (!dbUser || dbUser.pwd !== cookieUser.pwd) {
                return this.login_error(user, "密码已修改，请<CMD onclick=\\'HideAndShow(\"#login_panel\")\\'>重新登录</CMD>", true);
            }
        } catch (e) {
            return this.login_error(user, '登录验证失败，请稍后再试。');
        }

        user.user_level = cookieUser.level ?? 0;

        user.wait_input = null;
        user.userid = cookieUser.id;
        user.password = cookieUser.pwd;
        user.loginTime = cookieUser.loginTime;
        user.ip_address = user.socket.remoteAddress;
        if (cookieUser.id !== WORLD.admin_user) {
            if (WORLD.CONNECT_COUNT > WORLD.max_connect_count) {
                return this.login_error(user, '服务器人数过多，请稍后再试。');
            }
            if (str.length === 2 && WORLD.USERS.length > WORLD.max_user_count) {
                return this.login_error(user, '服务器人数过多，请稍后再试。');
            }
            if (!WORLD.before_login(user)) {
                return this.login_error(user, '服务器正在关闭或开启，请稍后再试。');
            }
        }

        if (str.length === 4) {
            if (parseInt(str[3]) !== WORLD.SERVERID)
                return this.login_error(user, '参数错误。');
            var data = WORLD.can_cross(str[2]);
            if (!data) {
                return this.login_error(user, '不允许登录');
            }
            WORLD.on_user_cross_login(user, data);
            return;
        } else {
            user.serverid = WORLD.SERVERID;
        }
        if (str[2]) {
            return this.wait_login(user, 'login ' + str[2]);
        }
        this.load_roles(user);
        user.wait_input = this.wait_login;
    },

    /** @param {USER} user @param {string} str */
    wait_login(user, str) {
        if (!str) return;
        var i = str.indexOf(' ');
        var cmd = str, pars = "";
        if (i > 0) {
            cmd = str.substr(0, i);
            pars = str.substr(i + 1);
        }
        const command = WORLD.COMMANDS[cmd];
        if (command && command.allow_login) {
            return WORLD.COMMANDS[cmd].enter(user, pars);
        }
    },

    /** @param {USER} user */
    async load_roles(user) {
        try {
            let roles = await WORLD.DB.getRoles(user.userid, user.serverid);

            if (!roles || !roles.length) {
                user.send("{type:'roles',roles:[]}");
            } else {
                var str = ["{type:'roles',roles:["];
                for (var i = 0; i < roles.length; i++) {
                    str.push("{name:'");
                    str.push(roles[i].name);
                    str.push("',title:'");
                    str.push(roles[i].title);
                    str.push("',id:'");
                    str.push(roles[i].id);
                    str.push("'}");
                    if (i !== roles.length - 1) str.push(",");
                }
                str.push("]}");
                user.send(str.join(""));
            }
        } catch (error) {
            console.error(user.userid, '角色读取 ', error);
            WORLD.log(null, "登陆失败：" + user.userid, error.message);
            return this.login_error(user, '数据读取失败');
        }
    },
};

export default USERLOGIN;
