import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "银楼";
    desc = "你来到杀手楼的三楼，这里装饰多了些，一些貌似是银制的兵器挂在墙上，对面摆放了几张银制的座椅，正厅一副对联，上书：虚则知实之情，静则知动者正";
    exits = {
    "up": "shashou/ange3", "down": "shashou/ange2", "east": "shashou/liangong",
};
}
