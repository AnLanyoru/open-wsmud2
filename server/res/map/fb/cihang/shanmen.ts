import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "帝塔峰";
    desc = "这是耸拔群山之中，人迹罕至，遥望远处山路迂回，清幽宁恬，在翠云舒卷里，慈航静斋临岩角山，巧妙深藏地溶入了这令人大叹观止的美景中。";
    exits = {
        "south": "fb/cihang/shanyao",
    };
}
