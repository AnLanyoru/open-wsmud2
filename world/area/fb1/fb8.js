this.inherits(AREA);
this.set({
    id: "tdh",
    name: "天地会",
    desc: "天地会在北京城的青木堂所在，据说在入口在一家药铺里面",
    score: 100,
    is_show: true,
    first: "bj/tdh/hct",
    is_copy: true,
    expend: 10,
    exp: 6000,
    pot: 4000,
    is_multi: false,
    room_path: "bj/tdh/",
    ss_title: "青木堂香主"
});
this.map = [
    { n: "暗道入口", id: "bj/tdh/andao1", p: [0, 0], exits: ["n1d", "w"] },
    { n: "内室", id: "bj/tdh/neishi", p: [0, -1] },
    { n: "回春堂", id: "bj/tdh/hct", p: [1, -1], exits: ["w"] },
    { n: "暗道", id: "bj/tdh/andao", p: [-1, 0], exits: ["w"] },
    { n: "暗道出口", id: "bj/tdh/andao2", p: [-2, 0] },
    { n: "大厅", id: "bj/tdh/dating", p: [-2, -1], exits: ["w", "s", "n"] },
    { n: "侧厅", id: "bj/tdh/ceting", p: [-3, -1] },
    { n: "客店后院", id: "bj/tdh/kedian", p: [-2, -1] },
    { n: "东客房", id: "bj/tdh/kedian3", p: [-1, -1], exits: ["w"] }
];
this.drops = [
    "book/bc#mizongxinfa", "book/bc#dashouyin", "book/bc#houquan", "book/bc#yunlongjian", "book/bc#yunlongshenfa", "book/bc#yunlongxinfa",
    "book/bc#shenxingbaibian", "book/bc#qiufengfuchen", "eq/lv2/yunlongjian"
];
