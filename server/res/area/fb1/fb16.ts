import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "taishan";
    name = "泰山";
    desc = "泰山派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2500;
    pot = 2500;
    is_diffi = false;
    is_multi = false;
    drops = [
        "eq/lv3/taishandengshanxue",
        "eq/lv3/panshihufu",
        "book/bc#taishanquanfa",
        "book/bc#taishanjianfa",
        "book/bc#panshishengong",
    ];
    room_path = "fb/official/taishan/";
    map = [];
}
