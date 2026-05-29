import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "广场";
this.desc = "这里是襄阳的中央广场，铺着青石地面。东面通向青龙门，西面通向白虎门，南面直达朱雀门，远远地你可看到北面是襄阳安抚使衙门。近年来蒙古大军屡次攻打襄阳，官府为防止蒙古奸细混杂进来，已经不允许人们在此聚集。只见一队官兵在此往来巡逻，你还是快离开吧。";
this.exits = { 
    east: "xiangyang/eastjie1", 
    west: "xiangyang/westjie1", 
    south: "xiangyang/southjie1", 
    north: "xiangyang/northjie1"
    };
 this.set_npc("xiangyang/guo");
}
