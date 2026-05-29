import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "地下石室";
    desc = "这是一个地下的秘密石室，四面可以感觉得到的只有强烈的杀气，以及处身地底的一些难闻的气味。在微弱的灯光下，你竟然看到有个人站着那里。继续往下好象还有路。";
    exits = { "up": "xiaoyao/qingcaop", "down": "xiaoyao/shishi2" };
}
