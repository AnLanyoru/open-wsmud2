import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "兵营";
    desc = "这里是兵营，密密麻麻到处都是官兵，有的在武将的指挥下列队操练，有的独自在练功，有的坐着、躺着正在休息。南墙下坐着主帅，不动声色地寻视着四周。看到你进来，他们全都向你包围了过来，形势看来不太妙。南边有一个<CMD cmd='look men'>门(men)</CMD>。";
    exits = { "south": "yz/by/bingqiku", "north": "yz/by/damen" };

    constructor() {
        super();
        this.set_npc("yz/shiqingshan", ["pub/wujiang", 2]);
        this.set_item("men", "铁门", "这是一扇极厚的铁门。", [[
            "open", "打开", function (me, par) {
                if (par != "men") {
                    return;
                }

                if (me.str + me.query_prop("str") < 30) {
                    me.send_room("$N使出吃奶的力气推向铁门，半晌后瘫倒在地，但是铁门还是纹丝不动。");
                } else {
                    me.send_room("$N大喝一声，使出全力推开铁门。");
                    this.south_open = true;
                }
                return true;
            }
        ]]);
    }

    on_leave(me, dir) {
    if (dir == "south") {
        if (!this.south_open) {
            me.notify("门还是关着的，你过不去。");
            return false;
        }
    }
}
}
