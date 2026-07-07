import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "一天门";
    exits = {
        "south": "fb/taishan/daizong",
        "north": "fb/taishan/ertian",
    };
}
