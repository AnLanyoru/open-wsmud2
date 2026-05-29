import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "灌木林";
this.desc = "这是一片灌木林。走了不远,你就可以看得见前面的空地了。";
this.set_npc("bj/shenlong/dushe", "bj/shenlong/zyshe");
this.exits = { "south": "bj/shenlong/lin1", "north": "bj/shenlong/kongdi" };
}
