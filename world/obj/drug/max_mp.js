this.inherits(OBJ);
this.set({
    unit: "粒",
    name: "聚气丹",
    grade: 1,
    desc: "江湖中各大门派用来给入门弟子快速增加内力的丹药。",
    value: 1000,
    add_mp: 10
});
this.transable = true;
this.on_use = function (me) {
    if (me.max_mp >= me.limit_mp + me.query_prop("limit_mp")) {
        return me.notify_fail("你的经脉容纳不了再多的内力了。");
    }

    var count = this.random(this.add_mp / 2) + this.add_mp / 2;
    me.add_maxmp(count);
}

this.on_create = function (path, par) {
    var lv = 0;
    if (!par) {
        this.path = path + "#0";
    } else {
        lv = parseInt(par.substr(1));
    }
    if (!(lv >= 0 && lv < 5)) return;
    this.grade = lv + 1;
    switch (lv) {
        case 1:
            this.name = "聚气丹";
            this.add_mp = 20;
            this.value = 2000;
            this.desc = "江湖中各大门派用来给入门弟子快速增加内力的丹药，使用后增加最大内力20，不超过内力上限。";
            break;
        case 2:
            this.name = "聚气丹";
            this.add_mp = 50;
            this.value = 5000;
            this.desc = "江湖中各大门派用来给入门弟子快速增加内力的丹药，使用后增加最大内力50，不超过内力上限。";
            break;
        case 3:
            this.name = "聚气丹";
            this.add_mp = 200;
            this.value = 10000;
            this.desc = "江湖中各大门派用来给入门弟子快速增加内力的丹药，使用后增加最大内力200，不超过内力上限。";
            break;
        case 4:
            this.name = "聚气丹";
            this.add_mp = 500;
            this.value = 20000;
            this.desc = "江湖中各大门派用来给入门弟子快速增加内力的丹药，使用后增加最大内力500，不超过内力上限。";
            break;
        default:
            this.name = "聚气丹";
            this.add_mp = 10;
            this.value = 1000;
            this.desc = "江湖中各大门派用来给入门弟子快速增加内力的丹药，使用后增加最大内力10，不超过内力上限。";
            break;
    }
}
