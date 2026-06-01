import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import { NPC } from "../../../core/char/npc.js";

export default class extends ROOM {
    name = "玄武台";
    desc = "这里是武道塔顶部的北面平台，一座玄武的雕塑凭空而立，传说中的四大守护神兽之一。";
    exits = { "south": "wudao/ding" };
    max_item_count = 1;
    is_shadow = true;
    no_relive = true;

    on_enter(me) {
    let npc = NPC.CLONE('pub/wudao_ss');
    npc.init_from(me, 2);

    this.item_changed(npc, true);
    npc.do_kill(me);
}
    on_leave(me) {
    let npc = this.find_obj_bypath('pub/wudao_ss');
    if (npc) npc.destroy();
    me.remove_status('ss');
}
}

