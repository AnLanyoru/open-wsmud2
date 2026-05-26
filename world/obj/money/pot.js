this.inherits(OBJ);
this.set({
    name: "潜能",
    desc: "学习或练习武功需要消耗的潜能",
    unit: "点",
    value: 0,
    grade: 1
});
this.on_receive = function (me) {
    if (!this.count) return false;
    me.add_exp(0, this.count);
}