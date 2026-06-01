import { AREA } from "../../../core/room/area.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends AREA {
    name = "襄阳";
    room_path = "xiangyang/";
    id = "xiangyang";
    first = "xiangyang/guangchang";
    desc = "";
    map = [];

    // ... (map data and other methods unchanged, keeping existing class body)

    query_actions(me: CHARACTER) {
        const actions: (string | number)[][] = [];
        const index = Number(WORLD.DATA.query_temp("xiangyang") ?? 0) + 20;
        const status = WORLD.DATA.query_temp("xy_status", 0) ?? 0;
        const user_count = WORLD.DATA.query_temp("xy_users", 0) ?? 0;
        const pt = WORLD.DATA.query_temp("xy_party");
        if (status === 0) {
            actions.push(["", 1, "目前襄阳无战事"]);
        } else if (status === 1) {
            if (pt) {
                actions.push(["", 1, "<mag>襄阳战事正紧，" + pt + "正在协助守城</mag>"]);
            } else {
                actions.push(["systask xiangyang bm", "报名", "<mag>襄阳战事正紧，目前有" + user_count + "/40位大侠正在参与守城</mag>"]);
            }
        } else if (status == 12) {
            actions.push(["systask xiangyang reward", "领取军功", "<hig>武神历" + UTIL.to_c(Number(index)) + "年蒙古可汗蒙哥被击杀于襄阳城下，襄阳城大获全胜！郭大侠犒赏全军！</hig>"]);
        } else if (status == 10) {
            actions.push(["", 1, "<hir>武神历" + UTIL.to_c(Number(index)) + "年郭大侠战死襄阳，襄阳城失守！</hir>"]);
        } else if (status == 11) {
            actions.push(["systask xiangyang reward", "领取军功", "<hig>武神历" + UTIL.to_c(Number(index)) + "年蒙古大军久攻不下从襄阳城撤退，襄阳危机解除！郭大侠犒赏全军!</hig>"]);
        }
        return actions;
    }
}
