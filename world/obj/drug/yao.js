this.inherits(OBJ);
this.unit = "颗";
this.name = "蛇血丹";
this.value = 30000;
this.grade = 3;
this.combined = true;
this.distime = 60000;
this.allow_fight = true;
this.desc = "这是一份白驼山出产的蛇血丹，不知道什么功效";
this.action_msg = "吃";
this.transable = true;
this.on_use = function (me) {
    me.notify("<hic>你吃掉一颗蛇血丹。</hic>");
    switch (this.drug_type) {
        case 1:
            me.add_status({
                id: "food",
                name: "暴虐",
                desc: "增加你的伤害，减少你的防御",
                prop: {
                    diff_sh_per: -8,
                    add_sh_per: 8
                },
                duration: 10000
            });

            break;
        case 2:
            me.add_status({
                id: "food",
                name: "龟灵",
                desc: "增加你的防御，减少你的伤害",
                prop: {
                    diff_sh_per: 8,
                    add_sh_per: -8
                },
                duration: 10000
            });
            break;
        case 3:
            var sx = 50 + me.random(me.con);
            me.limit_mp += sx;
            me.notify("<hiw>你的内力上限增加了" + sx + "。</hiw>");
            break;
        default:
            var hp = me.add_hp(parseInt(me.max_hp * 0.3));
            if (hp) {
                me.notify("<hig>你恢复了" + hp + "气血。</hig>");
            }
            break;
    }
}
this.on_create = function (path, par) {
    var lv = 0;
    if (par) {
        lv = parseInt(par.substr(1));
    }
    this.drug_type = lv;
    this.name = ["再生", "暴虐", "龟灵", "培元"][lv] + this.name;

}