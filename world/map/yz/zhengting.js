import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "镖局正厅"
this.desc = "这里是福威镖局的正厅，几只太师椅一字排开，正中央坐着总镖头，手持烟袋杆正在闭目沉思。墙上挂着几幅字画和一把宝剑。";
this.exits = { "north": "yz/biaoju" };
this.set_npc("yz/linzhennan");
this.no_fight = true;
}
