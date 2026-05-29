import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "wudao";
    name = "武道塔";
    desc = "江湖中一处神秘的地方，一座高耸入云的高塔，具体有多少层没人说的清楚，据说有不少令武林人士神往的秘籍和宝物";
    is_area = true;
    first = "wudao/men";
    room_path = "wudao/";
    index = 9;
    is_public = true;
    sp = "从第一层开始挑战，可获取秘籍残页，技能强化书，根据最高挑战层数每日领取奖励";
    map = [{ n: "入口", id: "wudao/men", p: [0, 0], exits: ["e"] },
{ n: "武道塔", id: "wudao/ta", p: [1, 0] },
{ n: "塔顶", id: "wudao/ding", p: [1, -5], exits: ["e", "s", "w", "n"] },
{ n: "朱雀台", id: "wudao/south", p: [1, -4] },
{ n: "白虎台", id: "wudao/west", p: [0, -5] },
{ n: "玄武台", id: "wudao/north", p: [1, -6] },
{ n: "青龙台", id: "wudao/east", p: [2, -5] },
];

    query_actions(me) {

    let actions = [];
    var name = WORLD.DATA.query_temp("wudao_max_user");
    if (name) {
        var lv = WORLD.DATA.query_temp("wudao_max");
        actions.push([
            'goto wd1', '前往挑战', "目前最高记录的保持者是" + name
            + "：" + UTIL.to_c(lv) + "层"
        ]);
    } else {
        actions.push([
            'goto wd1', '前往挑战', "目前尚无挑战记录"
        ]);
    }
    const names = ['青龙', '白虎', '玄武', '朱雀'];
    for (let i = 0; i < 4; i++) {
        let ss = WORLD.DATA.query_temp('wd_ss' + i, 0);
        if (ss > 0) {
            actions.push([
                'goto wd2', '前往挑战',
                names[i] + "试炼的记录保持者是"
                + WORLD.DATA.query_temp('wd_ss' + i + '_n', 0) + "：" + ss + "息"
            ]);
        }
    }

    return actions;
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
