import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "内厅";
    desc = "这是内厅。";
    exits = {
        "north": "fb/xiake/shibi",
    };
}
