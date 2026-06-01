import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西城门";
    desc = "这里是襄阳城的西城门的内城门。近年来蒙古屡次侵犯襄阳城，故这儿把守相当严密，一些官兵们正在盘查要离襄阳城的人。两边是上城头的石阶，向东进入城区。";
    exits = {
    "south" : "xiangyang/walle15",
    "north" : "xiangyang/walle14",
    "west"    : "xiangyang/westgate2",
    "east"    : "xiangyang/westjie3",
    // "up"      : "xiangyang/eastlou1",
};
}
