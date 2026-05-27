/**
 * 登录/会话解密模块
 */

const crypto = require('crypto');
/**
 * @type {{
 *   max_idcount: number,
 *   max_ipcount: number,
 *   login_error: function(USER, string, boolean=): boolean,
 *   encryptUser: function(string, string): {id: number, name: string, pwd: string, loginTime: number, level: number}|null
 * }}
 */
module.exports = {
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

    }


}
