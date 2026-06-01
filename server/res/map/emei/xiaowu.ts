import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "小屋";
    desc = "这是一间清幽的小屋，屋内摆设比较简单，除几种常用的桌椅外，在中间墙壁上挂了一张『踏雪图』";
    exits = { "south": "emei/zoulang4" };
}
