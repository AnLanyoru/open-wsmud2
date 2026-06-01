import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "西大街";
    desc = "你走在西大街上，感到这里的街面要比别处的干净、整洁。大概因为靠近衙门、兵营可受保护的缘故，富人们都喜欢住在这里。东边静悄悄地没有几个行人，西边是西城门通往郊外。南边是一座镖局，北边是一所富丽堂皇的大宅院。";
    exits = {"east":"yz/xidajie1","south":"yz/biaoju","west":"yz/ximen","north":"yz/home"};
}
