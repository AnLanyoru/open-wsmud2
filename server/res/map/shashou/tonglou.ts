import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "铜楼";
    desc = "你来到杀手楼的二楼，这里装饰简单，仅在对面摆放了几张铜制的座椅，正厅一副对联，上书：功虽疏必赏，过虽近必诛";
    exits = {
    "up": "shashou/ange2",  "east": "shashou/xiuxi", "down": "shashou/ange1"
};
}
