import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小屋";
    exits = {
        "south": "fb/guanwai/baihe",
    };
}
