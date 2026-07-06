import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yanzi";
    name = "燕子坞";
    desc = "燕子坞是姑苏慕容家的大本营，据说那里的还施水阁收集了大量的武功";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3300;
    pot = 3300;
    is_diffi = true;
    is_multi = false;
    drops = [
        "eq/lv4/azhudeyirongmianju",
        "book/bc#canhezhi",
        "book/bc#douzhuanxingyi",
    ];
    room_path = "fb/official/yanzi/";
    map = [];
}
