import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "崖底";
    desc = "这是崖底。";
    exits = {
        "south": "fb/jingnian/山路2",
    };
}
