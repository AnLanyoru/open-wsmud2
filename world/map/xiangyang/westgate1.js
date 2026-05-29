import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "西城门";
this.desc = "这里是襄阳城的西城门的内城门。近年来蒙古屡次侵犯襄阳城，故这儿把守相当严密，一些官兵们正在盘查要离襄阳城的人。两边是上城头的石阶，向东进入城区。";
this.exits = {
    "south" : "xiangyang/walle15",
    "north" : "xiangyang/walle14",
    "west"    : "xiangyang/westgate2",
    "east"    : "xiangyang/westjie3",
    // "up"      : "xiangyang/eastlou1",
};
}
