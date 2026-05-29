import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "玉女峰山路"
this.desc = "这里是玉女峰后山的一条山路。路边长满了翠竹，每当微风拂过，竹叶便沙沙作响，显得分外的幽静。";
this.exits = { "north": "huashan/yunv", "southup": "huashan/xiaojing", "eastdown": "huashan/zhenyue", };
}
