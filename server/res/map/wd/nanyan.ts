import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "南岩峰";
    desc = "这是一条宽大坚实的石阶路，不时地有进香客和游人从你的身边走过。抬头西望，雄伟的三清殿顶浮现在香烟袅绕之中，巍峨壮观；东边一条石阶通往山下，隐约可见远处桃花片片，赏心悦目。";
    exits = { "east": "wd/tylu","northup":"wd/wuya" };
}
