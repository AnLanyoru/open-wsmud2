import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "钱庄";
    desc = "这是一家老字号的钱庄，已有几百年的历史，在全国各地都有分店。它发行的银票信誉非常好，通行全国。帐台上有一个牌子。";
    exits = { "east": "yz/beidajie1" };
    no_fight = true;
    allow_store = true;

    constructor() {
        super();
        this.add_action("store", "打开仓库");
        this.set_npc("pub/qian");
        this.add_action('drop', null, function (me) { return me.notify('这里人多手杂，不能乱丢东西。'); });
    }
}
