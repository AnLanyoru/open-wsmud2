import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "满天星";
    desc = "这是满天星。";
    exits = {
        "west": "fb/guanwai/二门坎子",
        "southeast": "fb/guanwai/谷草跺",
    };
}
