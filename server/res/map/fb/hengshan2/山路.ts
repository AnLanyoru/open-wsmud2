import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山路";
    desc = "这是山路。";
    exits = {
        "west": "fb/hengshan2/衡阳城",
        "southeast": "fb/hengshan2/南天门",
    };
}
