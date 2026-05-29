import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "dice";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /^(\d)\s(\w+)$/;
this.enter = function (me, type, objid) {
    if (!me.team) return me.send("你没有在队伍里。");
    if (!me.team.objs || !me.team.objs.length) return me.send("目前没有等待分配的战利品。");
    var item = null;
    for (var i = 0; i < me.team.objs.length; i++) {
        if (me.team.objs[i].id == objid) {
            item = me.team.objs[i];
            break;
        }
    }
    if (!item) return me.send("目前没有这个战利品等待分配。");


    if (!item.dice) return;
    if (!item.dice.users.remove(me.id)) return me.send("目前没有这个战利品等待分配。");

    type = parseInt(type);
    if (!(type >= 0)) return;
    var num = me.random(100) + 1;
    var msg = null;
    if (type === 2) {
        num = 0;
        msg = me.name + "放弃" + item.color_name + "。";
    } else if (type === 0) {
        switch (me.random(5)) {
            case 3:
                msg = "<hig>" + me.name + "：天灵灵，地灵灵，看我骰子来显灵，这" + item.unit + item.color_name + "是我的了，" + num +"点。</hig>";
                break;
            case 2:
                msg = "<hig>" + me.name + "大喝一声：对不住了各位，这" + item.unit + item.color_name + me.callme() + "要了，" + num + "点。</hig>";
                break;
            case 1:
                msg = "<hig>" + me.name + "笑眯眯地说道：各位，这" + item.unit + item.color_name + "与" + me.callme() + "有缘，" + num + "点。</hig>";
                break;
            default:
                msg = "<hig>" + me.name + "哈哈笑道：运气不错，" + me.callme() + "刚好需要这" + item.unit + item.color_name + "，" + num + "点。</hig>";
                break;
        }
        num += 100;
    } else {
        switch (me.random(5)) {
            case 3:
                msg = "<hic>" + me.name + "：我的，我的，都是我的，说不定运气好，这" + item.unit + item.color_name + "没人要就是我的了，" + num + "点。</hic>";
                break;
            case 2:
                msg = "<hic>" + me.name + "嘿嘿笑道：这" + item.unit + item.color_name  + "不错，可以卖个好价钱，" + num + "点。</hic>";
                break;
            case 1:
                msg = "<hic>" + me.name + "笑眯眯地说道：嗯？" + item.color_name + "，说不定与" + me.callme() + "有缘，" + num + "点。</hic>";
                break;
            default:
                msg = "<hic>" + me.name + "哈哈笑道：这" + item.unit + item.color_name + "虽然不需要，但是拿着也没坏处，" + num + "点。</hic>";
                break;
        }
    }
    me.send_team(msg);
    if (num > item.dice.num) {
        item.dice.user = me.id;
        item.dice.num = num;
    }
    if (item.dice.users.length===0) {
        me.team.alloc(item);
    }
}
}
