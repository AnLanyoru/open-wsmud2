import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "lw";
    name = "树林";
    desc = "扬州东城外的一处山坳，被一群狼占领着，有些不知情的人误闯到这里就再也回不去了，据说丢下不少金银财宝。";
    score = 50;
    first = "yz/lw/shangu";
    is_show = true;
    is_copy = true;
    expend = 10;
    index = 0;
    exp = 500;
    pot = 500;
    room_path = "yz/lw/";
    ss_title = "拾荒者";
    map = [
    { n: "山谷", id: "yz/lw/shangu", p: [0, 0], exits: ["w"] },
    { n: "密林", id: "yz/lw/milin", p: [-1, 0], exits: ["w"] },
    { n: "密林", id: "yz/lw/milin2", p: [-2, 0], exits: ["w"] },
    { n: "密林深处", id: "yz/lw/milin3", p: [-3, 0] },
];
    drops = ["res/pimao1",
    "eq/lv0/cloth",
    "eq/lv0/dao",
    "eq/lv0/ring",
    "eq/lv0/tiegun",
    "eq/lv0/jian",
    "eq/lv0/jin",
    "eq/lv0/shoes",
    "eq/lv0/duanyi",
    "book/book#dodge"];
}
