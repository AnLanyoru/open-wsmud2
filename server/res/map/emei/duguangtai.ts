import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "睹光台";
    desc = "这是一个宽大的广场，从这里可以看到峨眉的全貌，每日当朝霞初升，如果站在睹光台上，在你身后将幻出一轮光环，景色瑰丽多彩。在广场两边有两排架子，上面插满了兵器。在广场上有一些峨眉弟子正在那里或练习武功、或相互讨教。";
    exits = { "southdown": "emei/jinding" , "east": "emei/huacang"};
}
