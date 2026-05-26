this.inherits(ROOM);
this.name = "白虎台"
this.desc = "这里是武道塔顶部的东面平台，一座白虎的雕塑凭空而立，传说中的四大守护神兽之一。";
this.exits = { "east": "wudao/ding" };
this.max_item_count = 1;
this.is_shadow = true;
this.no_relive = true;
// this.add_action('biguan', '聚魂', function (me) {
//     WORLD.COMMANDS['wsxl'].enter(me);
// });
this.on_enter = function (me) {
    let npc = NPC.CLONE('pub/wudao_ss');
    npc.init_from(me, 1);

    this.item_changed(npc, true);
    npc.do_kill(me);
}
this.on_leave = function (me) {
    let npc = this.find_obj_bypath('pub/wudao_ss');
    if (npc) npc.destroy();
    me.remove_status('ss');
}