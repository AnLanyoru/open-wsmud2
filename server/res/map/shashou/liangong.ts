import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "练功房";
    desc = "这里是杀手楼弟子的练功房，非常简陋，但布置也不是很用心，四周零零散散挂着一些武器，靠墙放了几个蒲团供人打坐练功。";
    exits = { "west": "shashou/yinlou" };
}
