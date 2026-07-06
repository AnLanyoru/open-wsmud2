import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "望日台";
    desc = "这是望日台。";
    exits = {
        "west": "fb/hengshan2/狮子岩",
        "south": "fb/hengshan2/祝融殿",
    };
}
