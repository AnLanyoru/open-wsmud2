import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "刘府大厅";
    desc = "这是刘府大厅。";
    exits = {
        "east": "fb/hengshan2/东厢房",
        "south": "fb/hengshan2/刘府大院",
        "west": "fb/hengshan2/西厢房",
    };
}
