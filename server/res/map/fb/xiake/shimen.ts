import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "石门";
    desc = "这是石门。";
    exits = {
        "west": "fb/xiake/shibi",
    };
}
