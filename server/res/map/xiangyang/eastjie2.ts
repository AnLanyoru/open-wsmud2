import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "东大街";
    desc = "这是一条宽阔的青石板街道，向东西两头延伸。";
    exits = {
    east  : "xiangyang/eastjie3",
    west  : "xiangyang/eastjie1",
    // south : "xiangyang/jiedao",
    // north : "xiangyang/eastroad1",
};
}
