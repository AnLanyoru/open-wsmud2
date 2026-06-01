import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";

export default class extends ROOM {
    name = "成衣店";
    desc = "这里是扬州名媛贵妇常到之处，现在也挤得凄凄惨惨，脂粉横飞。因为这里卖的时尚，一直是她们最热衷的装扮。店主是个很可人的小女孩，你认真一看，顿时发现满个店堂里的女人加在一起，还不如她靓丽。店门口横横歪歪地写着几个大字。想来出自小宝手笔。";
    exits = { "down": "yz/zahuopu" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("yz/zeng");
        this.add_action("work", "开始工作", start_work);
    }
}

function start_work(me) {
    if (me.level > 1) return me.notify("曾柔：我这里人手已经够了，做义工可没工钱的哟！");
    if (me.gender == 1) return me.notify("曾柔不好意思道：小宝可不许我雇佣男工，你去药店试试。");
    me.send_room("$N开始在成衣店辛苦的打工......", me);
    me.set_state({
        id: "work",
        type: "work",
        title: "工作中",
        player: me,
        rate: 2,
        on_enter: do_work,
        no_move: "你还在打工，乱走就没工钱拿了！",
        desc: '["你缝制完成，放下手中的针线，擦了擦额头上的汗。","你拿把剪刀顺着布上的痕迹小心的裁着。","加油呀！谁叫你穷呀！"]',
    });
    return true;
}
function do_work(me) {

    var exp = WORLD.DATA.get_exp(me);
    me.add_exp(exp, exp, 100 + me.random(20));
}
