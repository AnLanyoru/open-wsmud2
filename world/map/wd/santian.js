import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "三天门";
    desc = "这里是武当的三天门，一座高高的牌楼矗立眼前，不时地有进香客从你的身边走过。两边是几个菩萨，一条宽阔的石阶穿堂而过，直通笼罩在云雾中的天柱峰，望着堂中烟云缭绕的香炉，和周围虔诚的许愿人，令人肃然起敬。";
    exits = { "south": "wd/chaotian", "north": "wd/zijin" };
}
