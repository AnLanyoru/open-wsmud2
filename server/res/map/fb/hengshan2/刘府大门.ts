import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "刘府大门";
    desc = "这是刘府大门。";
    exits = {
        "south": "fb/hengshan2/衡阳西街",
        "north": "fb/hengshan2/刘府大院",
    };
}
