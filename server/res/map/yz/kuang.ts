import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";

export default class extends ROOM {
    name = "矿山";
    desc = "这里原来是一处高山，不知道什么原因崩塌了，四周散落着各种石块。据说有人在这里找到过稀有的宝石，所以有不少来来往往的人们背着背篓在这里碰运气。";
    exits = { "east": "yz/ximen" };
    max_count = 8;
    no_fight = true;

    constructor() {
        super();
        this.add_action("wa", "挖矿", function (me) {
            WORLD.COMMANDS['wk'].enter(me);
        });
    }
}

