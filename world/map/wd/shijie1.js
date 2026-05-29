import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "石阶"
this.desc = "你走在一条坚实的石阶上，不时地有进香客从你的身边走过。一边是峭壁，一边是悬崖，抬头隐约可见笼罩在云雾中的天柱峰，听着流水淙淙，令人心旷神怡。";
this.exits = { "northup": "wd/taiziyan", "east": "wd/guangchang", "west": "wd/liangong" };
//this.set_npc("pub/mpguanli#WUDANG");
}
