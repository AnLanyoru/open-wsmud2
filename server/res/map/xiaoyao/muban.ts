import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "木板路";
    desc = "这是一条用木板铺成的小道，虽然不是很长，但是却看得出铺得十分细心，连一些细微的疏忽也注意到了。道路两旁好种着一些奇花异树，使过路人有心旷神怡的感觉。";
    exits = { "north": "xiaoyao/linjian", "south": "xiaoyao/muwu3" };
}
