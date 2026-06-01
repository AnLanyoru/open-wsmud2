import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "衙门正厅";
    desc = "堂上东西有两根楹住，挂着一幅对联，但是你无心细看。正墙上悬挂一个横匾，上书“正大光明”四个金光闪闪的大字。知府正坐在文案后批阅文书，师爷随侍在后";
    exits = { "south": "yz/yamen"};
    no_fight = true;

    constructor() {
        super();
        this.set_npc('yz/cheng',"pub/hubu");
    }
}
