import { AREA } from "../../../os/room/area.js";

export default function() {
this.inherits(AREA);
this.set({
    id: "zhuang",
    name: "庄府",
    desc: "因明史一案被抄家灭族的庄府一众妇孺被何惕守救后就藏在这里，想要伺机刺杀鳌拜",
    score: 100,
    is_show: true,
    first: "bj/zhuang/xiaolu",
    is_copy: true,
    expend: 10,
    exp: 10000,
    pot: 6000,
    is_multi: false,
    room_path: "bj/zhuang/",
    ss_title: "天下无双"
});
this.map = [
     { n: "小路", id: "bj/zhuang/xiaolu", p: [0, 3] },
                    { n: "小路", id: "bj/zhuang/xiaolu2", p: [0, 2], exits: ["s", "n"] },
                    { n: "大门", id: "bj/zhuang/damen", p: [0, 1] },
                    { n: "大院", id: "bj/zhuang/dayuan", p: [0, 0] },
                    { n: "大厅", id: "bj/zhuang/dating", p: [0, -1], exits: ["w", "s", "n", "e"] },
                    { n: "西厅", id: "bj/zhuang/dating1", p: [-1, -1] },
                    { n: "东厅", id: "bj/zhuang/dating2", p: [1, -1] },
                    { n: "走廊", id: "bj/zhuang/changlang", p: [0, -2] },
                    { n: "小屋", id: "bj/zhuang/xiaowu", p: [0, -3], exits: ["s"] }
];
this.drops = [
    "book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shenlongjian"
];

this.quick_drops = [
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
    },
    {
        obj: ["book/bc#shenxingbaibian", "book/bc#huashanjianfa", "book/bc#shenlongjian",
            "book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shenlongjian"],
        odds: 5000
    }
];
}
