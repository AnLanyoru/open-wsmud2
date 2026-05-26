this.inherits(OBJ);
this.set({
    name: "碎裂的绿宝石",
    desc: "一块绿色的宝石，里面有些神秘的力量",
    unit: "块",
    value: 10000,
    combined: true,
    is_stone: true,
    transable: true,
    combine_count: 10,
    combine_to: "st/st_gre#1",
    grade: 1,
    prop: {
        mz: 1
    }
});
this.otype = 2;
this.on_create = function (path, par) {
    var lv = 0;
    if (!par) {
        this.path = path + "#0";
    } else {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;
    }
    this.value = WORLD.DATA.stone_values[lv];
    switch (lv) {
        case 1:
            this.name = "绿宝石";
            this.prop = { mz: 10 };
            break;
        case 2:
            this.name = "精致的绿宝石";
            this.prop = { mz: 50 };
            break;
        case 3:
            this.name = "完美的绿宝石";
            this.prop = { mz: 100 };
            break;
        case 4:
            this.name = "命中之石";
            this.prop = { mz: 200 };
            break;
        default:
            this.name = "碎裂的绿宝石";
            this.prop = { mz: 1 };
            break;
    }
    this.grade = lv + 1;
    if (lv < 4) {
        this.combine_count = 10
        this.combine_to = path + "#" + (lv + 1);
        this.desc = this.desc + "，十块可以合成高级宝石。";

    } else {
        this.combine_to = "st/st_mz";
    }
    this.desc += "\n命中：+" + this.prop.mz;
}
