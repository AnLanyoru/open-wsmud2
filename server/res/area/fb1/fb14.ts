import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "qingcheng";
    name = "青城山";
    desc = "青城派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2300;
    pot = 2300;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#tagexing",
        "book/bc#cuixinzhang",
        "book/bc#songfengjianfa",
    ];
    room_path = "fb/official/qingcheng/";
    map = [];
}
