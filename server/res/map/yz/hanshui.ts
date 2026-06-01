import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";

export default class extends ROOM {
    name = "江边";
    no_fight = true;
    desc = "面前是一条波涛翻滚的大江 。浊流滚滚，万舟竞发。两岸渡船来来往往，江边一长溜摆满了鱼摊，渔家就将船泊在岸边，几个破萝支一块木板，板上摆满了活蹦乱跳的汉江鲤鱼。";
    exits = { "south": "yz/beimen" };
    can_diaoyu = true;

    constructor() {
        super();
        this.add_action("diao", "钓鱼", function (me) {
            return WORLD.COMMANDS['diaoyu'].enter(me);
        });
    }
}

