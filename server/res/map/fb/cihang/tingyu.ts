import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "听雨亭";
    exits = {
        "south": "fb/cihang/diancangta",
        "west": "fb/cihang/xiaolu1",
    };
}
