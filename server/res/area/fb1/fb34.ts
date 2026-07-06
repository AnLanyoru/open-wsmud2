import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "cihang";
    name = "慈航静斋";
    desc = "传说中的武林圣地之一，门下传人多为女子，武功以剑诀为主，神秘莫测。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4300;
    pot = 4300;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#bianjianfa",
        "book/bc#lingxibu",
        "eq/lv5/feiyijian",
        "eq/lv5/bianhua",
        "book/bc#cihangjiandian",
    ];
    room_path = "fb/official/cihang/";
    map = [];
}
