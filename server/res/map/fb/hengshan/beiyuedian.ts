import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "北岳殿";
    desc = "这是北岳殿。";
    exits = {
        "east": "fb/hengshan/jianxingfeng",
        "south": "fb/hengshan/shandao",
    };
}
