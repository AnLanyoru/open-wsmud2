import APIBASE from './base.js';
import svgCaptcha from 'svg-captcha';
const {DB} = __CONFIG;
const LOGIN_USERNAME_REG = /^[a-z0-9_]{3,20}$/;
const USERNAME_REG = /^[a-z][a-z0-9_]{4,14}$/;
const PHONE_REG = /^1\d{10}$/;
const PASSWORD_REG = /^.{6,20}$/;
const PHONE_SUFFIX_REG = /^\d{4}$/;
const normalizeUsername = value => typeof value === 'string' ? value.toLowerCase() : '';
const isNonEmptyString = value => typeof value === 'string' && value.length > 0;
const isValidPassword = value => typeof value === 'string' && PASSWORD_REG.test(value);

class UserAPI extends APIBASE {

    async login(user) {
        let {code, pwd} = user;

        if (!code || !pwd) {
            return {code: 0, result: "用户名或密码错误"};
        }
        code = normalizeUsername(code);
        if (!LOGIN_USERNAME_REG.test(code))
            return {code: 0, result: "用户名格式错误"};
        pwd = this.MD5(pwd);
        const result = await DB.getUserBy("name", code);
        if (!result)
            return {code: 0, result: "用户不存在"};
        if (result.pwd !== pwd)
            return {code: 0, result: "用户密码错误"};
        const cert = this.signIn(result.id, result.name, pwd, result.level);
        if (cert)
            return {code: 1, p: cert, u: this.sessionKey()};
        return {code: 0, result: "登陆失败"};
    }

    checkValCode(code) {
        const num = this.getSession("valno");
        this.deleteSession("valno");
        return Boolean(typeof code === 'string' && typeof num === 'string' && code.toLowerCase() === num.toLowerCase());
    }

    async regist(user) {
        if (!user.name || !user.pwd) {
            return {code: 0, result: "注册失败，缺少数据"};
        }
        user.name = normalizeUsername(user.name);
        if (!USERNAME_REG.test(user.name)) {
            return {code: 0, result: "用户名格式错误"};
        }
        if (!isValidPassword(user.pwd)) {
            return {code: 0, result: "密码长度在6到20之间"};
        }
        if (!this.checkValCode(user.valno)) {
            return {code: 0, result: "验证码输入错误"};
        }
        user.pwd = this.MD5(user.pwd);
        user.phone = user.phone ?? null;
        user.link_user = user.guider > 0 ? user.guider : 0;
        if (await DB.getUserBy("name", user.name)) {
            return {code: 0, result: "注册失败，账号已经有人使用"};
        }
        if (!await DB.createUser(user)) {
            return {code: 0, result: "注册失败"};
        }
        this.signIn(user.id, user.name, user.pwd, 0);
        return {code: 1};
    }

    async validimage() {
        const captcha = svgCaptcha.create({
            size: 4,
            noise: 2,
            color: true,
            background: '#337AB7',
        });

        this.setSession('valno', captcha.text);
        return Buffer.from(captcha.data).toString('base64');
    }

    async getphone() {
        const user = this.getUser();
        if (!user)
            return {code: 0, result: "未登录"};
        const result = await DB.getUserBy("id", user.id);
        if (!result) return {code: 0, result: "不存在的用户"};
        return {code: 1, result: result.phone ? result.phone.substring(0, 3) + "********" : ""};
    }

    async bindphone(data) {
        const user = this.getUser();
        if (!user)
            return {code: 0, result: "未登录"};
        const {code, no, pwd} = data;
        const result = await DB.getUserBy("id", user.id);
        if (!result) return {code: 0, result: "不存在的用户"};
        if (!isNonEmptyString(pwd)) return {code: 0, result: "请输入密码"};
        if (this.MD5(pwd) !== result.pwd) return {code: 0, result: "密码错误"};
        if (result.phone) {
            if (!PHONE_SUFFIX_REG.test(code))
                return {code: 0, result: "手机尾号格式错误"};
            if (!result.phone.endsWith(code))
                return {code: 0, result: "错误的手机尾号"};
            result.phone = null;
        } else {
            if (!PHONE_REG.test(no))
                return {code: 0, result: "手机号格式错误"};
            result.phone = no;
        }
        if (await DB.updateUser(result))
            return {code: 1};
        return {code: 0, result: "绑定修改失败"};
    }

    async resetpwd(data) {
        let {name, phone, pwd} = data;
        const failure = {code: 0, result: "密码重置失败"};
        name = normalizeUsername(name);
        if (!LOGIN_USERNAME_REG.test(name) || !PHONE_REG.test(phone) || !isValidPassword(pwd))
            return failure;
        const result = await DB.getUserBy("name", name);
        if (!result || !result.phone || result.phone !== phone)
            return failure;
        result.pwd = this.MD5(pwd);
        if (!await DB.updateUser(result))
            return failure;
        return {code: 1};
    }

    async changepassword(data) {
        let {oldpwd, pwd, no} = data;
        if (!isNonEmptyString(oldpwd) || !isNonEmptyString(pwd))
            return {code: 0, result: "缺少参数"};
        if (!isValidPassword(pwd))
            return {code: 0, result: "密码长度在6到20之间"};
        oldpwd = this.MD5(oldpwd);
        pwd = this.MD5(pwd);
        const user = this.getUser();
        if (!user)
            return {code: 0, result: "未登录"};
        const result = await DB.getUserBy("id", user.id);
        if (!result)
            return {code: 0, result: "账号不存在"};

        if (result.pwd !== oldpwd) {
            return {code: 0, result: "原始密码输入错误。"};
        }
        if (result.phone) {
            if (!PHONE_SUFFIX_REG.test(no))
                return {code: 0, result: "手机尾号格式错误"};
            if (!result.phone.endsWith(no))
                return {code: 0, result: "错误的手机尾号"};
        }
        result.pwd = pwd;
        if (!await DB.updateUser(result)) {
            return {code: 0, result: "密码修改失败。"};
        }
        const cert = this.signIn(user.id, user.name, pwd, user.level);
        if (cert)
            return {code: 1, p: cert, u: this.sessionKey()};
        return {code: 0, result: "登陆凭证更新失败"};
    }
}

export default UserAPI;
