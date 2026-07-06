import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山路";
    desc = "这是山路。";
    exits = {
        "southwest": "fb/jingnian/山门",
        "northeast": "fb/jingnian/山路1",
    };
}
