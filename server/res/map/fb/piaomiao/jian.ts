import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "百丈涧";
    desc = "这是百丈涧。";
    exits = {
        "north": "fb/piaomiao/xianchou",
        "south": "fb/piaomiao/yan",
    };
}
