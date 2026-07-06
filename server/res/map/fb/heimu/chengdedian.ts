import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "承德殿";
    desc = "这是承德殿。";
    exits = {
        "west": "fb/heimu/damen",
        "east": "fb/heimu/houdian",
    };
}
