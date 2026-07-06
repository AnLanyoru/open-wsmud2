import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大院";
    desc = "这是大院。";
    exits = {
        "north": "fb/wenfu/dating",
    };
}
