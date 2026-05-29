import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "北城门";
    desc = "这里是襄阳城的北城门的内城门。近年来蒙古屡次侵犯襄阳城，故这儿把守相当严密，一些官兵们正在盘查要离襄阳城的人。两边是上城头的石阶，向西进入城区。";
    exits = { 
    east : "xiangyang/walle7",
    west: "xiangyang/walle8", 
    south: "xiangyang/northjie3", 
    north: "xiangyang/northgate2"
};
}
