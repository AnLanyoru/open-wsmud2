import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "山洞";
    desc = "这是一个毫不起眼的山洞，但是里面的石壁上却画满了五岳剑派所有已经失传的精妙绝招。花岗岩石壁(wall)上很多小人，全是用利器刻制，想见当初运力之人内力十分深厚。";
    exits = { "out": "huashan/siguoya" ,"westup": "huashan/zhandao" };
}
