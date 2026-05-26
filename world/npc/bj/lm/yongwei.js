this.inherits(NPC);
this.name = "披甲俑卫";
this.desc = "身着残破铁甲，头盔遮住大半面容，仅露一双空洞眼窝。手持锈迹斑斑的长刀。";
this.gender = 1;

this.age = 200;
this.per = 20;

this.mp = 5000;
this.max_mp = 5000;
this.hp = 22000;
this.max_hp = 22000;

this.score = 20;
this.prop = {
    gj: 1000,
    mz: 1500,
    fy: 2000,
    ds: 1000,
    zj: 1000,
    gjsd: 1500
};
this.skill_map(
    ["dodge", 200],
    ["parry", 250],
    ["unarmed", 300],
    ["force", 300],
    ["daidaokuilei", 380,
        ["unarmed", "parry", "force", "dodge"]]);
this.set_drop({
    obj: "st/xuanjing",
    min: 1,
    max: 3
}, {
    obj: ['eq/lv2/lm_cloth',
        'eq/lv2/lm_tou',
        'eq/lv2/lm_shoes',
        'eq/lv2/lm_pifeng',
        'eq/lv2/lm_pei'],
    odds: 500
});
