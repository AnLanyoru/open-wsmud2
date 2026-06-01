import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "塔顶";
    desc = "这里是武道塔的顶部，脚下是高耸入云的武道塔，你仿佛踏在云端，果然是会当凌绝顶，一览众山小。这里空荡荡的什么都没有，一个看上去疯疯癫癫的老头靠在墙角。";
    exits = {
    "west": "wudao/west", "up": "wudao/ta2", "down": "wudao/men",
    "east": "wudao/east", "north": "wudao/north", "south": "wudao/south"
};
}
