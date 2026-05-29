import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "林间小屋";
    desc = "这里就是华山剑宗的的根本之地。屋里陈设极为简陋。这么多年来一直没有长久隐匿的念头使得剑宗弟子能忍辱负重，只待重开生天。";
    exits = { "west": "huashan/pingdi" };
}
