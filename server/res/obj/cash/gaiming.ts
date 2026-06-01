import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { SKILL } from "../../../core/skill/skill.js";

export default class extends OBJ {
    unit = "张";
    name = "改名符";
    desc = "更改你的名字";
    grade = 2;
    value = 0;

    on_use(me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");

    me.notify("请说出你的名字(打开聊天框任意频道输入)：");
    me.send_commands("clearwait", "取消使用");
    me.wait_input = readname;
    return false;
}
}

function readname(me, cmd) {
    if (cmd == "clearwait") {
        me.wait_input = null;
        return me.notify("停止使用");
    }
    if (!cmd) return me.send('请说出你的名字(打开聊天框任意频道输入)：');
    var ss = cmd.split(' ');
    if (ss.length != 2) return me.notify("请说出你的名字(打开聊天框任意频道输入)：");
    var name = ss[1];
    var name_reg = /^[\u4E00-\u9FA5]{2,5}$/;
    if (!name_reg.test(name)) {
        return me.send('你的名字需要是2-5个中文字符');
    }
    if (!UTIL.check_word(name)) {
        return me.send('你不能用这个名字');
    }
    var obj = me.find_obj_bypath("cash/gaiming");
    if (!obj || !obj.count) {
        me.wait_input = null;
        me.send('你身上没有改名符，改名失败。');
        return;
    }
    update_name(me, name, obj);
    return false;
}
async function update_name(me, name, obj) {
    try {
        let result = await WORLD.DB.change_name(me.id, me.userid, name);
        if (!result) return me.send('名称更改失败，请联系管理员');
        me.wait_input = null;
        me.name = name;
        me.color_name = null;
        me.commands_json = null;
        me.environment.item_changed(me, true);
        me.remove_obj(obj, 1);
        var pt = me.query_party();
        if (pt) {
            for (var i = 0; i < pt.roles.length; i++) {
                if (pt.roles[i].id == me.id) {
                    pt.roles[i].name = me.name;
                    break;
                }
            }
        }
        if (me.query_temp('wife')) {
            var wife = WORLD.getUser(me.query_temp('wife'));
            if (wife) {
                wife.add_title(name + '的老婆', 'mar');
                wife.set_temp('husband_n', name);
            }

        }
        if (me.query_temp('husband')) {
            var husband = WORLD.getUser(me.query_temp('husband'));
            if (husband) {
                husband.add_title(name + '的老公', 'mar');
                husband.set_temp('wife_n', name);
            }
        }
        if (me.custom_skills) {
            for (let skid of me.custom_skills) {
                var sk = SKILL.get(skid);
                if (sk) {
                    sk.desc = name + "所创造的武功";
                }
            }
        }
        return me.send('你的名字已经改为：' + name + "。");


    } catch (err) {
        if (err.errno == 1062) {
            return me.send('这个名字已经有人使用了。');
        } else {
            me.wait_input = null;
            return me.send('名称更改失败，请联系管理员');
        }
    }

}
