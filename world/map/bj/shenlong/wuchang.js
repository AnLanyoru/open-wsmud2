import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "练武场";
this.desc = "这是一个宽大的练武场，有几个手执短剑的少年少女在这里练功。旁边站着几人, 有男有女, 年纪轻的三十来岁, 老的已有六七十岁, 身上却不带兵刃。北边一条山路直上山顶。";
this.set_npc(["bj/shenlong/nvdizi", 2]);
this.exits = { "west": "bj/shenlong/dadao", "north": "bj/shenlong/dadao2" };
}
