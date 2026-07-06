import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小天池";
    desc = "这是小天池。";
    exits = {
        "west": "fb/guanwai/黑风口",
    };
}
