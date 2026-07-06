import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "主殿";
    desc = "这是主殿。";
    exits = {
        "northwest": "fb/jingnian/广目天王殿",
        "northeast": "fb/jingnian/多闻天王殿",
        "southwest": "fb/jingnian/增长天王殿",
        "southeast": "fb/jingnian/持国天王殿",
    };
}
