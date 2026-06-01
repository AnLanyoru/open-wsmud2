import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大厅";
    desc = "过了一条长廊，眼前突然现出一座大厅。此厅硕大无朋，足可容千人之众。只见一群群少年男女衣分五色, 分站五个方位.青、白、黑、黄四色的都是少年, 穿红的却是少女, 背上各负短剑, 每一队约有百人。";
    exits = { "south": "bj/shenlong/damen" };

    constructor() {
        super();
        this.set_npc("bj/shenlong/hong", "bj/shenlong/zhang", "bj/shenlong/wugen");
    }
}
