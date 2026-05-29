


const APIBASE = require('./base');
const svgCaptcha = require('svg-captcha');
const { DB } = __CONFIG;
const CODEREG = /^[A-Za-z0-9_]{3,20}$/;
class UserAPI extends APIBASE {

    async login(user) {
        let { code, pwd } = user;

        if (!code || !pwd) {
            return { code: 0, result: "用户名或密码错误" };
        }
        code = code.toLowerCase();
        if (!CODEREG.test(code))
            return { code: 0, result: "用户名格式错误" };
        pwd = this.MD5(pwd);
        let result = await DB.getUserBy("name", code);
        if (!result)
            return { code: 0, result: "用户不存在" };
        if (result.pwd !== pwd)
            return { code: 0, result: "用户密码错误" };
        let cert = this.signIn(result.id, result.name, pwd, result.level);
        if (cert)
            return { code: 1, p: cert, u: this.sessionKey() };
        return { code: 0, result: "登陆失败" };
    }
    checkValCode(code) {
        if (!code) return false;
        let num = this.getSession("valno");
        if (!num) return false;

        return code.toLowerCase() == num.toLowerCase();
    }
    async regist(user) {
        if (!user.name || !user.pwd) {
            return { code: 0, result: "注册失败，缺少数据" };
        }
        if (user.name.length > 15 || user.name.length < 3) {
            return { code: 0, result: "注册失败，缺少数据" };
        }
        if (user.pwd.length < 5) {
            return { code: 0, result: "注册失败，缺少数据" };
        }
        if (!this.checkValCode(user.valno)) {
            return { code: 0, result: "验证码输入错误" };
        }
        user.pwd = this.MD5(user.pwd);
        user.name = user.name.toLowerCase();
        user.phone = user.phone ?? null;
        user.link_user = user.guider > 0 ? user.guider : 0;
        if (await DB.getUserBy("name", user.name)) {
            return { code: 0, result: "注册失败，账号已经有人使用" };
        }
        if (!await DB.createUser(user)) {
            return { code: 0, result: "注册失败" };
        }
        this.deleteSession("valno");
        this.signIn(user.id, user.name, user.pwd, 0);
        return { code: 1 };
    }
    async validimage() {
        const captcha = svgCaptcha.create({
            size: 4,           // 验证码长度
            noise: 2,          // 干扰线条数量
            color: true,       // 文字是否彩色
            background: '#337AB7', // 背景色
        });

        this.setSession('valno', captcha.text)
        return Buffer.from(captcha.data).toString('base64');
    }
    async getphone() {
        const user = this.getUser();
        if (!user)
            return { code: 0, result: "未登录" };
        let result = await DB.getUserBy("id", user.id);
        if (!result) return { code: 0, result: "不存在的用户" };
        return { code: 1, result: result.phone ? result.phone.substring(0, 3) + "********" : "" };
    }
    async bindphone(data) {
        const user = this.getUser();
        if (!user)
            return { code: 0, result: "未登录" };
        let { code, no, pwd } = data;
        let result = await DB.getUserBy("id", user.id);
        if (!result) return { code: 0, result: "不存在的用户" };
        if (result.phone) {
            if (!code || code.length !== 4)
                return { code: 0, result: "手机尾号格式错误" };
            if (!result.phone.endsWith(code))
                return { code: 0, result: "错误的手机尾号" };
            user.phone = null;
        } else {
            if (!no || !/^1\d{10}$/.test(no))
                return { code: 0, result: "手机号格式错误" };
            user.phone = no;
        }
        pwd = this.MD5(pwd);
        if (pwd !== user.pwd)
            return { code: 0, result: "密码错误" };
        if (await DB.updateUser(user))
            return { code: 1 };
        return { code: 0 };
    }

    async resetpwd(paras) {
        let {
            name, phone, vcode, pwd
        } = paras;
        if (!name || !phone || !pwd)
            return { code: 0 };
        const result = await DB.getUserBy("name", name);
        if (!result)
            return { code: 0, result: "账号不存在" };
        if (!result.phone || result.phone !== phone) {
            return { code: 0, result: "手机号验证失败" };
        }
        pwd = this.MD5(pwd);
        result.pwd = pwd;
        if (!await DB.updateUser(result)) {
            return { code: 0, result: "密码重置失败。" };
        }
        return { code: 1 };
    }
    async changepassword(data) {
        let { oldpwd, pwd, no } = data;
        if (!oldpwd || !pwd)
            return { code: 0 };
        oldpwd = this.MD5(oldpwd);
        pwd = this.MD5(pwd);
        const user = this.getUser();
        if (!user)
            return { code: 0, result: "未登录" };
        const result = await DB.getUserBy("id", user.id);
        if (!result)
            return { code: 0, result: "账号不存在" };

        if (result.pwd !== oldpwd) {
            return { code: 0, result: "原始密码输入错误。" };
        }
        if (result.phone) {
            if (!no || no.length !== 4)
                return { code: 0, result: "手机尾号格式错误" };
            if (!result.phone.endsWith(no))
                return { code: 0, result: "错误的手机尾号" };
        }
        user.pwd = pwd;
        result.pwd = pwd;
        if (!await DB.updateUser(result)) {
            return { code: 0, result: "密码修改失败。" };
        }
        let cert = this.signIn(user.id, user.name, pwd, user.level);
        if (cert)
            return { code: 1, p: cert, u: this.sessionKey() };
        return { code: 0, result: "登陆凭证更新失败" };


    }

    async GetPhone2(paras) {
        let { uid, cert } = paras; debugger
        if (!uid || cert !== 'transrole_service') return;
        let user = await DB.getUserByID(uid);
        if (!user) return "";
        return user.phone;
    }
}

module.exports = UserAPI;












// this.inherits('api/base');

// this.define = {
//     Login: { method: "Post", paras: ["code", "pwd"] }
// }
// const DB = this.import('/lib/mysql');
// let servers = null;

// this.Login = async function (code, pwd) {


// }

// this.GetUser = async function (cond, pars) {

//     let sql = "select ID,Name,EMAIL,PHone,State,Developer,IsFirst from users";
//     if (cond) {
//         sql += " where " + cond;
//     }
//     return await DB.query(sql, pars);

// }