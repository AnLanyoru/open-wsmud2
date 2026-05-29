import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "扬州武馆"
this.desc = "这里是扬州武馆，附近的少年想要学些基本的拳脚功夫就来这里报名，只收钱不看资质。大门上方一个大大的匾额，上书：武通天下";
this.exits = { "east": "yz/nandajie2", };
this.no_fight = true;
this.set_npc("pub/jiaoxi");
this.set_npc("pub/mpguanli#NONE");
}
