this.inherits(FAMILY_AREA);
this.set({
    id: "shaolin",
    name: "少林派",
    desc: "佛家门派，由域外僧人达摩所创，历史悠久，不仅精研佛法，武功亦是不凡，有天下武功出少林之说",
    sp: "只收男弟子，需要剃度，防御高，气血长",
    first: "shaolin/guangchang",
    is_area: true,
    index: 2,
    room_path: "shaolin/",
    family: "SHAOLIN"
});
this.map = [
    { n: "广场", id: "shaolin/guangchang", p: [0, 5] },
    { n: "山门殿", id: "shaolin/shanmen", p: [0, 4], exits: ["w", "e", "n", "s"] },
    { n: "东侧殿", id: "shaolin/liangong1", p: [1, 4] },
    { n: "西侧殿", id: "shaolin/liangong2", p: [-1, 4] },
    { n: "天王殿", id: "shaolin/twdian", p: [0, 3], exits: ["nw", "ne", "n1d", "s"] },
    { n: "大雄宝殿", id: "shaolin/daxiong", p: [0, 2] },
    { n: "钟楼", id: "shaolin/zhonglou", p: [1, 2] },
    { n: "鼓楼", id: "shaolin/gulou", p: [-1, 2] },
    { n: "后殿", id: "shaolin/houdian", p: [0, 1], exits: ["sw", "se", "n"] },
    { n: "练武场", id: "shaolin/lianwu", p: [0, 0], exits: ["w", "e", "n"] },
    { n: "般若堂", id: "shaolin/banruo", p: [-1, 0] },
    { n: "罗汉堂", id: "shaolin/luohan", p: [1, 0] },
    { n: "方丈楼", id: "shaolin/fangzhang", p: [0, -1], exits: ["w", "e", "n"] },
    { n: "达摩院", id: "shaolin/damo", p: [-1, -1] },
    { n: "戒律院", id: "shaolin/jielv", p: [1, -1] },
    { n: "竹林", id: "shaolin/zhulin1", p: [0, -2], exits: ["w", "n"] },
    { n: "藏经阁", id: "shaolin/cangjing", p: [-1, -2] },
    { n: "竹林", id: "shaolin/zhulin2", p: [0, -3] },
    { n: "达摩洞", id: "shaolin/damodong", p: [0, -4] }
];
