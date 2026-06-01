import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "东大街";
    desc = "你走在东大街上，踩着坚实的青石板地面。东边是东城门，可以听到守城官兵的吆喝声，与西边朗朗的读书声混杂在一起。北边是一家老字号的药铺，南边是打铁铺，叮叮当当的声音老远就能听到。";
    exits = {"east":"yz/dongmen","south":"yz/datiepu","west":"yz/dongdajie1","north":"yz/yaopu"};
}
