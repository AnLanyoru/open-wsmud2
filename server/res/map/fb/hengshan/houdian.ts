import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "后殿";
    desc = "这是后殿。";
    exits = {
        "south": "fb/hengshan/baiyunan",
    };
}
