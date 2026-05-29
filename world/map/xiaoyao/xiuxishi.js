import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "休息室"
this.desc = "这是一间在树林中的小屋，屋子中间摆着几张大床，几张桌子，看来是个休息的地方，室中光线柔和，使人更增睡意。";
this.exits = {  "north": "xiaoyao/linjian3" };
}
