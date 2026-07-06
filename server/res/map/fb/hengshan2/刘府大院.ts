import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "刘府大院";
    desc = "这是刘府大院。";
    exits = {
        "south": "fb/hengshan2/刘府大门",
        "north": "fb/hengshan2/刘府大厅",
    };
}
