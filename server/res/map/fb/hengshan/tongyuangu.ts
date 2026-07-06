import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "通元谷";
    desc = "这是通元谷。";
    exits = {
        "south": "fb/hengshan/guolaoling",
    };
}
