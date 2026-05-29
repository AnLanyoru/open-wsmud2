import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "大雄宝殿";
    desc = "这里是少林寺的大雄宝殿。正中供奉着如来三宝，左右各是文殊、普贤菩萨。一群青衣小和尚们正在佛像前的地上诵经。一些香客在地上跪着磕头，似乎在企求佛祖的庇佑。缕缕香烟与梵唱交错在一起，仰视佛祖拈花浅笑的面容，令人顿时生起几分脱俗之感。";
    exits = { "southdown": "shaolin/twdian" };
}
