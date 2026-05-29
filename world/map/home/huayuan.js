import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "小花园";
    no_fight = true;
    desc = "这是你家的花园，迎面是一个小池塘，池塘里一群群的鱼儿游来游去，边上摆着一些奇形怪状的石头，水池的两旁种满了花花草草，郁郁葱葱，看上去有不少的珍惜品种";
    exits = { "southwest": "home/yuanzi" };
    can_diaoyu = true;
    can_caiyao = true;

    constructor() {
        super();
        this.add_action("diao", "钓鱼", function (me) {
            return WORLD.COMMANDS['diaoyu'].enter(me);
        });
        this.add_action("xkwk", "挖矿", function (me) {
            return WORLD.COMMANDS['wk'].enter(me);
        });
        this.add_action("cai", "采药", function (me) {
            return WORLD.COMMANDS['caiyao'].enter(me);
        });
    }

    on_enter(me) {
    if (me.master) {
        me.actions = [
            { cmd: "dc " + me.id + " diao", name: "让" + me.name + "钓鱼" },
            { cmd: "dc " + me.id + " cai", name: "让" + me.name + "采药" }
        ];

        if (me.query_skill('guanshanjue', 0) >= 100) {
            me.actions.push({ cmd: "dc " + me.id + " wk", name: "让" + me.name + "挖矿" });
        }
        me.master_json = null;
    }
}
    on_leave(me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
}
}

const WORLD = globalThis.WORLD;
