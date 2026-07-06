import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "蓼风轩";
    desc = "这是蓼风轩。";
    exits = {
        "west": "fb/piaomiao/changlang",
    };
}
