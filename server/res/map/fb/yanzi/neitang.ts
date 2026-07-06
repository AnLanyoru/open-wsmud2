import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "内堂";
    desc = "这是内堂。";
    exits = {
        "west": "fb/yanzi/houting",
    };
}
