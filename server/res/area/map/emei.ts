import { FAMILY_AREA } from "../../../core/room/fam_area.js";

export default class extends FAMILY_AREA {
    id = "emei";
    name = "峨眉派";
    desc = "佛家门派，创派祖师是郭襄女侠。郭襄女侠的父亲是郭靖，母亲是黄蓉 。郭襄女侠早年心中念念不忘于神雕大侠杨过，走遍天下，找寻不到。在她四十岁那年，忽然大彻大悟，出家为尼，开创了峨眉一派 。";
    sp = "只收女弟子，内功普渡众生，招式却以狠辣见长";
    is_area = true;
    first = "emei/jinding";
    index = 4;
    room_path = "emei/";
    family = "EMEI";
    map = [
    { n: "广场", id: "emei/guangchang", p: [0, 0], exits: ["w", "e", "s", "n"] },
    { n: "庙门", id: "emei/miaomen", p: [0, -1] },
    { n: "睹光台", id: "emei/duguangtai", p: [1, -2] },
    { n: "华藏庵", id: "emei/huacang", p: [2, -2], exits: ["w"] },
    { n: "金顶", id: "emei/jinding", p: [1, -1], exits: ["w", "n"] },
    { n: "大殿", id: "emei/dadian", p: [0, 1] },
    { n: "走廊", id: "emei/zoulang1", p: [1, 0], exits: ["e", "s"] },
    { n: "走廊", id: "emei/zoulang2", p: [-1, 0] },
    { n: "走廊", id: "emei/zoulang3", p: [-1, 1], exits: ["s", "n"] },
    { n: "走廊", id: "emei/zoulang4", p: [-1, -1], exits: ["s", "n"] },
    { n: "厨房", id: "emei/chufang", p: [2, 0] },
    { n: "休息室", id: "emei/xiuxishi", p: [1, 1] },
    { n: "清修洞", id: "emei/qingxiu", p: [-1, 2] },
    { n: "小屋", id: "emei/xiaowu", p: [-1, -2] },
    { n: "练功房", id: "emei/liangong", p: [-2, 0], exits: ["e"] }
];
}
