import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "庙门";
    desc = "这里是峨眉派卧云庵的大门。一条青砖大道直通门口，在路的四周种满了各种青竹，走到门前，看见在门楣上挂了一块匾，上书三个大字「卧云庵」。";
    exits = { "east": "emei/jinding", "south": "emei/guangchang" };
}
