import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "北峰";
    desc = "这是北峰。";
    exits = {
        "south": "fb/huashan_lunjian/论剑台",
    };
}
