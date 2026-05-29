import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "铜楼";
this.desc = "你来到杀手楼的二楼，这里装饰简单，仅在对面摆放了几张铜制的座椅，正厅一副对联，上书：功虽疏必赏，过虽近必诛";
this.exits = {
    "up": "shashou/ange2",  "east": "shashou/xiuxi", "down": "shashou/ange1"
};
}
