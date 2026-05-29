import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "西大街";
this.desc = "这是一条宽阔的青石板街道，向东西两头延伸。";
this.exits = {
    "east"  : "xiangyang/westjie1",
    "west"  : "xiangyang/westjie3",
};
}
