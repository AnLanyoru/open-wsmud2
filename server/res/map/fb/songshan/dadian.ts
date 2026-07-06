import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "中岳大殿";
    desc = "这是中岳大殿。";
    exits = {
        "south": "fb/songshan/tianzhongge",
    };
}
