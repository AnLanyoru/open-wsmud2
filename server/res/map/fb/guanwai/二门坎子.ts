import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "二门坎子";
    desc = "这是二门坎子。";
    exits = {
        "southwest": "fb/guanwai/大门坎子",
        "east": "fb/guanwai/满天星",
    };
}
