import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
    id = "lmw";
    name = "流氓巷";
    desc = "扬州城北的一条老街道，被一群大小流氓整天占着，去那里行侠仗义是个不错的主意。";
    score = 100;
    is_show = true;
    first = "yz/lmw/xiangzi1";
    is_copy = true;
    expend = 10;
    is_multi = true;
    exp = 900;
    pot = 900;
    room_path = "yz/lmw/";
    ss_title = "流氓头";
    map = [{ n: "小巷子", id: "yz/lmw/xiangzi1", p: [0, 0], exits: ["e"] },
                    { n: "小巷子", id: "yz/lmw/xiangzi2", p: [1, 0], exits: ["n", "e"] },
                    { n: "巷子深处", id: "yz/lmw/xiangzi3", p: [2, 0], exits: ["n1d", "e"] },
                    { n: "破茅屋", id: "yz/lmw/pomaowu", p: [1, -1] },
                    { n: "头目房间", id: "yz/lmw/fang", p: [3, 0] },
                    { n: "仓库", id: "yz/lmw/cangku", p: [2, -1] }
];
    drops = ["eq/lv1/lm_head", "eq/lv1/lm_cloth", "eq/lv1/lm_shoes", "eq/lv1/lm_shou",
    "eq/lv1/lm_jian", "eq/lv1/lm_gun", "eq/lv1/qianjinquan", "book/book#force", "book/book#unarmed", "book/bc#taizuchangquan", "book/book#parry", "book/book#dodge"];
    quick_drops = [
    {
        obj: "money/silver",
        min: 1,
        max: 10
    }, {
        obj: [
            "eq/lv0/cloth",
            "eq/lv0/dao",
            "eq/lv0/ring",
            "eq/lv0/tiegun",
            "eq/lv0/jian",
            "eq/lv0/jin",
            "eq/lv0/shoes",
            "eq/lv0/duanyi",
        ]
    }, {
        obj: [
            "eq/lv1/lm_head", "eq/lv1/lm_cloth", "eq/lv1/lm_shoes", "eq/lv1/lm_shou", "eq/lv1/lm_jian"
        ],
        odds: 2000
    },
    {
        obj: ["book/book#force", "book/book#unarmed", "book/bc#taizuchangquan", "book/book#parry", "book/book#dodge"],
        odds: 2000
    }
];
}
