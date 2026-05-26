
var crypto = require('crypto');
module.exports = {
    max_idcount: 10,
    max_ipcount: 12,
    login_error: function (user, msg, close = true) {
        user.send(`{type:'loginerror',msg:'${msg}'}`);
        if (close)
            user.socket?.end();
        return false;
    },
    encryptUser: function (key, session) {
        if (!key || !session) return null;
        if (key.length >= 16) key = key.substr(0, 16);
        try {
            key = Buffer.from(key, 'utf8');
            var decipher = crypto.createDecipheriv('aes-128-cbc', key, __CONFIG.DESIV);
            var txt = decipher.update(session, 'base64', 'utf8');
            txt += decipher.final('utf8');
            var str = txt.split("%");
            if (str.length !== 5) return null;
            var id = parseInt(str[0]);
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

    }


}
