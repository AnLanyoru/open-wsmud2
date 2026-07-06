import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "青龙堂";
    desc = "这是青龙堂。";
    exits = {
        "north": "fb/heimu/shangu",
        "south": "fb/heimu/ql_lang",
    };
}
