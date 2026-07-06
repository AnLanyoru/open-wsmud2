import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大字岭";
    desc = "这是大字岭。";
    exits = {
        "north": "fb/hengshan/hufengkou",
    };
}
