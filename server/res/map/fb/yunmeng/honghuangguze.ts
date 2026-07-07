import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "洪荒古泽";
    exits = {
        "south": "fb/yunmeng/huozhao2",
        "north": "fb/yunmeng/huozhao4",
    };
}
