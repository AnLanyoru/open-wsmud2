import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "腾蛟亭";
    desc = "这是腾蛟亭。";
    exits = {
        "south": "fb/wudu/huating",
        "west": "fb/wudu/huayuan2",
    };
}
