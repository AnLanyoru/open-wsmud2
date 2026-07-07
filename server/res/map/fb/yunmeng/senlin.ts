import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "森林";
    desc = "前面根本没有路，四周的密林中长满了杂草，荆棘密布。浓密宽厚的树叶遮蔽了日月星辰，使人分不出昼夜。四下如死一般的寂静，只有风吹过树梢的沙沙之声。";
    exits = {
        "east": "fb/yunmeng/zhaoze1",
    };
}
