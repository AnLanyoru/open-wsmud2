import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "东城门";
    desc = "这里是襄阳城的东城门的内城门。近年来蒙古屡次侵犯襄阳城，故这儿把守相当严密，一些官兵们正在盘查要离襄阳城的人。两边是上城头的石阶，向西进入城区。";
    exits = {
    "west"    : "xiangyang/eastjie3",
    "east"    : "xiangyang/eastgate2",
    "south" : "xiangyang/walle29",
    "north" : "xiangyang/walle1",
};
}
