import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "练功房";
    desc = "这是树林中的一间石屋，屋内显得什么清净和简朴，房间中并没有什么特别的摆设在这里，不会受到任何东西的骚扰，是个修炼内功的好地方。";
    exits = { "east": "wd/shijie1" };

    constructor() {
        super();
        this.set_npc('pub/muren');
    }
}
