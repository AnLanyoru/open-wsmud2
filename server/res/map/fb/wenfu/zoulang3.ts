import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "走廊";
    exits = {
        "northwest": "fb/wenfu/zoulangtou",
        "south": "fb/wenfu/zoulang4",
        "east": "fb/wenfu/wen4",
    };
}
