import { ROOM } from "../../../os/room/room.js";
import { WORLD } from "../../../os/world.js";

export default class extends ROOM {
    name = "华山绝顶";
    desc = "这里是华山最高一座山峰，登上此处，峰顶四周云雾飘渺，仿佛置身大海，众山犹如海中小岛，环绕着主峰，仿如一朵盛开的莲花。";
    exits = { "down": "huashan/luoyan" };

    constructor() {
        super();
        this.add_action('wqcy2', '修炼', function (me) {
            WORLD.COMMANDS.wqcy.enter(me);
        });
    }
}

