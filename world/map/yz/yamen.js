import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "衙门大门";
    desc = "这里是衙门大门，两扇朱木大门紧紧关闭着。“肃静”“回避”的牌子分放两头石狮子的旁边。前面有一个大鼓，显然是供小民鸣冤用的。几名衙役在门前巡逻。";
    exits = { "south": "yz/xidajie1", "north": "yz/ymzhengting" };
}
