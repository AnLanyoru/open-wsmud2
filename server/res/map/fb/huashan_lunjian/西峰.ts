import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西峰";
    desc = "这是西峰。";
    exits = {
        "east": "fb/huashan_lunjian/论剑台",
    };
}
