import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "hengshan";
    name = "恒山";
    desc = "北岳恒山，也是五岳剑派恒山派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2200;
    pot = 2200;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#hengshanshenfa",
        "book/bc#baiyunxinfa",
        "book/bc#hengshanjianfa",
        "book/bc#tianchangzhang",
        "book/bc#kuangfengkuaidao",
        "eq/lv3/kuangfengdao",
        "eq/lv3/tianboguangdemianzhao",
    ];
    room_path = "fb/official/hengshan/";
    map = [];
}
