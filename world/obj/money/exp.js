this.inherits(OBJ);
this.set({
    name: "经验",
    desc: "你获得的经验，潜能",
    unit: "点",
    value: 0,
    grade:1
});
this.on_receive = function (me) {
    if (!this.count) return false;
    me.add_exp(this.count, this.count);
}