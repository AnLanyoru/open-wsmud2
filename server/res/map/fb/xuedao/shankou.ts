import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山口";
    desc = "这是山口。";
    exits = {
        "south": "fb/xuedao/shangu",
    };
}
