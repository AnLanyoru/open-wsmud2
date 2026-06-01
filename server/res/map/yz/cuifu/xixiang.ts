import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "西厢";
    desc = "这是财主小姐的闺房，一股幽香扑面而来。一张绣榻放在墙角，垂着细纱。小姐正躺在榻上，懒洋洋地一幅思春模样。看到你突然闯进来，惊呆了。";
    exits = { "east": "yz/cuifu/houyuan" };

    constructor() {
        super();
        this.set_npc("yz/cuifu/yingying");
    }
}
