this.inherits(EQUIPMENT);
this.set({
    unit: "把",
    name: "铁镐",
    desc: "一根精铁制成的铁镐",
    value: 1000,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.STAFF,

});

this.on_create = function (path, par) {
    let lv = 1;
    if (par) {
        par = par.substr(1);
        lv = parseInt(par);
        if (!(lv > 0 && lv < 7)) return;
    }
    this.grade = lv;
    this.prop = {
        gj: [1, 10, 40, 120, 340, 490, 690][lv],
        kuang1: [1, 5, 10, 15, 20, 25, 30][lv],
        desc: "你可以容易挖到高级宝石"
    };

    if (this.grade === 6) {
        this.name = "移山镐";
        this.desc = "你可以在自家后院挖矿，更容易挖到高级的宝石";
    }
    EQUIPMENT.prototype.on_create.apply(this);
}
