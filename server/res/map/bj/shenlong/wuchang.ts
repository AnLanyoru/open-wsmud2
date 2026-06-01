import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    desc = "这是一个宽大的练武场，有几个手执短剑的少年少女在这里练功。旁边站着几人, 有男有女, 年纪轻的三十来岁, 老的已有六七十岁, 身上却不带兵刃。北边一条山路直上山顶。";
    exits = { "west": "bj/shenlong/dadao", "north": "bj/shenlong/dadao2" };

    constructor() {
        super();
        this.set_npc(["bj/shenlong/nvdizi", 2]);
    }
}
