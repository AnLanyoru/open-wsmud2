this.inherits(FAMILY_AREA);
this.set({
    id: "xiaoyao",
    name: "逍遥派",
    desc: "庄周道家门派，据传由祖师逍遥子创立门派，门下弟子大都多才多艺，医卜星相，琴棋书画，机械杂工，贸迁种植，斗酒唱曲，行令猜谜，五行八卦、奇门遁甲、农田水利、经济 兵略，无所不通，无所不精。",
    first: "xiaoyao/qingcaop",
    is_area: true,
    index: 5,
    room_path: "xiaoyao/",
    sp: "内功突出，轻功轻灵飘逸，攻击手段多样",
    family: "XIAOYAO"
});
this.map = [
    { n: "青草坪", id: "xiaoyao/qingcaop", p: [0, 0], exits: ["w", "e", "s", "n", "nw1d"] },
    { n: "林间小道", id: "xiaoyao/linjian", p: [1, 0] },
    { n: "林间小道", id: "xiaoyao/linjian1", p: [0, -1] },
    { n: "林间小道", id: "xiaoyao/linjian2", p: [0, 1] },
    { n: "林间小道", id: "xiaoyao/linjian3", p: [-1, 0] },
    { n: "木板路", id: "xiaoyao/muban", p: [1, 1] },
    { n: "工匠屋", id: "xiaoyao/muwu3", p: [1, 2], exits: ["n"] },
    { n: "练功房", id: "xiaoyao/liangong", p: [1, -1], exits: ["s"] },
    { n: "木屋", id: "xiaoyao/muwu1", p: [0, 2], exits: ["n"] },
    { n: "木屋", id: "xiaoyao/muwu2", p: [0, -2], exits: ["s"] },
    { n: "休息室", id: "xiaoyao/xiuxishi", p: [-1, 1], exits: ["n"] },
    { n: "地下石室", id: "xiaoyao/shishi", p: [-1, -1] },
    { n: "地下石室", id: "xiaoyao/shishi2", p: [-1, -2], exits: ["s1d"] }
];


