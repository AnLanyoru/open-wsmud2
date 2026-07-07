import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大厅";
    exits = {
        "south": "fb/wenfu/dayuan",
        "northwest": "fb/wenfu/zoulang1",
        "northeast": "fb/wenfu/zoulang4",
    };
}
