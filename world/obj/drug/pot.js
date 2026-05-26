this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "潜灵果",
    desc: "包含无限潜力的绿色果子，增加500-1000潜能",
    grade: 1,
    pot: 500,
    value: 1000
});
this.transable = true;
this.on_use = function (me) {
    me.notify("你吞下一颗" + this.color_name + "。");
    me.add_exp(0, this.random(this.pot) + this.pot);
    return true;
}

this.on_create = function (path, par) {
    if (!par) {
        this.path = path + "#0";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 5)) return;
    switch (lv) {
        case 1:
            this.name = "潜灵果";
            this.pot = 5000;
            this.value = 2000;
            this.desc = "包含无限潜力的绿色果子，增加5000-10000潜能";
            break;
        case 2:
            this.name = "潜灵果";
            this.pot = 10000;
            this.value = 5000;
            this.desc = "包含无限潜力的绿色果子，增加10000-20000潜能";
            break;
        case 3:
            this.name = "潜灵果";
            this.pot = 20000;
            this.value = 10000;
            this.desc = "包含无限潜力的绿色果子，增加20000-40000潜能";
            break;
        case 4:
            this.name = "潜灵果";
            this.pot = 50000;
            this.value = 50000;
            this.desc = "包含无限潜力的绿色果子，增加50000-100000潜能";
            break;
        default:
            this.name = "潜灵果";
            this.pot = 500;
            this.value = 1000;
            this.desc = "包含无限潜力的绿色果子，增加500-1000潜能";
            break;
    }
    this.grade = lv + 1;
}
