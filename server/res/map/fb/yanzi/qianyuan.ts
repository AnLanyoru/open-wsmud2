import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "前院";
    desc = "这是前院。";
    exits = {
        "east": "fb/yanzi/dating",
        "west": "fb/yanzi/zhuangmen",
        "south": "fb/yanzi/xiaojing",
    };
}
