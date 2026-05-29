import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "林间小道";
    desc = "这是一条长长的林间小道，从东边一直通到西边，一眼望去，看不到路的尽头。两旁百花争艳，令人留连忘返。";
    exits = { "east": "xiaoyao/qingcaop", "south": "xiaoyao/xiuxishi" };
}
