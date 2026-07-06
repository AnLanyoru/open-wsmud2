import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "碎石小路";
    desc = "这是碎石小路。";
    exits = {
        "west": "fb/cihang/guangchang",
        "east": "fb/cihang/tingyu",
        "south": "fb/cihang/xiaolu3",
    };
}
