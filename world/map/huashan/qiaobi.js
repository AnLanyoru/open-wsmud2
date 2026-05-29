import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "峭壁";
    desc = "你在峭壁边的小路上。一侧是密密的丛林，外侧却是极深的陡壁。山风凛冽，几乎要把你刮落崖去。";
    exits = { "up": "huashan/sheshen", "southup": "huashan/shangu" };
}
