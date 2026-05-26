this.inherits(OBJ);
this.set({
    name: "碎裂的黄宝石",
    desc: "一块黄色的宝石，里面有些神秘的力量",
    unit: "块",
    value: 10000,
    combined: true,
    is_stone: true,
    transable: true,
    combine_count: 10,
    combine_to: "st/st_yel#1",
    grade: 1,
    prop: {
        max_hp: 10
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
            this.name = "黄宝石";
            this.prop = { max_hp: 100 };
            break;
        case 2:
            this.name = "精致的黄宝石";
            this.prop = { max_hp: 500 };
            break;
        case 3:
            this.name = "完美的黄宝石";
            this.prop = { max_hp: 1000 };
            break;
        case 4:
            this.name = "气血之石";
            this.prop = { max_hp: 2000 };
            break;
        default:
            this.name = "碎裂的黄宝石";
            this.prop = { max_hp: 10 };
            break;
    }

    this.grade = lv + 1;
    if (lv < 4) {
        this.combine_count = 10
        this.combine_to = path + "#" + (lv + 1);
        this.desc = this.desc + "，十块可以合成高级宝石。";
    } else {
        this.combine_to = "st/st_fy";
    }
    this.desc += "\n气血：+" + this.prop.max_hp;
}
