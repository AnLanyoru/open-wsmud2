import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这就是闻名天下的『白驼山庄』的大门。大门梁上雕龙刻凤，美奂美仑，不知凝聚着多少能工巧匠的心血。更显出庄主的富有与显贵。门前左右各蹲着一只威武庄严的石狮子。";
    exits = {
        "north": "fb/baituo/liangong",
    };
}
