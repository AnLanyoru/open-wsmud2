import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西大街";
    desc = "这是一条宽阔的青石板街道，向东西两头延伸。";
    exits = {
    "east"  : "xiangyang/westjie1",
    "west"  : "xiangyang/westjie3",
};
}
