import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "邀月宫";
    exits = {
        "northeast": "fb/yihua/changlang1",
        "southeast": "fb/yihua/woshi",
    };
}
