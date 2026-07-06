import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "松风观";
    desc = "这是松风观。";
    exits = {
        "south": "fb/qingcheng/shangqing",
        "north": "fb/qingcheng/zhongmen",
    };
}
