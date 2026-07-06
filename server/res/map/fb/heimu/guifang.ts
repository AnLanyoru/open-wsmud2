import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "闺房";
    desc = "这是闺房。";
    exits = {
        "west": "fb/heimu/huayuan",
    };
}
