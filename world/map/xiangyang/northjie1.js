import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "北大街";
this.desc = "这是一条宽阔的青石板街道，向南北两头延伸。";
this.exits = {
    south: "xiangyang/guangchang", 
    north: "xiangyang/northjie2"
};
}
