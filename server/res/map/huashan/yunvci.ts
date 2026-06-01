import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "玉女祠";
    desc = "玉女祠里供奉的到底是哪位玉女，有许多不同的说法，现在所能看到的只一尊呆板的石像。祠中大石上有一处深陷，凹处积水清碧，这是玉女的洗脸盆，碧水终年不干。";
    exits = { "east": "huashan/yunv" };
}
