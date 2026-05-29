import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "东客房";
    desc = "一进门，只见六个喇嘛手持戒刀，围着一白衣女尼拼命砍杀，只是给白衣女尼的袖力掌风逼住了，欺不近身。但那白衣女子头顶已冒出丝丝白气，显然已尽了全力。她只一条臂膀，再支持下去恐怕难以抵敌。地上斑斑点点都是血迹。";
    exits = { "west": "bj/tdh/kedian"};

    constructor() {
        super();
        this.set_npc(["bj/tdh/lama",6],"bj/tdh/dubi");
    }
}
