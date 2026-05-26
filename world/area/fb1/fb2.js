this.inherits(AREA);
this.set({
    id: "cuifu",
    name: "财主家",
    desc: "扬州城的一个土财主家，养了几个看家护院，在本地是横行霸道。",
    score: 100,
    is_show: true,
    first: "yz/cuifu/caizhu",
    is_copy: true,
    expend: 10,
    exp: 700,
    pot: 700,
    is_multi: false,
    is_diffi:true,
    room_path: "yz/cuifu/",
    ss_title: "护花使者"
});
this.map = [ { n: "大门", id: "yz/cuifu/caizhu", p: [0, 2], exits: ["n"] },
                    { n: "大院", id: "yz/cuifu/dayuan", p: [0, 1], exits: ["n"] },
                    { n: "后院", id: "yz/cuifu/houyuan", p: [0, 0], exits: ["w", "e1d"] },
                    { n: "东厢", id: "yz/cuifu/dongxiang", p: [1, 0] },
                    { n: "西厢", id: "yz/cuifu/xixiang", p: [-1, 0] }
];
this.drops = ["eq/lv0/jd_cloth", "eq/lv0/jd_shoes", "sp/yz/yaoshi", "eq/lv1/cui_sz", "eq/lv1/gold_ring", "sp/yz/box1", "book/book#unarmed", "book/book#parry", "book/book#dodge"];

this.quick_drops = [
    {
        obj: "money/silver",
        min: 1,
        max: 10
    }, {
        obj: [
            "eq/lv0/jd_cloth", "eq/lv0/jd_shoes"
        ],
        odds:8000
    },
    {
        obj: ["book/book#unarmed", "book/book#parry", "book/book#dodge"],
        odds: 2000
    },
    {
        obj: ["sp/yz/yaoshi", "eq/lv1/gold_ring", "eq/lv1/cui_sz"],
        odds: 100
    }
];