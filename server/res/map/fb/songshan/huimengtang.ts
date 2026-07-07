import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "会盟堂";
    exits = {
        "south": "fb/songshan/zhongmen",
        "north": "fb/songshan/jianchi",
        "west": "fb/songshan/xilang",
        "east": "fb/songshan/donglang",
    };
}
