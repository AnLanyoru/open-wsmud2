
this.inherits(OBJ);
this.set({
    name: "新手宝箱",
    desc: "这是一个精铁制成的箱子，里面好像放了一些值钱的东西。",
    unit: "个",
    value: 0,
    grade: 1,
    combined: false
});
this.on_open = function (me) {
    var result = [
        { obj: "cash/jing#2", count: 3 },
        { obj: "cash/saodang", count: 10 },
        { obj: "cash/tianshifu", count: 5 }

    ];
    return OBJ.create_by_odds(result);
}
