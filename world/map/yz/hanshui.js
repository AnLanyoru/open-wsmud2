import { ROOM } from "../../../os/room/room.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(ROOM);
this.name = "江边"
this.no_fight = true;
this.desc = "面前是一条波涛翻滚的大江 。浊流滚滚，万舟竞发。两岸渡船来来往往，江边一长溜摆满了鱼摊，渔家就将船泊在岸边，几个破萝支一块木板，板上摆满了活蹦乱跳的汉江鲤鱼。"
this.exits = { "south": "yz/beimen" };
this.can_diaoyu = true;
this.add_action("diao", "钓鱼", function (me) {
    return WORLD.COMMANDS['diaoyu'].enter(me);
});
}
