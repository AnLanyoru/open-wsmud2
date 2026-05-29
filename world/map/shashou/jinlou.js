import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "金楼";
    desc = "你来到杀手楼的四楼，正对面一个巨大的金制座椅，座椅背后是一副浮雕，一个书生模样的年轻人站在云端，一根利剑直刺大地，上书：刑法天下。";
    exits = {
    "up": "shashou/pingtai", "down": "shashou/ange3", "west": "shashou/shufang"
};
}
