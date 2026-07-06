import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "狮子岩";
    desc = "这是狮子岩。";
    exits = {
        "east": "fb/hengshan2/望日台",
    };
}
