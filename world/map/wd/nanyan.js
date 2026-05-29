import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "南岩峰"
this.desc = "这是一条宽大坚实的石阶路，不时地有进香客和游人从你的身边走过。抬头西望，雄伟的三清殿顶浮现在香烟袅绕之中，巍峨壮观；东边一条石阶通往山下，隐约可见远处桃花片片，赏心悦目。";
this.exits = { "east": "wd/tylu","northup":"wd/wuya" };
}
