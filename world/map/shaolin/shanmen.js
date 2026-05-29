import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "山门殿";
    desc = "殿内青砖铺地，两侧分列哼、哈二将。身躯雄伟，面相忿怒，头带宝冠，上半身裸露，手执金刚杵，一鼓鼻，一张口，露牙睁目，凶猛可畏。两边各放一红木供桌，陈列香烛，以供僧俗叩拜。自此左右各有一间偏殿，供比丘们打坐诵经之用。";
    exits = { "north": "shaolin/twdian", "south": "shaolin/guangchang", "west": "shaolin/liangong2", "east": "shaolin/liangong1" };
}
