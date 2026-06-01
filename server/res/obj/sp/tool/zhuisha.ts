import { OBJ } from "../../../../core/item/obj.js";
import { WORLD } from "../../../../core/world.js";
import { NPC } from "../../../../core/char/npc.js";

export default class extends OBJ {
    unit = "个";
    name = "门派追杀令";
    desc = "门派追杀令，使用后可以召唤门派NPC追杀10分钟内击杀过自己门派NPC的玩家";
    grade = 1;
    value = 10000;

    on_use(me) {
    if (!me.is_player) return me.notify("你不能用追杀令。");
    me.notify("请说出你要追杀的玩家的名字(打开聊天框任意频道输入)：");

    me.wait_input = readname.bind(this);
    return false;
}
    on_create(path, par) {
    if (!par) {
        this.path = path + "#1";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv <= 5)) return;
    this.grade = lv;
}
}

function readname(me, cmd) {
    if (!cmd) return me.send('请说出你要追杀的玩家的名字(打开聊天框任意频道输入)：');
    var ss = cmd.split(' ');
    if (ss.length != 2) return me.notify("请说出你要追杀的玩家的名字(打开聊天框任意频道输入)：");
    var name = ss[1];
    var name_reg = /^[\u4E00-\u9FA5]{2,5}$/;
    if (!name_reg.test(name)) {
        return me.send('玩家的名字需要是2-5个中文字符');
    }
    me.wait_input = null;
    var obj = me.find_obj_bypath(this.path);
    if (!obj || !obj.count) {
        me.send('你身上没有追杀令。');
        return;
    }
    var user = WORLD.find_user(name);
    if (!user) return me.notify("没有这个玩家或者不在线。");
    var fam = me.family;
    if (!user.query_temp("killer_" + fam.id)) return me.notify(name + "和你的门派没有恩怨，你不能使用追杀令。");
    if (!me.remove_obj(obj, 1)) return;
    user.notify("<hir>" + fam.name + "对你发出追杀令，听天由命吧。</hir>");
    me.notify("<hir>追杀令已发出，一分钟内对方将被你的门派弟子追杀。</hir>");
    var npc = fam.create_npc(obj.grade-1);
    if (fam.boss) {
        fam.boss.do_command("chat", npc.name + "听令，即刻起追杀" + name + "，不得有误。");
    }
    npc.follow_kill(user);
}
