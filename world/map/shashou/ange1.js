import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "暗阁";
    desc = "这里是杀手楼每层中间的通道，四周都是阴森黑暗墙壁，没有任何装饰，在这里你依然没有摆脱被人监视的感觉";
    exits = {
    "up": "shashou/tonglou", "down": "shashou/datang"
};

    on_leave(me, dir) {
    if (dir == 'up') {
        if (me.family != FAMILIES.SHASHOU) {
            me.moveto("shashou/ange1");
            me.notify('<hib>你在黑呼呼的暗阁转来转去，感觉又回到了原地。</hib>');
            return false;
        }
    }

}
}

const FAMILIES = globalThis.FAMILIES;
