import { ROOM } from "../../../core/room/room.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "广场";
    desc = "这里是城市的正中心，一个很宽阔的广场，铺着青石地面。一些游手好闲的人在这里溜溜达达，经常有艺人在这里表演。中央有一棵<cmd cmd='look tree'>大榕树(tree)</cmd>，盘根错节，据传已有千年的树龄，是这座城市的历史见证。";
    exits = {
    east: "yz/dongdajie1", west: "yz/xidajie1", south: "yz/nandajie1", north: "yz/beidajie1"
};

    constructor() {
        super();
        this.set_npc("yz/zhubanxian");
        this.set_item("tree", "大榕树", "一棵枝叶茂盛的大榕树，看来似乎可以爬上去", [[
            "climb", "爬",  climb_tree
        ]]);
        this.add_action("climb tree", "爬树", function (this: MapRoom) { });
    }
}

function climb_tree(me: CHARACTER, par?: string) {
    if (par != "tree") return me.notify("你要爬什么？");
    var leave_msg: string | null = null;
    if (me.gender == 1) {
        leave_msg = me.name + "战战兢兢的抓住树干往上爬去。";
    } else {
        leave_msg = me.per > 40 ? me.name + "轻轻一跳，衣裙飘飘，象仙子般飞上大榕树。" : me.name + "战战兢兢地拉着大榕树的盘根，屁股一扭一扭地往上爬。";
    }
    var in_msg: string | null = null;

    if (me.gender == 1) {
        in_msg = me.name + "战战兢兢地从下面爬了上来。";
    } else {
        in_msg = me.per > 40 ? "一阵清香飞来，你定眼一看，" + me.name + "已经婷婷玉立在你眼前。" : me.name + "气喘嘘嘘地爬了上来。";
    }
    me.moveto("yz/tree1", leave_msg ?? undefined, in_msg ?? undefined);
}
