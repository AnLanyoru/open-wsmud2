import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "暗道";
    desc = "一条狭窄的地下秘密通道，笔直的朝东面延伸。通道的尽头有明亮的光线透进来。 ";
    exits = { "west": "gaibang/andao3", "up": "gaibang/xiaowu" };
}
