import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "藏宝阁";
    desc = "这里是当铺的二楼，专为接待贵客而设立，据说当铺收集来的神秘宝物大都会在这里进行拍卖，只要你有钱就可以获得一些稀有的道具，柜台上摆放着一个<cmd cmd='pm list'>告示牌(paizi)</cmd>，后面坐着一个老头眯着眼睛打量着你。";
    exits = { "down": "yz/dangpu" };
    no_fight = true;

    constructor() {
        super();
        this.set_npc("pub/paimai");
    }
}
