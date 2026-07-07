import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "果老岭";
    exits = {
        "northwest": "fb/hengshan/shandao",
        "north": "fb/hengshan/tongyuangu",
        "southeast": "fb/hengshan/hufengkou",
    };
}
