this.inherits(FAMILY_AREA);
this.set({
    id: "shashou",
    name: "杀手楼",
    desc: "一个游离在江湖外的神秘组织，法规森严，鲜少参与江湖争斗。",
    sp: "门下弟子多为杀手，一手暗器功夫出神入化",
    first: "shashou/damen",
    is_area: true,
    is_public: true,
    index: 7,
    room_path: "shashou/",
    family: "SHASHOU"
});
this.map = [
    { n: "大门", id: "shaolin/guangchang", p: [0, 0] },
    { n: "大厅", id: "shaolin/shanmen", p: [0, -1], exits: ["s", "nw"] },
    { n: "暗阁", id: "shaolin/liangong1", p: [-1, -2] },
    { n: "铜楼", id: "shaolin/liangong2", p: [0, -3], exits: ["sw", "nw", "e"] },
    { n: "暗阁", id: "shaolin/twdian", p: [-1, -4] },
    { n: "银楼", id: "shaolin/daxiong", p: [0, -5], exits: ["sw", "nw", "e"] },
    { n: "暗阁", id: "shaolin/zhonglou", p: [-1, -6] },
    { n: "金楼", id: "shaolin/gulou", p: [0, -7], exits: ["sw", "n", "e"] },
    { n: "平台", id: "shaolin/houdian", p: [0, -8] },
    { n: "书房", id: "shaolin/lianwu", p: [1, -7] },
    { n: "休息室", id: "shaolin/banruo", p: [1, -3] },
    { n: "练功房", id: "shaolin/luohan", p: [1, -5] }
];
