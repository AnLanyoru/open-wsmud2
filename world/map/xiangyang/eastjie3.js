import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "东大街";
    desc = "这是一条宽阔的青石街道，向东西两头延伸。东面是青龙内门，。北面是襄阳城的东兵营，隐隐能听见里面传来宋兵的操练声。西边是一个十字街口，只见人来人往、络绎不绝。";
    exits = {
    east  : "xiangyang/eastgate1",
    west  : "xiangyang/eastjie2",
    // south : "xiangyang/mujiang",
    north : "xiangyang/bingying2",
};
}
