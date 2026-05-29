import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "虎头岩"
this.desc = "你走在虎头岩山路上，一边是峭壁，一边是悬崖。高高的天柱峰笼罩在云雾中，隐约可见。可是身旁的进香客和游人都仔细地町着自己的脚下，不敢抬头望一眼，惟恐一不小心摔下去。";
this.exits = { "southdown": "wd/wulao", "north": "wd/chaotian" };
}
