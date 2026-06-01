import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "朝天宫";
    desc = "这里是一座金碧辉煌的大殿，匾上书朝天宫三个金字。南边是虎头岩，北边是三天门，人来人往很热闹。";
    exits = { "south": "wd/hutou", "north": "wd/santian" };
}
