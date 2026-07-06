import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "帝塔峰";
    desc = "这是帝塔峰。";
    exits = {
        "south": "fb/cihang/shanyao",
    };
}
