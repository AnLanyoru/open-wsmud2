import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "letai";
    name = "擂台";
    room_path = "yz/leitai/";
    map = [{ n: "擂台", id: "yz/leitai/leitai", p: [0, 0], exits: ["s1d"] },
{ n: "雷台下", id: "yz/leitai/ltx", p: [0, 1] },
];

    on_leave(me) {
    if (me.is_in('yz/leitai/leitai'))
        return me.notify_fail('结束比武后才可离开擂台。');
    return true;
}
}
