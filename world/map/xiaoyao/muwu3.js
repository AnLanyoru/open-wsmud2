import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "工匠屋"
this.desc = "这里也是一间木屋，屋子中的摆设什么简单，但是却有很多工具，锯子啦，刨子啦，锤子啦，还有满地的木屑，一看就知道是一个工匠的家。看！我们的巧匠正忙着呢，不过不知道他又在做什么呢？";
this.exits = { "north": "xiaoyao/muban" };
}
