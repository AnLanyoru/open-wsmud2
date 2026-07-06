import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "崇圣宝殿";
    desc = "这是崇圣宝殿。";
    exits = {
        "north": "fb/tianlong/ta",
    };
}
