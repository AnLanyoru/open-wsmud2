import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "大院";
    desc = "你走进帮会大院，正对面是一个屏风，高大威猛，院子里铺满青砖，四周放着几个兵器架以供练功使用，几个帮派成员零零落落的站在四周，看到你进来警惕的看了你一眼。";
    exits = { "west": "banghui/damen", "east": "banghui/juyitang", "south": "banghui/lianyao", "north": "banghui/liangong" };
    is_init = false;

    on_before_enter() {
    if (this.is_init) return;
    this.is_init = true;

}
}
