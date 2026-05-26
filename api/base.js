

const crypto = require('crypto');
const desvi = __CONFIG.DESIV;
const md5add = __CONFIG.MD5;
const SessionKey = 'u';
const SessionToken = 'p';

class Apibase {
    constructor(req, res) {

        this.loginUser = null;
        this.req = req;
        this.res = res;
    }
    error(code = 500, message) {
        return this.res.status(code).json({ error: message });
    }
    signIn(id, uname, pwd, level) {
        if (!(id > 0)) return null;
        let key = this.req.cookies[SessionKey];
        if (!key) {
            key = this.sessionKey();
            this.res.cookie(SessionKey, key, {
                maxAge: 3600000 * 24 * 180
            });
        }
        let cert = this.encryptUser(id, uname, pwd, key, level);
        if (!cert) return null;
        this.res.cookie(SessionToken, cert, {
            maxAge: 3600000 * 24 * 180
        });
        return cert;
    }
    sessionKey() {
        return this.req.session.id;
    }

    getUser() {
        if (this.loginUser) return this.loginUser;

        let key = this.req.cookies[SessionKey];
        if (!key) {
            this.res.cookie(SessionKey, this.sessionKey(), {
                maxAge: 3600000 * 24 * 180
            });
        }
        let str = this.req.cookies[SessionToken];
        if (!str) return;
        this.loginUser = this.deEncryptUser(key, str);
        return this.loginUser;
    }
    deEncryptUser(key, cert) {
        let txt = this.deEncrypt(key, cert);
        let str = txt.split("%");
        if (str.length !== 5) return null;
        let id = parseInt(str[0]);
        if (id > 0)
            return {
                id: id,
                name: str[1],
                pwd: str[2],
                time: parseInt(str[3]),
                level: str[4],
            };
        return null;
    }
    deEncrypt(key, str) {

        if (!key || !str) return;
        if (key.length > 16) key = key.substr(0, 16);
        key = Buffer.from(key, 'utf8');
        let decipher = crypto.createDecipheriv('aes-128-cbc', key, desvi);
        //decipher.setAutoPadding(true);
        let txt = decipher.update(str, 'base64', 'utf8');
        txt += decipher.final('utf8');

        return txt;
    }



    MD5(str) {
        let md5 = crypto.createHash('md5');
        let result = md5.update(str + md5add).digest('hex');
        return result.toUpperCase();
    }
    encrypt(str, key) {
        if (!key || !str) return;
        if (key.length > 16) key = key.substr(0, 16);
        key = Buffer.from(key, 'utf8');
        let decipher = crypto.createCipheriv('aes-128-cbc', key, desvi);

        // decipher.setAutoPadding(true);

        let txt = decipher.update(str, 'utf8', 'base64');

        txt += decipher.final('base64');
        return txt;
    }
    encryptUser(id, uname, pwd, key, level) {
        return this.encrypt([id, uname, pwd,
            Date.now(), level].join('%'), key);
    }

    setSession(key, value) {
        this.req.session[key] = value;
    }
    getSession(key) {
        return this.req.session[key];
    }
    deleteSession(key) {
        delete this.req.session[key];
    }


    start_sse() {
        if (this.res.headersSent) {
            throw new Error('已经发送响应头');
        }
        this.res.setHeader('Content-Type', 'text/event-stream');
        this.res.setHeader('Cache-Control', 'no-cache');
        this.res.setHeader('Connection', 'keep-alive');
        this.res.flushHeaders(); // 发送响应头
    }
    sse(data) {
        this.res.write(`data: ${JSON.stringify(data)}\n\n`); // 发送数据
    }
    end_sse() {
        this.res.end();
    }
    guid() {
        var str = [];
        str.push(parseInt((Date.now() - 1598376101624) / 1000).toString(16));
        let length = 32 - str[0].length;
        for (var i = 0; i < length; i++) {
            str.push(idstr[parseInt(Math.random() * idstr.length)]);
        }
        return str.join('');
    }
}

const idstr = "abcdefghijklmnopqrstuvwxwz0123456789";

module.exports = Apibase;
