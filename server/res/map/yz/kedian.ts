import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "有间客栈";
    desc = "这是扬州城本地一家价钱低廉的客栈，生意非常兴隆。外地游客多选择这里落脚，你可以在这里打听到当地的风土人情。店小二里里外外忙得团团转，接待着南腔北调的客人。角落里几位江湖人物打扮的大汉正围着一张桌子不知道在商量什么,客店的主人从不露面，他究竟是谁，有各种各样的猜测。墙上挂着一个<cmd cmd='look paizi'>牌子(paizi)</cmd>";
    exits = { "west": "yz/beidajie1" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("pub/xiaoer");
        this.set_item("paizi", "牌子", "本店尚有空余客房，每天100两银子。详情咨询店小二");
    }
}
