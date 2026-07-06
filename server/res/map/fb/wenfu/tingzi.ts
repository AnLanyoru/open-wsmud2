import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "亭子";
    desc = "这是亭子。";
    exits = {
        "south": "fb/wenfu/zoulangtou",
    };
}
