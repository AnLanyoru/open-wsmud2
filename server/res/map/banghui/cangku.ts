import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "仓库";
    desc = "这里是你帮派的仓库，一扇厚厚的铁门紧锁着，里面堆满了你们帮会的战利品，仓库管理员可以在这里选择怎么处理这些战利品。";
    exits = { "south": "banghui/juyitang" };
    no_fight = true;

    constructor() {
        super();
        this.add_action("roll", "掷骰子", function (this: MapRoom, me: CHARACTER) {
            let rad = me.random(100) + 1;

            me.send_room(rollDesc.random() + "，稳稳停在了" + rad + "点。");
        });
        this.add_action("pandian", "仓库盘点", function (this: MapRoom, me: CHARACTER) {
            WORLD.COMMANDS["party"].enter(me, 'stores');

        });
        this.add_action("alloc", "分配战利品", function (this: MapRoom, me: CHARACTER) {

            WORLD.COMMANDS["party"].enter(me, 'alloc');

        });
    }
}

const rollDesc = [
    "$N摸出一枚骰子，指尖一捻便抛向空中，骰子在半空划出一道弧线后坠落",
    "$N将骰子扣在掌心轻轻摇晃，伴随着清脆的碰撞声，骰子在桌面飞速旋转",
    "$N随手抄起桌上的骰子，手腕轻抖掷出，骰子在地面弹跳数下后逐渐减速"
];
