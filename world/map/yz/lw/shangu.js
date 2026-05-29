import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "山谷";
    desc = "扬州城外的一个小山谷，这里风景还算秀丽，再往里有片很大的森林，人迹罕至。你侧耳倾听，似乎听到不少狼嚎声，你不禁加快了脚步，想快点离开这里。";
    exits = { "west": "yz/lw/milin" };
}
