this.inherits(ROOM);
this.name = "谷物加工厂";
this.no_fight = true;
this.desc = "这是一间谷物加工厂，这里是谷子脱壳成米的地方。米厂老板是一个一看就知道是十分精明的干瘦的中年人，老是带着一脸奸笑。你可以看到许多人正在忙忙碌碌的工作着，门口挂著一块<CMD cmd='look sign'>牌子(sign)</cmd>。";
this.exits = { "east": "yz/nanmen" };
this.set_item("sign", "牌子", "现在正紧缺人手，急需雇佣一批短工来干活。", [[
    "work", "开始工作", start_work
]]);
this.add_action("work", "开始工作", start_work);
function start_work(me) {
    if (me.level > 1) return me.notify("老板嘿嘿一笑：我这里人手已经够了，做义工可没工钱的哟！");
    if (me.gender == 2) return me.notify("老板嘿嘿一笑：我这里可不招女人，你去成衣店和药店看看有没招工的！");
    me.send_room("$N开始辛苦地工作......", me);
    me.set_state({
        id: "work",
        type: "work",
        title: "工作中",
        player: me,
        rate: 2,
        on_enter: do_work,
        on_check: on_check,
        no_move: "你还在打工，乱走就没工钱拿了！",
        desc: '["你哼哧哼哧的背着一袋谷子，累的满头大汗。","加油呀！谁叫你穷呀！"]',
    });
    return true;
}
function on_check(me) {
    var exp = WORLD.DATA.exps[me.level];
    return me.send('你正在打工，每10秒增加' + exp + "点经验和潜能，1两<wht>白银</wht>。")
}
function do_work(me) {

    var exp = WORLD.DATA.get_exp(me);
    me.add_exp(exp, exp, 100 + me.random(20));
}