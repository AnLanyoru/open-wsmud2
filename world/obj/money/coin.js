this.inherits(MONEY);
this.set({
    name: "铜板",
    desc: "虽然少但也是钱",
    unit: "枚",
    value: 1,
});

this.unit_name = function () {
    return UTIL.moneyToStr(this.count);
}