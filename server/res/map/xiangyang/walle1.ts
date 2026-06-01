import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "城墙";
    desc = "城墙顶面宽约丈余，外侧砌着半人高的垛口，每个垛口间留着方型射孔，俯身可见下方护城河泛着粼粼波光，偶尔有巡逻的兵卒从身边走过，甲胄碰撞发出 “哗啦” 声。";
    exits = {
    south: "xiangyang/eastgate1",
    north: "xiangyang/walle2"
};
}
