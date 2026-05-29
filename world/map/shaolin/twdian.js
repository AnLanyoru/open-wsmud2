import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "天王殿"
this.desc = "殿内香烟燎绕，幔角叮咚。香火比前殿要旺盛的多。正前方供着个大肚子，似乎永远都笑咪咪的弥勒佛。四大天王分列两旁，分执“风调雨顺”。两侧香桌上摆满了四季果蔬，弥勒的身后站立的是韦驮。";
this.exits = { "south": "shaolin/shanmen", "northwest": "shaolin/gulou", "northeast": "shaolin/zhonglou", "northup": "shaolin/daxiong" };
//this.set_npc("shaolin/daojue");
}
