import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "大榕树上";
    no_fight = true;
    desc = "人说大树底下好乘凉，没想到大树上更凉快。这棵大榕树真不愧为千年神木，至今仍绿叶繁茂。据说这里的时间是冻结的，因此便成为许多玩家聊天的地方。这里摆着几张用榕树根做的椅子，中间用几根榕树枝搭在一起，算是一个茶几了。当你抬头往上看的时候似乎有个影在树梢之间移动，不过也许是风吹动所造成的错觉。";
    exits = { down: "yz/guangchang" };
}
