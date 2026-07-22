import Util from './utils/util.js';

export default {
    Login: function (code, pwd, cb) {
        return Util.Post('api/user/login', {code: code, pwd: pwd}, cb);
    },
    ValidationImage: function (cb) {
        return Util.Get('api/user/validimage', cb);
    },
    Regist: function (user, cb) {
        return Util.Post('api/user/regist', user, cb);
    },
    Enter: function (guider, cb) {
        return Util.Get('e', [guider], cb);
    },
    ChangePassword: function (oldpwd, pwd, no, cb) {
        return Util.Post('api/user/changepassword', {oldpwd: oldpwd, pwd: pwd, no: no}, cb);
    },
    GetPhone: function (cb) {
        return Util.Get('api/user/getphone', cb);
    },
    BindPhone: function (code, no, pwd, cb) {
        return Util.Post('api/user/bindphone', {code: code, no: no, pwd: pwd}, cb);
    },
    ResetPasswordByPhone: function (name, phone, pwd, cb) {
        return Util.Post('api/user/resetpwd', {name: name, phone: phone, pwd: pwd}, cb);
    },
    GetServer: function (cb) {
        return Util.Get('api/game/servers', cb);
    }
};
