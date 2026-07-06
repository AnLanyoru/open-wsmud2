import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "wudu";
    name = "五毒教";
    desc = "自称是五仙教，别人称之为五毒教 驱使蛤蟆、蜘蛛、蝎子、毒蛇、蜈蚣五种毒物战斗，善用毒";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2100;
    pot = 2100;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#wudushengong",
        "book/bc#wuduyanluobu",
        "book/bc#wudugoufa",
        "book/bc#qianzhuwandushou",
    ];
    room_path = "fb/official/wudu/";
    map = [];
}
