import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "土地庙";
    desc = "这是一间破破烂烂的土地庙，庙里破败不堪，土地神像推在一旁，梁上地下也布满了灰尘。一看就知道已经很久没有人来清理过了。正中放着个大香案，上面零乱地扔着几根吃剩下来的鸡骨头。香案黑洞洞的，好象下边有个大洞";
    exits = { "down": "gaibang/mishi" };
}
