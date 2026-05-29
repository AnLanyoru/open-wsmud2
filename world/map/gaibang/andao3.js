import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "暗道"
this.desc = "一条狭窄的地下秘密通道，笔直的朝东面延伸。通道的尽头有明亮的光线透进来。 ";
this.exits = { "west": "gaibang/mishi","east": "gaibang/andao4"};
}
