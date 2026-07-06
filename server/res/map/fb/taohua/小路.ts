import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小路";
    desc = "这是小路。";
    exits = {
        "south": "fb/taohua/试剑亭",
        "north": "fb/taohua/桃林出口",
    };
}
