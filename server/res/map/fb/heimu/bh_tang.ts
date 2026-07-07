import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "白虎堂";
    exits = {
        "south": "fb/heimu/shangu",
        "north": "fb/heimu/bh_lang",
    };
}
