import Util from './utils/util.js';

export default {
    Login: function (code, pwd, cb) {
        return Util.Post('api/user/login', { code: code, pwd: pwd }, cb);
    },
    IsRegistValidation: function (cb) {
        return Util.Get('UserAPI/IsRegistValidation', cb);
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
        return Util.Post('api/user/changepassword', { oldpwd: oldpwd, pwd: pwd, no: no }, cb);
    },
    LoginOut: function (cb) {
        return Util.Get('UserAPI/LoginOut', cb);
    },
    GetRoles: function (userid, cb) {
        return Util.Get('UserAPI/GetRoles', [userid], cb);
    },
    AddRole: function (player, cb) {
        return Util.Post('UserAPI/AddRole', { player: player }, cb);
    },
    GetUser: function (cb) {
        return Util.Get('UserAPI/GetUser', cb);
    },
    Search: function (userid, key, type, cb) {
        return Util.Get('UserAPI/Search', [userid, key, type], cb);
    },
    ResetPassword: function (userid, cb) {
        return Util.Get('UserAPI/ResetPassword', [userid], cb);
    },
    RecoverUser: function (pid, cb) {
        return Util.Get('UserAPI/RecoverUser', [pid], cb);
    },
    LoadPlayer: function (pid, isDelete, cb) {
        return Util.Get('UserAPI/LoadPlayer', [pid, isDelete], cb);
    },
    GetPhone: function (cb) {
        return Util.Get('api/user/getphone', cb);
    },
    BindPhone: function (code, no, pwd, cb) {
        return Util.Post('api/user/bindphone', { code: code, no: no, pwd: pwd }, cb);
    },
    SendValidateCode: function (no, cb) {
        return Util.Get('UserAPI/SendValidateCode', [no], cb);
    },
    ResetPasswordByPhone: function (name, phone, vcode, pwd, cb) {
        return Util.Post('api/user/resetpwd', { name: name, phone: phone, vcode: vcode, pwd: pwd }, cb);
    },
    NewServer: function (cb) {
        return Util.Get('UserAPI/NewServer', cb);
    },
    GetServer: function (cb) {
        return Util.Get('api/game/servers', cb);
    }
};
