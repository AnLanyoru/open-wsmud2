import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "论剑台";
    exits = {
        "north": "fb/huashan_lunjian/beifeng",
        "west": "fb/huashan_lunjian/xifeng",
        "east": "fb/huashan_lunjian/dongfeng",
        "south": "fb/huashan_lunjian/nanfeng",
    };
}
