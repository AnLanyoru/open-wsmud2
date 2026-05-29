import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "鼓楼";
    desc = "这是一座砖木结构的宝塔，塔高七层，塔身作八角形，飞檐翘翎，檐角上挂满了一串串小铜铃，随风叮叮作响。塔身墙上镂空雕绘着无数佛陀们的坐像。一个个形态维肖，看来出自名匠之手";
    exits = { "southeast": "shaolin/twdian", "northeast": "shaolin/houdian" };
}
