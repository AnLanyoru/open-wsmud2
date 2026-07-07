import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西廊";
    exits = {
        "east": "fb/hengshan/baiyunan",
        "north": "fb/hengshan/zaitang",
    };
}
