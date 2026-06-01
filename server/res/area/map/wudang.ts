import { FAMILY_AREA } from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    name = "武当派";
    id = "wudang";
    desc = "道家门派，开山祖师张三丰，少年时天赐机缘，得少林觉远大师传授九阳真经，其后多读道藏，于道家练气之术更深有心得，将少林九阳和道家练气之术融会贯通创立武当派。";
    sp = "气血长防御高，善招架，控制";
    is_area = true;
    first = "wd/guangchang";
    index = 1;
    room_path = "wd/";
    family = "WUDANG";
    map = [
    { n: "广场", id: "wd/guangchang", p: [0, 0] },
    { n: "三清殿", id: "wd/sanqing", p: [0, -1], exits: ["s"] },
    { n: "石阶", id: "wd/shijie1", p: [-1, 0], exits: ["e", "n", "w"] },
    { n: "练功房", id: "wd/liangong", p: [-2, 0] },
    { n: "太子岩", id: "wd/taiziyan", p: [-1, -1] },
    { n: "桃园小路", id: "wd/tylu", p: [-1, -2], exits: ["e", "s"] },
    { n: "舍身崖", id: "wd/sheshen", p: [0, -2] },
    { n: "南岩峰", id: "wd/nanyan", p: [-2, -2], exits: ["n", "e"] },
    { n: "乌鸦岭", id: "wd/wuya", p: [-2, -3] },
    { n: "五老峰", id: "wd/wulao", p: [-2, -4], exits: ["s", "n"] },
    { n: "虎头岩", id: "wd/hutou", p: [-2, -5] },
    { n: "朝天宫", id: "wd/chaotian", p: [-2, -6], exits: ["s", "n"] },
    { n: "三天门", id: "wd/santian", p: [-2, -7] },
    { n: "紫金城", id: "wd/zijin", p: [-2, -8], exits: ["s", "n"] },
    { n: "林间小径", id: "wd/xiaolu", p: [-2, -9] },
    { n: "林间小径", id: "wd/xiaolu2", p: [-2, -10], exits: ["s", "n"] },
    { n: "后山小院", id: "wd/xiaoyuan", p: [-2, -11] },
];
}
