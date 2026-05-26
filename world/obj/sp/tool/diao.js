this.inherits(EQUIPMENT);
this.set({
    unit: "根",
    name: "钓鱼竿",
    desc: "一根竹子制成的钓鱼竿",
    value: 1000,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.CLUB
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
        diaoyu1: [1, 5, 10, 15, 20, 25, 30][lv],
        desc: "你更容易掉到稀有的鱼"
    };

    EQUIPMENT.prototype.on_create.apply(this);
}
