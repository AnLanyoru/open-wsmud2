import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西厢";
    desc = "这是西厢。";
    exits = {
        "east": "fb/guangming/houyuan",
    };
}
