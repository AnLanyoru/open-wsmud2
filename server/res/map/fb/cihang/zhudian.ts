import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "慈航殿";
    desc = "这是慈航殿。";
    exits = {
        "north": "fb/cihang/guangchang",
    };
}
