import { AREA } from "../../../os/room/area.js";

export default function() {
this.inherits(AREA);
this.set({
    id: "by",
    name: "兵营",
    desc: "这是扬州城兵营，扬州守备史青山就驻扎在这里",
    score: 100,
    is_show: true,
    first: "yz/by/damen",
    is_copy: true,
    expend: 10,
    is_multi: false,
    exp: 3000,
    pot: 3000,
    room_path: "yz/by/",
    ss_title: "扬州守备"
});
this.map = [
        { n: "大门", id: "yz/lcy/dating", p: [0, 0] },
                    { n: "兵营", id: "yz/lcy/erlou", p: [0, 1], exits: ["n", "s"] },
                    { n: "兵器库", id: "yz/lcy/fang1", p: [0, 2] }
];
this.drops = ["book/book#blade", "book/book#sword", "eq/lv2/jiangjunjian", "eq/lv1/jundao", "eq/lv1/junfu", "eq/lv1/qimeigun", "eq/lv1/guanfu"];

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
    }, {
        obj: [
            "eq/lv2/jiangjunjian", "eq/lv1/jundao", "eq/lv1/junfu", "eq/lv1/guanfu"
        ],
        odds: 1000
    },
    {
        obj: ["book/book#sword",  "book/book#blade"],
        odds: 1000
    }
];
}
