import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "多闻天王殿";
    desc = "这是多闻天王殿。";
    exits = {
        "southwest": "fb/jingnian/主殿",
    };
}
