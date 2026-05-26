this.inherits(OBJ);
this.set({
    unit: "株",
    name: "当归",
    desc: "这是一株草药",
    value: 1000,
    transable: true,
});
this.otype = 3;

this.on_create = function (path, par) {
    if (!par) return;
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv >= 0 && lv < 23)) return;
    this.name = ["当归", "芦荟", "山楂叶", "金银花", "石楠叶", "柴胡", "熟地黄", "沉香", "茯苓",
        "九香虫", "冬虫夏草", "络石藤", "人参", "何首乌", "凌霄花", "灵芝", "盘龙参", "天仙藤",
        "神血藤", "龙鳞草", "沉天叶", "轮回蛊", "凤鸣花"][lv];
    this.grade = parseInt(lv / 3);
    if (this.grade > 6) this.grade = 6;
    if (this.grade === 6) this.desc = "这是一株神奇的药草，可以炼制出传说中的神丹";
    this.value = [100, 1000, 5000, 10000, 50000, 100000, 680000][this.grade];

}
