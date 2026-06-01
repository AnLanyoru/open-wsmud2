import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西大街";
    desc = "这是一条宽阔的青石街道，向东西两头延伸。西面是白虎内门。";
    exits = {
    "east"  : "xiangyang/westjie2",
    "west"  : "xiangyang/westgate1",
};
}
