import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西廊";
    desc = "这是西廊。";
    exits = {
        "east": "fb/songshan/huimengtang",
    };
}
