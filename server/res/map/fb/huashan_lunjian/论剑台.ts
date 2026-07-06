import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "论剑台";
    desc = "这是论剑台。";
    exits = {
        "north": "fb/huashan_lunjian/北峰",
        "west": "fb/huashan_lunjian/西峰",
        "east": "fb/huashan_lunjian/东峰",
        "south": "fb/huashan_lunjian/南峰",
    };
}
