import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "长廊";
    desc = "这是一个小房间,桌上点着蜡烛.房中只有一桌一床,陈设简单,却十分干净.床上铺着被褥。";
    exits = {"south":"bj/zhuang/changlang"};

    constructor() {
        super();
        this.set_npc("bj/zhuang/furen","bj/zhuang/shuanger");
    }
}
