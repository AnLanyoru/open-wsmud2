import { NPC } from "../../../../core/char/npc.js";
import { WORLD } from "../../../../core/world.js";
import { OBJ } from "../../../../core/item/obj.js";
import { ROOM } from "../../../../core/room/room.js";
import { CHARACTER } from "../../../../core/char/character.js";

export default class extends NPC {
    name = "黑鹰教习";
    desc = "他身穿黑袍，手持长刀";
    gender = 1;
    age = 32;
    per = 22;
    mp = 1500;
    max_mp = 1500;
    hp = 2500;
    max_hp = 2500;
    no_refresh = true;

    constructor() {
        super();
        this.skill_map(
            ["unarmed", 180],
            ["dodge", 180],
            ["force", 180],
            ["parry", 180],
            ["blade", 180],
            ["heilongxinfa", 180, "force"],
            ["wuhuduanmendao", 180, "blade"]);
        this.set_objects(
            ["eq/lv0/cloth", 1, 1],
            ["eq/lv1/dandao", 1, 1]
        );
        this.set_drop({
            obj: "st/xuanjing",
            min: 1,
            max: 3
        }, {
            obj: ['eq/lv1/xk_cloth',
                'eq/lv1/xk_head',
                'eq/lv1/xk_shoes'],
            odds: 3000
        });
    }

    on_kill(me: CHARACTER): void {
    if (!this.fight_type) {
        let rooms = ['yz/hy/jiaochang1', 'yz/hy/jiaochang3',
            'yz/hy/jiaochang4', 'yz/hy/jiaochang5'];
        this.send_room('$N大声喊道：小的们，来活了！');
        let list: CHARACTER[] = [];
        for (let path of rooms) {
            let room = ROOM.Get(path);
            if (!room) continue;
            for (let item of room.items) {
                if (item instanceof CHARACTER && !item.fight_type && item.hp > 0 && item.is('yz/hy/jiaotu')) {
                    list.push(item);
                }
            }
        }
        for (let item of list) {
            item.moveto(this.environment!, item.name + '冲了过来。');
            item.do_kill(me);
        }
    }

}
    on_died(me: CHARACTER | undefined, corpse: any): void {
    let eny = this.enemy![0];
    if (eny && eny.hp > 0 && eny.environment === this.die_room) {

        let count = eny.query_temp('hy_ct', 0) ?? 0;
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
}
