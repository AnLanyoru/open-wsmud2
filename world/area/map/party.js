
this.inherits(AREA);
this.set({
    name: "帮会",
    room_path: "banghui/",
    id: "banghui",
    is_copy: true,
    not_fb: true
});
this.map = [{ n: "大门", id: "home/danjian", p: [0, 0] },
    { n: "聚义堂", id: "home/woshi", p: [2, 0] },
    { n: "院子", id: "home/yuanzi", p: [1, 0], exits: ["w", "e", "s", "n"] },
    { n: "练功房", id: "home/liangong", p: [1, -1] },
    { n: "炼药房", id: "home/lianyao", p: [1, 1] },
    { n: "仓库", id: "home/cangku", p: [2, -1] }


];
this.query_owner = function (me) {
    return me.query_temp("pt");
}