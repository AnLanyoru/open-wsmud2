import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "谷草跺";
    desc = "这是谷草跺。";
    exits = {
        "northwest": "fb/guanwai/满天星",
        "east": "fb/guanwai/白河",
    };
}
