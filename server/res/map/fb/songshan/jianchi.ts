import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "剑池";
    desc = "这是剑池。";
    exits = {
        "south": "fb/songshan/huimengtang",
    };
}
