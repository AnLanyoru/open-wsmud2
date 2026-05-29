import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "lcy";
    name = "丽春院";
    desc = "扬州城的丽春院是天下闻名，据说最近朝廷在追捕的几个逃犯在这里出现过，要不要去试试运气。";
    score = 100;
    is_show = true;
    first = "yz/lcy/dating";
    is_copy = true;
    expend = 10;
    is_multi = false;
    exp = 3000;
    pot = 3000;
    room_path = "yz/lcy/";
    ss_title = "丽春院护院";
    map = [
              { n: "大厅", id: "yz/lcy/dating", p: [0, 0], exits: ["u"] },
                    { n: "二楼", id: "yz/lcy/erlou", p: [0, -1], exits: ["w", "e"] },
                    { n: "西厢房", id: "yz/lcy/fang1", p: [-1, -1] },
                    { n: "东厢房", id: "yz/lcy/fang2", p: [1, -1] },
                    { n: "密室", id: "yz/lcy/mishi", p: [-2, -1] }
];
    drops = ["book/book#blade", "book/book#wuhuduanmendao", "book/bc#wuhuduanmendao", "book/book#whip", "book/bc#yunlongbian", "eq/lv2/hl_bian", "eq/lv1/dandao", "eq/lv1/guanfu", "eq/lv1/wei_neck"];
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
            "eq/lv2/hl_bian", "eq/lv1/dandao", "eq/lv1/guanfu"
        ],
        odds: 1000
    },
    {
        obj: ["book/book#blade", "book/bc#wuhuduanmendao", "book/book#whip", "book/bc#yunlongbian"],
        odds: 1000
    }
];
}
