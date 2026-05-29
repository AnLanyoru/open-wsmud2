import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "南门"
this.desc="这是南城门，城墙被当成了广告牌，贴满了花花绿绿各行各业的广告，官府的告示(gaoshi)因此不太显目。官兵们被近处的欢声笑语所吸引，似乎不是很认真在执勤。一条笔直的青石板大道向南北两边延伸。";
this.exits={"west":"yz/work","north":"yz/nandajie2"};
}
