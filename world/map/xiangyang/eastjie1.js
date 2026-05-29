import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "东大街";
this.desc = "这是一条宽阔的青石板街道，向东西两头延伸。东边是一个大十字街口。西面是襄阳的中央广场，北边是襄阳守城大将王坚的府邸大门，只见那儿守备森严，闲杂人等一般是不能接近的。";
//南面飘来一缕缕的药香，噢，原来是一家药铺。";
this.exits = { 
    east: "xiangyang/eastjie2", 
    west: "xiangyang/guangchang", 
    // south: "xiangyang/yaopu", 
    // north: "xiangyang/jiangjungate"
};
}
