import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "舍身崖";
    desc = "这里是舍身崖，地势险峻，上面似乎连人都站不稳，武当弟子经常在这里练习轻功。";
    exits = { "west": "wd/tylu"};
}
