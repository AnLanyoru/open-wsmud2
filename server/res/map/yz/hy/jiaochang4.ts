import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "校场";
    desc = "这里是一个青石铺就的空旷场地，中央有兵器架和木桩，地面布满深浅不一的脚印，东南角堆放着练习用的木人。周围零落站立着一些黑袍人，见你进来警惕的望着你。";
    exits = {
    "southwest": "yz/hy/jiaochang1", "northwest": "yz/hy/jiaochang5",
    "west": "yz/hy/jiaochang2"
};
    move_exits = ['southwest', 'northwest'];

    constructor() {
        super();
        this.set_npc('yz/hy/jiaotu', 'yz/hy/jiaotu');
    }
}
