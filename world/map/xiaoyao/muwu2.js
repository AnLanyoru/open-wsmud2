import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "木屋"
this.desc = "这是一间不是很大的木头屋子，这里看起来象个药室，室中摆放着各种不同的配药的用具和一些已经配好了的药。";
this.exits = { "south": "xiaoyao/linjian1" };
}
