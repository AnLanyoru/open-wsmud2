import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "半山亭";
    desc = "这是半山亭。";
    exits = {
        "southeast": "fb/guangming/shanlu",
        "north": "fb/guangming/banshanyao",
    };
}
