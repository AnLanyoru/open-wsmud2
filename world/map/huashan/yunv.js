import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "玉女峰"
this.desc = "这里是华山的中峰，玉女峰。玉女峰地势略为平缓，不似其它四峰般险峻，江湖上赫赫有名的华山剑派就在此处。西边有所小小的庙宇，那就是玉女祠了。东北面稀稀落落有十几间房子，是华山派的地方，闲杂游客最好别往那里去。";
this.exits = {
    "west": "huashan/yunvci",
    "south": "huashan/shanlu", "north": "huashan/lianwu"
};
}
