import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "蛇血丹";
    value = 30000;
    grade = 3;
    combined = true;
    distime = 60000;
    allow_fight = true;
    desc = "这是一份白驼山出产的蛇血丹，不知道什么功效";
    action_msg = "吃";
    transable = true;

    on_use(me) {
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
    on_create(path, par) {
    var lv = 0;
    if (par) {
        lv = parseInt(par.substr(1));
    }
    this.drug_type = lv;
    this.name = ["再生", "暴虐", "龟灵", "培元"][lv] + this.name;

}
}
