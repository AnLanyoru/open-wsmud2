import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "上清殿";
    desc = "这是上清殿。";
    exits = {
        "south": "fb/qingcheng/caochang",
    };
}
