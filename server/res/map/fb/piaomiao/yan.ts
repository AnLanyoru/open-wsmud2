import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "失足岩";
    exits = {
        "south": "fb/piaomiao/ya",
        "north": "fb/piaomiao/jian",
    };
}
