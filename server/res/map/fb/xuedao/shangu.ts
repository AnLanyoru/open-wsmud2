import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山谷";
    desc = "这是山谷。";
    exits = {
        "north": "fb/xuedao/shankou",
        "south": "fb/xuedao/wangyou",
    };
}
