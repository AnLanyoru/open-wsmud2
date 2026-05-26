this.inherits(FAMILY_AREA);
this.set({
    name: "华山派",
    id: "huashan",
    is_area: true,
    desc: "儒家门派代表，门下子弟大都书生装扮，据传祖师爷是一位风姓书生，本是五岳剑派之首，却因分裂成气剑二宗而式微。",
    first: "huashan/zhenyue",
    index: 3,
    room_path: "huashan/",
    sp: "剑法突出，伤害高，气血防御低",
    family: "HUASHAN"
});
this.map = [
    { n: "练武场", id: "huashan/lianwu", p: [0, 0], exits: ["n", "s", "e"] },
    { n: "客厅", id: "huashan/keting", p: [0, -1], exits: ["e"] },
    { n: "偏厅", id: "huashan/pianting", p: [1, -1] },
    { n: "卧室", id: "huashan/woshi", p: [0, -2], exits: ["s"] },
    { n: "练功房", id: "huashan/liangong", p: [1, 0] },
    { n: "玉女峰", id: "huashan/yunv", p: [0, 1], exits: ["e1d", "w", "s"] },
    { n: "玉女祠", id: "huashan/yunvci", p: [-1, 1] },
    { n: "山路", id: "huashan/shanlu", p: [0, 2] },
    { n: "小径", id: "huashan/xiaojing", p: [0, 3], exits: ["n1d", "s"] },
    { n: "思过崖", id: "huashan/siguoya", p: [0, 4] },
    { n: "山洞", id: "huashan/hole", p: [-1, 4] },
    { n: "长空栈道", id: "huashan/zhandao", p: [-2, 4], exits: ["w1d", "e1d"] },
    { n: "落雁峰", id: "huashan/luoyan", p: [-3, 4] },
    { n: "镇岳宫", id: "huashan/zhenyue", p: [1, 1] },
    { n: "苍龙岭", id: "huashan/canglong", p: [2, 1], exits: ["s1d", "w1d"] },
    { n: "舍身崖", id: "huashan/sheshen", p: [2, 2] },
    { n: "峭壁", id: "huashan/qiaobi", p: [2, 3] },
    { n: "山谷", id: "huashan/shangu", p: [3, 3], exits: ["w", "s1d"] },
    { n: "山间平地", id: "huashan/pingdi", p: [3, 4] },
    { n: "小屋", id: "huashan/xiaowu", p: [4, 4], exits: ["w"] }
];
