import { AREA } from "../../../os/room/area.js";
import { ROOM } from "../../../os/room/room.js";

export default class extends AREA {
    name = "黑鹰校场";
    room_path = "yz/hy/";
    desc = "鳌少保在扬州秘密组建的一支直属亲信的精锐武装力量，其中的成员多来自江湖草莽或是八旗军中的死士，他们训练严苛，执行一些见不得光的指令。";
    id = "heiying";
    first = "yz/hy/tongdao";
    is_copy = true;
    not_fb = true;
    map = [
    { n: "地下甬道", id: "yz/hy/tongdao", p: [0, 0] },
    { n: "校场", id: "yz/hy/jiaochang1", p: [0, -1], exits: ["s", 'nw', 'ne'] },
    { n: "校场", id: "yz/hy/jiaochang2", p: [-1, -2] },
    { n: "校场", id: "yz/hy/jiaochang3", p: [0, -2], exits: ["s", 'n', 'w', 'e'] },
    { n: "校场", id: "yz/hy/jiaochang4", p: [1, -2] },
    { n: "校场", id: "yz/hy/jiaochang5", p: [0, -3], exits: ["sw", 'se', 'n'] },
    { n: "黑鹰厅", id: "yz/hy/yishiting", p: [0, -4] },

];
    drops = [
    'st/xuanjing',
    'money/pot',
    'book/ts#heilongxinfa',
    'eq/lv1/xk_cloth',
    'eq/lv1/xk_head',
    'eq/lv1/xk_shoes',
    'eq/lv1/qingmu'];

    on_enter(me) {


    var next_room = ROOM.Get('yz/hy/tongdao');
    var copy_room = next_room.query_copy2(me);
    if (!copy_room) {
        copy_room = next_room.create_copy2(me);
    }
}
    on_leave(me) {

    var copy_room = this.rooms[0].query_copy2(me);
    if (copy_room) {
        copy_room.clear_copy(me);
    }
}
}

