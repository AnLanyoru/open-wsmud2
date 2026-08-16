import crypto from 'crypto';
const authKey = __CONFIG.DESIV;
const md5add = __CONFIG.MD5;
const SessionKey = 'u';
const SessionToken = 'p';
const SessionMaxAge = 3600000 * 24 * 180;
const CookieOptions = {
    maxAge: SessionMaxAge,
    sameSite: 'lax',
    path: '/',
};

class Apibase {
    constructor(req, res) {

        this.loginUser = null;
        this.req = req;
        this.res = res;
    }

    error(code = 500, message) {
        return this.res.status(code).json({error: message});
    }

    signIn(id, uname, pwd, level) {
        if (!(id > 0)) return null;
        let key = this.req.cookies[SessionKey];
        if (!key) {
            key = this.sessionKey();
            this.res.cookie(SessionKey, key, CookieOptions);
        }
        let cert = this.encryptUser(id, uname, pwd, level);
        if (!cert) return null;
        this.res.cookie(SessionToken, cert, CookieOptions);
        return cert;
    }

    sessionKey() {
        return this.req.session.id;
    }

    getUser() {
        if (this.loginUser) return this.loginUser;

        let key = this.req.cookies[SessionKey];
        if (!key) {
            this.res.cookie(SessionKey, this.sessionKey(), CookieOptions);
        }
        let str = this.req.cookies[SessionToken];
        if (!str) return;
        this.loginUser = this.deEncryptUser(str);
        return this.loginUser;
    }

    deEncryptUser(cert) {
        const txt = this.deEncrypt(cert);
        if (!txt) return null;
        const str = txt.split("%");
        if (str.length !== 5) return null;
        const id = parseInt(str[1]);
        const time = parseInt(str[3]);
        const age = Date.now() - time;
        if (id > 0 && Number.isFinite(time) && age >= 0 && age <= SessionMaxAge)
            return {
                id: id,
                name: str[2],
                pwd: str[0],
                time: time,
                level: str[4],
            };
        return null;
    }

    deEncrypt(str) {
        if (!str) return null;
        try {
            const data = Buffer.from(str, 'base64');
            const nonce = data.subarray(0, 12);
            const tag = data.subarray(data.length - 16);
            const ciphertext = data.subarray(12, data.length - 16);

            const decipher = crypto.createDecipheriv('aes-128-gcm', authKey, nonce);
            decipher.setAuthTag(tag);

            let plain = decipher.update(ciphertext);
            plain = Buffer.concat([plain, decipher.final()]);
            return plain.toString('utf8');
        } catch (e) {
            return null;
        }
    }


    MD5(str) {
        let md5 = crypto.createHash('md5');
        let result = md5.update(str + md5add).digest('hex');
        return result.toUpperCase();
    }

    encrypt(str) {
        if (!str) return;
        const nonce = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-128-gcm', authKey, nonce);
        let encrypted = cipher.update(str, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([nonce, encrypted, tag]).toString('base64');
    }

    encryptUser(id, uname, pwd, level) {
        return this.encrypt([pwd, id, uname,
            Date.now(), level].join('%'));
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

const idstr = "0123456789abcdefghijklmnopqrstuvwxyz";

export default Apibase;
