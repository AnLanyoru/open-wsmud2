import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山门";
    desc = "这就是明教的山门，朱红色的两根大柱子矗立在你的面前，上面悬挂着一块黑色大匾，上书着“名扬五湖，威镇四海”几个金色大字，甚是威严。";
    exits = {
        "north": "fb/guangming/zhandao",
    };
}
