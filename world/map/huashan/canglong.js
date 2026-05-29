import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "苍龙岭";
    desc = "华山五峰中最惊险的是北峰，北峰之上最陡峭的则是苍龙岭。此岭高约百米，宽仅一米，而登山之路则在其山脊之上，两侧脊坡光滑挺拔，其下悬崖深邃，云涛隐伏";
    exits = { "southup": "huashan/sheshen", "westdown": "huashan/zhenyue" };
}
