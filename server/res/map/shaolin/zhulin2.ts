import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "竹林";
    desc = "这是一片密密的竹林。这里人迹罕至，惟闻足底叩击路面，有僧敲木鱼声；微风吹拂竹叶，又如簌簌禅唱。令人尘心为之一涤，真是绝佳的禅修所在。";
    exits = { "south": "shaolin/zhulin1","north": "shaolin/damodong" };
}
