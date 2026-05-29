import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "当铺"
this.desc = "这是一家以买卖公平著称的当铺，一个五尺高的柜台挡在你的面前，柜台上摆着一个牌子，柜台后坐着唐老板，一双精明的眼睛上上下下打量着你。";
this.exits = { "west": "yz/nandajie1", "up": "yz/cangbao" };


this.set_npc("yz/tang");


this.no_fight = true;
}
