import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山门";
    exits = {
        "south": "fb/cihang/qichongmen",
        "north": "fb/cihang/shanmen",
    };
}
