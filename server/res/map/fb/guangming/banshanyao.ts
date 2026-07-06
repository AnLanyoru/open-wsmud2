import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "半山腰";
    desc = "这是半山腰。";
    exits = {
        "north": "fb/guangming/xiaolu1",
        "south": "fb/guangming/banshanting",
        "east": "fb/guangming/shanpo1",
    };
}
