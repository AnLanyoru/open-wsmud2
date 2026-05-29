import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "城墙";
this.desc = "城墙顶面宽约丈余，外侧砌着半人高的垛口，每个垛口间留着方型射孔，俯身可见下方护城河泛着粼粼波光，偶尔有巡逻的兵卒从身边走过，甲胄碰撞发出 “哗啦” 声。";
this.exits = {
    south: "xiangyang/westgate1",
    north: "xiangyang/walle13"
};
}
