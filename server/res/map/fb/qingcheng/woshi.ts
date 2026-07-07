import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "卧室";
    exits = {
        "south": "fb/qingcheng/huayuan",
    };
}
