import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "guangming";
    name = "光明顶";
    desc = "明教总坛所在地。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3600;
    pot = 3600;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#shenghuoshengong",
        "book/bc#qingfushenfa",
        "book/bc#yingzhuagong",
        "book/bc#shenghuojianfa",
        "eq/lv4/shenghuoling",
        "eq/lv4/zhouzhiruodeshouzhuo",
        "eq/lv4/yangbuhuidexianglian",
        "eq/lv4/zhaomindejiezhi",
        "eq/lv4/weiyixiaodetaomingxie",
        "book/bc#jiuyangshengong",
        "book/bc#qiankundanuoyi",
        "eq/lv5/yitianjian",
    ];
    room_path = "fb/official/guangming/";
    map = [];
}
