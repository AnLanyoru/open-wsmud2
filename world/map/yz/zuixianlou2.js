import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "醉仙楼";
    desc = "这里是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。这里也是城里举办喜宴的最佳场所。你站在楼上眺望，只觉得心旷神怡。东面是一池湖水，碧波荡漾。北面是崇山峻岭，而南面可以看到闻名全国的白鹿书院的后庭。";
    exits = { "down": "yz/zuixianlou" };
    no_fight = true;
}
