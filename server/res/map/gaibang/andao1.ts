import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "暗道";
    desc = "这是丐帮 极其秘密的地下通道，乃用丐帮几辈人之心血掘成。 ";
    exits = { "east": "gaibang/andao2","west": "gaibang/shudongxia"};
}
