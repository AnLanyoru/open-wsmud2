import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "北大街";
    desc = "这是一条宽阔的青石板街道，向南北两头延伸。";
    exits = {
    south: "xiangyang/guangchang", 
    north: "xiangyang/northjie2"
};
}
