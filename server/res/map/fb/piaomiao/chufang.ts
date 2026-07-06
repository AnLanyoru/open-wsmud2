import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "藕香榭";
    desc = "这是藕香榭。";
    exits = {
        "west": "fb/piaomiao/huayuan",
    };
}
