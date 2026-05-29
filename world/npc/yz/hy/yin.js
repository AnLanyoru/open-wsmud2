import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "尹小龙";
    desc = "他本是青木堂的堂主，被黑鹰队所擒";
    title = "青木堂堂主";
    gender = 1;
    age = 55;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 1000;
    max_hp = 1000;
    score = 10;
    no_refresh = true;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["houquan", 200, "unarmed"],
            ["yunlongshenfa", 200, "dodge"],
            ["yunlongxinfa", 200, "force"]);
        this.set_drop(
            {
                obj: ['eq/lv1/xk_cloth',
                    'eq/lv1/xk_shoes'],
                odds: 5000
            }, {
            obj: [
                'eq/lv1/xk_head',
                'eq/lv1/qingmu'],
            odds: 500
        }
        );
    }

    on_enter(me) {
    if (me.is_player) {
        this.die();
    }
}
    on_died(killer, corpse) {

    if (killer)
        corpse.items = null;
    else {
        corpse.no_alloc = true;
        corpse.query_items = this.query_items;
        corpse.clear_items = this.clear_items;
    }
}
    query_items(eny) {
    let items = this.items;
    if (!items || !items.length) return null;
    if (this.owner) {
        if (this.owner === eny.id)
            return items;
        return null;
    }
    let count = eny.query_temp('hy_ct', 0);
    if (count > 0) {
        this.owner = eny.id;
        return items;
    }
    return null;
}
    clear_items(eny) {
    this.items = null;
    if (this.owner && this.owner === eny.id && eny.query_temp('hy_ct', 0) > 0) {
        eny.add_exp(0, 10000);
        eny.add_temp('hy_ct', -1);
        this.owner = null;
    }
}
}
