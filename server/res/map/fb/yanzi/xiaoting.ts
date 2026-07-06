import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小厅";
    desc = "这是小厅。";
    exits = {
        "west": "fb/yanzi/yunjinlou",
    };
}
