import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "wenfu";
    name = "温府";
    desc = "石梁派温家，一家六兄弟全都阴险毒辣无比，使用毒计得到了金蛇郎君的宝藏";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2000;
    pot = 2000;
    is_diffi = false;
    is_multi = false;
    drops = [
        "eq/lv1/jinshezhui",
        "eq/lv2/js_ring",
        "eq/lv2/js_pifeng",
        "eq/lv2/js_nang",
        "book/bc#baguaquan",
        "book/bc#baguagun",
        "book/bc#jinshejianfa",
        "book/bc#jinshezhang",
        "book/bc#jinsheyoushenbu",
        "eq/lv3/baguagun",
        "eq/lv3/jinshejian",
    ];
    room_path = "fb/official/wenfu/";
    map = [];
}
