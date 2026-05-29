import { NPC } from "../../../../os/char/npc.js";

export default function() {
    const ROOM = globalThis.ROOM;
this.inherits(NPC);
this.set({
    name: "铁虎",
    title: "黑鹰队长",
    desc: "他身高近七尺，虎背熊腰，脸上一道从眉骨延伸至下颌的刀疤",
    gender: 1,
    age: 32,
    per: 22,
    mp: 2500,
    max_mp: 2500,
    hp: 3000,
    max_hp: 3000,
    prop: {
        gj: 50
    }
});

this.no_refresh = true;


this.on_kill = function (me) {
    if (!this.fight_type) {
        let rooms = ['yz/hy/jiaochang1', 'yz/hy/jiaochang3',
            'yz/hy/jiaochang4', 'yz/hy/jiaochang5'];
        this.send_room('$N道：不知死活！');
        let list = [];
        for (let path of rooms) {
            let room = ROOM.Get(path);
            for (let item of room.items) {
                if (item.hp > 0 && item.is('yz/hy/jiaotu')) {
                    list.push(item);
                }
            }
        }
        for (let item of list) {
            item.moveto(this.environment, item.name + '冲了过来。');
            item.do_kill(me);
        }
    }

}
this.on_died = function (me, corpse) {
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


this.skill_map(
    ["unarmed", 200],
    ["dodge", 200],
    ["force", 200],
    ["parry", 200],
    ["blade", 200],
    ["feiyanzoubi", 200, "dodge"],
    ["heilongxinfa", 200, "force"],
    ["wuhuduanmendao", 200, "blade"]);
this.set_objects(
    ["eq/lv0/cloth", 1, 1],
    ["eq/lv1/dandao", 1, 1]
);

this.set_drop({
    obj: "st/xuanjing",
    min: 10,
    max: 30
}, {
    obj: ["book/bc#wuhuduanmendao", "eq/lv1/dandao"],
    odds: 3000
});
}
