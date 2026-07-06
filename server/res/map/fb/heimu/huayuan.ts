import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小花园";
    desc = "这是小花园。";
    exits = {
        "east": "fb/heimu/guifang",
    };
}
