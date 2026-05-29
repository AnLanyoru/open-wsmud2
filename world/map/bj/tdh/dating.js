import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "青木堂";
    desc = "这里就是天下闻名的天地会青木堂大厅，只见一张板桌上供着两个灵牌，中间一个写着“大明天子之位”，侧边一个写着“大明延平郡王郑之位”。此外有一块<cmd cmd='look baimu'>白木(baimu)</cmd> ，上面密密麻麻全是血字。厅侧有一副<cmd cmd='look duilian'>对联(duilian)</cmd> 。东边是侧厅，南北都是暗道。";
    exits = { "south": "bj/tdh/andao2", "north": "bj/tdh/kedian", "east": "bj/tdh/ceting" };

    constructor() {
        super();
        this.set_item("baimu", "白木","只见白木上写道：天地万有，回复大明。吾人当同生共死，仿桃园故事，约为兄弟，姓洪名金兰，合为一家。拜天为父，拜地为母, 日为兄，月为姊妹，焚香设誓，一雪前耻，顺天行道，恢复明朝。歃血为盟，神明降鉴。");
        this.set_item("duilian", "对联", "地振高冈，一派溪山千古秀\n门朝大海，三河合水万年流");
        this.set_npc("bj/tdh/chen");
    }
}
