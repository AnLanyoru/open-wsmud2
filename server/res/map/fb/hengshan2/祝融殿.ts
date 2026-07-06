import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "祝融殿";
    desc = "这是祝融殿。";
    exits = {
        "north": "fb/hengshan2/望日台",
        "south": "fb/hengshan2/祝融峰",
    };
}
