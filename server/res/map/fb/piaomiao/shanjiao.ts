import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山脚";
    desc = "这里是缥缈峰山脚, 抬头上望, 缥缈峰耸入云天, 峰顶白云缭绕, 宛若仙境. 白云深处隐约可见琼楼玉宇, 那就是令江湖人物闻名丧胆的『灵鹫宫』。听说宫中住着一些武艺高强的女侠, 而且只收女弟子为徒。";
    exits = {
        "north": "fb/piaomiao/ya",
    };
}
