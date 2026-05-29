import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "练功房"
this.desc = "这是树林中的一间石屋，屋内显得什么清净和简朴，房间中并没有什么特别的摆设在这里，不会受到任何东西的骚扰，是个修炼内功的好地方。";
this.exits = { "east": "wd/shijie1" };

this.set_npc('pub/muren');
}
