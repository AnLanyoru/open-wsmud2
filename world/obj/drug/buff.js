this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "药丸",
    desc: "一颗神秘的药丸",
    grade: 1,
    prop: null
});
this.on_use = function (me) {
    me.notify("你吞下一颗" + this.color_name + "。");
    if (!this.prop) return;
    me.add_status({
        id: "drugbuff",
        name: this.name,
        desc: this.desc,
        duration: 50000 + this.grade * 10000,
        prop: this.prop,
        override: 1
    });
    return true;
}
this.on_create = function (path, par) {
    var lv = 1;
    var type = 0;
    if (par) {
        par = par.substr(1);
        lv = parseInt(par[0]);
        type = parseInt(par[1]);
        if (!(lv > 0 && lv < 5)) lv = 1;
    }
    this.grade = lv + 1;
    this.value = [100000, 1000000, 2000000, 5000000, 10000000][lv];
    var init = this["create_type" + type];
    if (init) {
        init.call(this, lv);
    }
}
this.create_type0 = function (lv) {
    this.name = "神力丸";
    var val = [20, 50, 100, 200, 400][lv];
    this.desc = "一颗神秘的药丸，吃了后增加你" + val + "点后天臂力。";
    this.prop = {
        str: val
    };
}
this.create_type1 = function (lv) {
    this.name = " 风行丹";
    var val = [20, 50, 100, 200, 400][lv];
    this.desc = "一颗神秘的药丸，吃了后增加你" + val + "点后天身法。";
    this.prop = {
        dex: val
    };
}

this.create_type1 = function (lv) {
    this.name = "飞燕丹";
    var val = [20, 50, 100, 200, 400][lv];
    this.desc = "一颗神秘的药丸，吃了后增加你" + val + "点后天身法。";
    this.prop = {
        dex: val
    };
}