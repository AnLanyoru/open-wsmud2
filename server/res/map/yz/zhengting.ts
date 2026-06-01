import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "镖局正厅";
    desc = "这里是福威镖局的正厅，几只太师椅一字排开，正中央坐着总镖头，手持烟袋杆正在闭目沉思。墙上挂着几幅字画和一把宝剑。";
    exits = { "north": "yz/biaoju" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("yz/linzhennan");
    }
}
