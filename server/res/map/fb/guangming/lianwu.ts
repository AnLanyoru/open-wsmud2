import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    desc = "这是练武场。";
    exits = {
        "north": "fb/guangming/juyiting",
        "south": "fb/guangming/qi_houtu",
        "west": "fb/guangming/qi_ruijin",
        "east": "fb/guangming/qi_liehuo",
    };
}
