import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "heimu";
    name = "黑木崖";
    desc = "日月神教的总坛所在地，威震江湖的东方不败就坐镇此处，守卫众多，戒备森严。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3400;
    pot = 3400;
    is_diffi = true;
    is_multi = true;
    drops = [
        "eq/lv3/shangguanyundepifeng",
        "eq/lv3/tongbaixiongdejiezhi",
        "eq/lv3/yangliantingdexiangquan",
        "eq/lv3/jiabudehuyaosuo",
        "book/bc#bixiejianfa",
        "book/bc#kuihuashengong",
        "eq/lv4/dongfangbubaidexiuhuazhen",
    ];
    room_path = "fb/official/heimu/";
    map = [];
}
