import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "舍身崖"
this.desc = "这里是舍身崖，地势险峻，上面似乎连人都站不稳，武当弟子经常在这里练习轻功。";
this.exits = { "west": "wd/tylu"};
}
