import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "岱宗坊";
    desc = "这是岱宗坊。";
    exits = {
        "north": "fb/taishan/yitian",
    };
}
