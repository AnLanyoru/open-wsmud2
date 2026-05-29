import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "小巷子";
    desc = "你继续走进破烂巷子，里面更加的乌烟瘴气，墙角有几个小流氓吊儿郎当的站着看着你。北面有个破茅屋不知道里面有什么，在这里你还是小心为上，不要乱闯。";
    exits = { "west": "yz/lmw/xiangzi1", "north": "yz/lmw/pomaowu", "east": "yz/lmw/xiangzi3", };

    constructor() {
        super();
        this.set_npc(["yz/lm/liumang", 2]);
    }

    on_leave(me, dir) {
    if (dir == "west" || dir == "north") {
        var obj = this.find_obj_bypath("yz/lm/liumang");
        if (obj) {
            if (me.gender == 1) {
                me.notify("流氓吊儿郎当的拦住你。");
            } else {
                me.notify("流氓轻佻的朝你吹了个口哨，嬉皮笑脸的说道：妹妹要到哪里去？");
            }
     
            return false;
        }
    }
}
}
