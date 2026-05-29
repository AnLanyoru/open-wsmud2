import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "大院"
this.desc = "你走进帮会大院，正对面是一个屏风，高大威猛，院子里铺满青砖，四周放着几个兵器架以供练功使用，几个帮派成员零零落落的站在四周，看到你进来警惕的看了你一眼。";
this.exits = { "west": "banghui/damen", "east": "banghui/juyitang", "south": "banghui/lianyao", "north": "banghui/liangong" };



this.is_init = false;
this.on_before_enter = function () {
    if (this.is_init) return;
    this.is_init = true;

}
}
