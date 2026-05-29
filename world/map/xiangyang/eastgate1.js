import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "东城门";
this.desc = "这里是襄阳城的东城门的内城门。近年来蒙古屡次侵犯襄阳城，故这儿把守相当严密，一些官兵们正在盘查要离襄阳城的人。两边是上城头的石阶，向西进入城区。";
this.exits = {
    "west"    : "xiangyang/eastjie3",
    "east"    : "xiangyang/eastgate2",
    "south" : "xiangyang/walle29",
    "north" : "xiangyang/walle1",
};
}
