import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const UTIL = globalThis.UTIL;
this.inherits(COMMAND);
this.command = "createrole";
var name_reg = /^[\u4E00-\u9FA5]{2,5}$/;
var id_reg = /^[a-z][a-z0-9]{2,9}$/;
this.allow_login = true;
this.enter = function (me, pars) {
    if (me.id) return me.send('{"type":"regist","result":"请刷新页面重新操作"}');
    pars = pars.split(' ');
    var name = pars[0], gender = parseInt(pars[1]),
        str = parseInt(pars[2]), con = parseInt(pars[3]), dex = parseInt(pars[4]), int = parseInt(pars[5]);


    if (gender != 1 && gender != 2) {
        return me.send('{"type":"regist","result":"注册信息错误"}');
    }
    if (!name_reg.test(name)) {
        return me.send('{"type":"regist","result":"姓名需要是2-5个汉字"}');
    }
    if (!UTIL.check_word(name)) {
        return me.send('{"type":"regist","result":"你不能用这个名字"}');
    }
    if (WORLD.find_user(name)) {
        return me.send('{"type":"regist","result":"这个名字已经有人用了"}');
    }


    if (str < 15 || str > 30) {
        return me.send('{"type":"regist","result":"力量属性需要在15-30之间。"}');
    }
    if (con < 15 || con > 30) {
        return me.send('{"type":"regist","result":"根骨属性需要在15-30之间。"}');
    }
    if (dex < 15 || dex > 30) {
        return me.send('{"type":"regist","result":"身法属性需要在15-30之间。"}');
    }
    if (int < 15 || int > 30) {
        return me.send('{"type":"regist","result":"悟性属性需要在15-30之间。"}');
    }
    if (str + con + dex + int != 80) {
        return me.send('{"type":"regist","result":"属性之和必须等于80"}');
    }

    me.ip_address = me.socket.remoteAddress;
    if (!WORLD.USERLOGIN.check_user(me)) return;

    me.name = name;
    me.id = UTIL.create_id();
    me.gender = gender;
    me.level = 0;
    me.exp = 0;
    me.pot = 0;
    //me.age = 14;
    me.str = str;
    me.con = con;
    me.dex = dex;
    me.int = int;
    me.per = parseInt(Math.random() * 5) + 20;
    me.kar = 20;
    me.limit_mp = 0;
    me.max_mp = 100;
    me.recount();
    me.hp = me.max_hp;
    me.mp = me.max_mp;
    me.reg_time = parseInt(Date.now() / 60000);
    me.set_objects(["eq/lv0/cloth", 1, 1]);
    me.set_temp("new", 1);
    me.set_temp("sr", 1);
    me.set_temp("hy_ct", 50);
    me.set_setting("ban_pk", 1);
    me.eq_groups = [];
    me.sk_groups = [];
    me.skills = {};
    this.save2db(me);
}

this.save2db = async function (me) {
    try {
        let roleData = me.getData();
        roleData.server = WORLD.SERVERID;
        let suc = await WORLD.DB.addRole(roleData);
        if (suc) {
            WORLD.USERS.push(me);
            me.wait_input = null;
            me.do_login();
        } else {
            return me.send('{"type":"regist","result":"创建角色失败"}');
        }
    } catch (err) {
        if (err.errno == 1062) {
            me.id = null;
            return me.send('{"type":"regist","result":"角色名称重复，请重新输入"}');
        } else {
            console.log("角色创建失败", err, pars);
            return me.send('{"type":"regist","result":"创建角色失败"}');
        }
    }
}
}
