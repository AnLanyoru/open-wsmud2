import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西厢房";
    desc = "这是西厢房。";
    exits = {
        "east": "fb/hengshan2/刘府大厅",
    };
}
