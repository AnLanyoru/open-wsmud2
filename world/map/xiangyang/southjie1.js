import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "南大街";
    desc = "这是一条宽阔的青石板街道，向南北两头延伸。";
    exits = { 
    // east: "xiangyang/eastjie2", 
    // west: "xiangyang/guangchang", 
    south: "xiangyang/southjie2", 
    north: "xiangyang/guangchang"
};
}
