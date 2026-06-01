import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

interface DiceItem {
    id: string;
    color_name: string;
    unit: string;
    dice: {
        users: string[];
        num: number;
        user: string;
    };
}

export default class extends COMMAND {
    command = "dice";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\d)\s(\w+)$/;

    enter(me: CHARACTER, type: string, objid: string): void {
    if (!me.team) return me.send("你没有在队伍里。");
    var objs = me.team.objs;
    if (!objs || !objs.length) return me.send("目前没有等待分配的战利品。");
    var item: DiceItem | null = null;
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].id == objid) {
            item = objs[i];
            break;
        }
    }
    if (!item) return me.send("目前没有这个战利品等待分配。");


    if (!item.dice) return;
    if (!item.dice.users.remove(me.id)) return me.send("目前没有这个战利品等待分配。");

    var num = me.random(100) + 1;
    var msg: string | null = null;
    if (parseInt(type) === 2) {
        num = 0;
        msg = me.name + "放弃" + item.color_name + "。";
    } else if (parseInt(type) === 0) {
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
        me.team.alloc!(item);
    }
}
}
