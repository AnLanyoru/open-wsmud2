import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门坎子";
    desc = "这是大门坎子。";
    exits = {
        "northeast": "fb/guanwai/二门坎子",
    };
}
