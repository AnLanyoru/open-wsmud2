import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "石阶";
    desc = "你走在一条坚实的石阶上，不时地有进香客从你的身边走过。一边是峭壁，一边是悬崖，抬头隐约可见笼罩在云雾中的天柱峰，听着流水淙淙，令人心旷神怡。";
    exits = { "northup": "wd/taiziyan", "east": "wd/guangchang", "west": "wd/liangong" };
}
