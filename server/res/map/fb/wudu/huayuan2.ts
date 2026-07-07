import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "花园";
    exits = {
        "south": "fb/wudu/huayuan",
        "east": "fb/wudu/huating2",
    };
}
