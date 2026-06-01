import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "方丈楼";
    desc = "这里的地上整整齐齐的排放着数十个黄布蒲团，北首有一个红木讲坛，讲坛上放着个竹制的木鱼。东西边各放着一对美轮美奂的大花瓶，上插檀香数枝，香烟缭绕，氤氲芬芳，室内一片祥和之气。看来这里是方丈对僧众讲经说法的地方。";
    exits = { "south": "shaolin/lianwu", "east": "shaolin/jielv", "west": "shaolin/damo", "north": "shaolin/zhulin1" };
}
