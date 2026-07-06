import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "东峰";
    desc = "这是东峰。";
    exits = {
        "west": "fb/huashan_lunjian/论剑台",
    };
}
