import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "持国天王殿";
    desc = "这是持国天王殿。";
    exits = {
        "northwest": "fb/jingnian/主殿",
    };
}
