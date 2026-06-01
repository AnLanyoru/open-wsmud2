import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "林间小道";
    desc = "这是一条从南到北的林间小道，沿途风景极之清幽，参天古树，拔地而起，两旁百花争艳。令人留连忘返。";
    exits = { "south": "xiaoyao/muwu1", "north": "xiaoyao/qingcaop" };
}
