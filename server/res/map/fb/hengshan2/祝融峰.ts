import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "祝融峰";
    desc = "这是祝融峰。";
    exits = {
        "north": "fb/hengshan2/祝融殿",
    };
}
