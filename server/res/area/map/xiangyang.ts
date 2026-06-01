import { AREA } from "../../../core/room/area.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends AREA {
    id = "xiangyang";
    name = "襄阳城";
    desc = "这里是镇守北方的襄阳城，这里常年征战，江湖中能人义士没事都喜欢过来这里支援下坚守此地的郭大侠";
    is_area = true;
    first = "xiangyang/guangchang";
    no_cache = true;
    index = 8;
    room_path = "xiangyang/";
    is_public = true;
    map = [
    { n: "中央广场", id: "xiangyang/guangchang", p: [0, 0], exits: ["w", "e", "s", "n"] },
    { n: "东大街", id: "xiangyang/eastjie1", p: [1, 0] },
    { n: "东大街", id: "xiangyang/eastjie2", p: [2, 0], exits: ["w", "e"] },
    { n: "东大街", id: "xiangyang/eastjie3", p: [3, 0] },
    { n: "东门", id: "xiangyang/eastgate1", p: [4, 0], exits: ["w", "e", "s", "n"] },
    { n: "东门外", id: "xiangyang/eastgate2", p: [5, 0] },
    { n: "西大街", id: "xiangyang/westjie1", p: [-1, 0] },
    { n: "西大街", id: "xiangyang/westjie2", p: [-2, 0], exits: ["w", "e"] },
    { n: "西大街", id: "xiangyang/westjie3", p: [-3, 0] },
    { n: "西门", id: "xiangyang/westgate1", p: [-4, 0], exits: ["w", "e", "s", "n"] },
    { n: "西门外", id: "xiangyang/westgate2", p: [-5, 0] },
    { n: "南大街", id: "xiangyang/southjie1", p: [0, 1] },
    { n: "南大街", id: "xiangyang/southjie2", p: [0, 2], exits: ["s", "n"] },
    { n: "南大街", id: "xiangyang/southjie3", p: [0, 3] },
    { n: "南门", id: "xiangyang/southgate1", p: [0, 4], exits: ["w", "e", "s", "n"] },
    { n: "南门外", id: "xiangyang/southgate2", p: [0, 5] },
    { n: "北大街", id: "xiangyang/northjie1", p: [0, -1] },
    { n: "北大街", id: "xiangyang/northjie2", p: [0, -2], exits: ["s", "n"] },
    { n: "北大街", id: "xiangyang/northjie3", p: [0, -3] },
    { n: "北门", id: "xiangyang/northgate1", p: [0, -4], exits: ["w", "e", "s", "n"] },
    { n: "北门外", id: "xiangyang/northgate2", p: [0, -5] },
    { n: "城墙", id: "xiangyang/walle1", p: [4, -1] },
    { n: "城墙", id: "xiangyang/walle2", p: [4, -2], exits: ["s", "n"] },
    { n: "城墙", id: "xiangyang/walle3", p: [4, -3] },
    { n: "城墙", id: "xiangyang/walle4", p: [4, -4], exits: ["s", "w"] },
    { n: "城墙", id: "xiangyang/walle5", p: [3, -4] },
    { n: "城墙", id: "xiangyang/walle6", p: [2, -4], exits: ["e", "w"] },
    { n: "城墙", id: "xiangyang/walle7", p: [1, -4] },
    { n: "城墙", id: "xiangyang/walle8", p: [-1, -4], exits: ["e", "w"] },
    { n: "城墙", id: "xiangyang/walle9", p: [-2, -4] },
    { n: "城墙", id: "xiangyang/walle10", p: [-3, -4], exits: ["e", "w"] },
    { n: "城墙", id: "xiangyang/walle11", p: [-4, -4] },
    { n: "城墙", id: "xiangyang/walle12", p: [-4, -3], exits: ["n", "s"] },
    { n: "城墙", id: "xiangyang/walle13", p: [-4, -2] },
    { n: "城墙", id: "xiangyang/walle14", p: [-4, -1], exits: ["n", "s"] },
    { n: "城墙", id: "xiangyang/walle15", p: [-4, 1] },
    { n: "城墙", id: "xiangyang/walle16", p: [-4, 2], exits: ["n", "s"] },
    { n: "城墙", id: "xiangyang/walle17", p: [-4, 3] },
    { n: "城墙", id: "xiangyang/walle18", p: [-4, 4], exits: ["n", "e"] },
    { n: "城墙", id: "xiangyang/walle19", p: [-3, 4] },
    { n: "城墙", id: "xiangyang/walle20", p: [-2, 4], exits: ["w", "e"] },
    { n: "城墙", id: "xiangyang/walle21", p: [-1, 4] },
    { n: "城墙", id: "xiangyang/walle22", p: [1, 4], exits: ["w", "e"] },
    { n: "城墙", id: "xiangyang/walle23", p: [2, 4] },
    { n: "城墙", id: "xiangyang/walle24", p: [3, 4], exits: ["w", "e"] },
    { n: "城墙", id: "xiangyang/walle25", p: [4, 4] },
    { n: "城墙", id: "xiangyang/walle26", p: [4, 3], exits: ["s", "n"] },
    { n: "城墙", id: "xiangyang/walle27", p: [4, 2] },
    { n: "城墙", id: "xiangyang/walle28", p: [4, 1], exits: ["s", "n"] },
];

    on_enter(me) {

    var status = WORLD.DATA.query_temp("xy_status", 0);
    if (status !== 1) return;
    var pt = WORLD.DATA.query_temp('xy_party');
    if (pt) {
        if (pt !== me.query_temp('pt'))
            return me.notify_fail(pt + "正在协助守城，你还是不要去添乱了。");
        if (!me.query_temp('xy_bm'))
            me.set_temp('xy_bm', 1, 3600000);
        return true;
    }
    if (!me.query_temp('xy_bm'))
        return me.notify_fail("襄阳战事已起，需要报名参与守城才可进入。");


    // if (status === 1 && !is_bm(me)) {
    //     var temp = me.temp["xy_hd"];
    //     if (temp) {
    //         var time = temp.e - Date.now();
    //         if (time > 0) {
    //             return me.notify_fail("你还有" + parseInt(time / 3600000) + "小时" + parseInt((time % 3600000) / 60000) + "分才可以再次进入襄阳城。");
    //         }
    //     }
    //     var pt = WORLD.DATA.query_temp('xy_party');
    //     if (pt && pt !== me.query_temp('pt')) {
    //         return me.notify_fail(pt + "正在协助守城，你还是不要去添乱了。");

    //     }
    //     var user_count = WORLD.DATA.query_temp("xy_users", 0);
    //     if (user_count >= 40) return me.notify_fail("襄阳城已经有太多人参与守城了，你进不去。");
    //     // me.set_temp('xy_hd', 1, 3600000 * 24 * 7);
    //     // WORLD.DATA.add_temp("xy_users", 1);
    // }
}
    query_actions(me) {
    let actions = [];
    let index = WORLD.DATA.query_temp("xiangyang") + 20;
    let status = WORLD.DATA.query_temp("xy_status", 0);
    let user_count = WORLD.DATA.query_temp("xy_users", 0);
    let pt = WORLD.DATA.query_temp('xy_party');
    if (status === 0) {
        actions.push([, , "目前襄阳无战事"]);
    } else if (status === 1) {
        if (pt) {
            actions.push([, , "<mag>襄阳战事正紧，" + pt + "正在协助守城</mag>"]);
        } else {
            actions.push(["systask xiangyang bm", "报名", "<mag>襄阳战事正紧，目前有" + user_count + "/40位大侠正在参与守城</mag>"]);

        }
    }
    else if (status == 12) {

        actions.push(["systask xiangyang reward", "领取军功", "<hig>武神历" + UTIL.to_c(index) + "年蒙古可汗蒙哥被击杀于襄阳城下，襄阳城大获全胜！郭大侠犒赏全军！</hig>"]);

    } else if (status == 10) {

        actions.push([, , "<hir>武神历" + UTIL.to_c(index) + "年郭大侠战死襄阳，襄阳城失守！</hir>"]);
    } else if (status == 11) {

        actions.push(["systask xiangyang reward", "领取军功", "<hig>武神历" + UTIL.to_c(index) + "年蒙古大军久攻不下从襄阳城撤退，襄阳危机解除！郭大侠犒赏全军!</hig>"]);
    }
    return actions;
}
}

