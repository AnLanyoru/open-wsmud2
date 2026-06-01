import { NPC } from "../../../../core/char/npc.js";
import { ROOM } from "../../../../core/room/room.js";
import { CORPSE } from "../../../../core/item/corpse.js";

export default class extends NPC {
    name = "黑鹰教徒";
    desc = "他们身穿黑袍，持长刀，动作整齐划一";
    gender = 1;
    age = 32;
    per = 22;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;
    no_refresh = true;

    constructor() {
        super();
        this.skill_map(
            ["unarmed", 150],
            ["dodge", 150],
            ["force", 150],
            ["parry", 150],
            ["blade", 150],
            ["heilongxinfa", 150, "force"],
            ["wuhuduanmendao", 150, "blade"]);
        this.set_objects(
            ["eq/lv0/cloth", 1, 1],
            ["eq/lv1/dandao", 1, 1]
        );
        this.set_drop({
            obj: "st/xuanjing",
            min: 1,
            max: 3
        });
    }

    on_heart_beat() {
    let exits = this.environment.move_exits;
    if (!exits || !exits.length) return;
    this.do_command('go', exits.random());
    for (let item of this.environment.items) {
        if (item.is_player) {
            this.send_room("$N喊道：这里有个小毛贼！");
            return this.do_kill(item);
        }
    }
}
    on_enter(me) {
    if (me.is_player && !this.fight_type) {
        this.send_room("$N喝道：" + me.call(true) + "，哪里来的小毛贼！");
        this.do_kill(me);
    }
}
    die(killer) {
    if (!this.environment) return;
    if (this.on_die && this.on_die(killer) == false) {
        this.hp = 1;
        return false;
    }
    this.hp = 0;
    this.clear_status();
    this.send_room(DIE_MSG.random());
    var corpse = new CORPSE();

    var isinfb = this.environment.is_fb();
    corpse.init(this, isinfb);
    this.die_room = this.environment;
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    // this.call_out(this.relive, 120000);
    this.on_died && this.on_died(killer, corpse);

}
    on_died(me, corpse) {
    let eny = this.enemy[0];
    if (eny && eny.hp > 0 && eny.environment === this.die_room) {
        let count = eny.query_temp('hy_ct', 0);
        if (count > 0) {
            eny.add_exp(0, 10000);
            eny.add_temp('hy_ct', -1);
            for (let item of corpse.items) {
                eny.send('你得到了' + item.unit_name() + "。");
                eny.add_obj(item);
            }
        }

    }
    corpse.items = null;
}
    relive() {
    if (!this.die_room) return;
    var room = ROOM.Get(rooms.random());

    obj = NPC.CLONE(this.path);
    room.item_changed(obj, true);
    this.die_room = null;
    this.equipment = null;
    this.items = null;
    this.skills = null;
}
}

var DIE_MSG = ["\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n",
    "\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n",
    "\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n"];
const rooms = ['yz/hy/jiaochang1', 'yz/hy/jiaochang3',
    'yz/hy/jiaochang4', 'yz/hy/jiaochang5'];
