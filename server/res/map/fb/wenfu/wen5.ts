import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "侧房";
    desc = "这是侧房。";
    exits = {
        "west": "fb/wenfu/zoulang4",
    };
}
