import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "舍利塔";
    exits = {
        "southwest": "fb/tianlong/wuwo",
        "southeast": "fb/tianlong/wule",
        "north": "fb/tianlong/talin",
        "south": "fb/tianlong/baodian",
    };
}
