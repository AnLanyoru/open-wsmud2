import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "南大街"
this.desc="你走在一条繁华的街道上，向南北两头延伸。南边是南城门，北边通往市中心，西边是一家顾客众多的武馆。东边是帮派驻地，几个黑衣人守在那里。";
this.exits={"east":"yz/banghui","south":"yz/nanmen","west":"yz/wuguan","north":"yz/nandajie1"};
}
