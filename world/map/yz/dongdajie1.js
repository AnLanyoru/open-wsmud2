import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "东大街"
this.desc = "这是一条宽阔的青石板街道，向东西两头延伸。东边不时地传来金属撞击声，西边人声嘈杂。北边是一座简朴的院子，半月形的大门上方写着“白鹿书院”四个烫金大字，苍劲有力。里面不时地传来学生们抑扬顿挫的读书声。南边是一家杂货铺。";
this.exits = { "east": "yz/dongdajie2", "south": "yz/zahuopu", "west": "yz/guangchang", "north": "yz/shuyuan" };
}
