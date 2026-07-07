import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "七重门";
    exits = {
        "north": "fb/cihang/shanyao",
        "south": "fb/cihang/guangchang",
    };
}
