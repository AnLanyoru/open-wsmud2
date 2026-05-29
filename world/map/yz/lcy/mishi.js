import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "密室"
this.desc = "这是一间密室，房间很小，设备也很简陋，一张小床，一张单桌，一个大汉站在哪里小心的戒备这你。";
this.exits = { "out": "yz/lcy/fang2" };
this.set_npc("yz/lcy/maoshiba");

this.on_enter = function (me) {
    if (me.is_player) {
        var mao = this.find_by_path("yz/lcy/maoshiba");
        if (!mao) return;
        var shi = this.find_by_path("yz/lcy/shisong");
        if (!shi) return;
        me.notify("史松一拍腰间的软鞭，说道:在下黑龙鞭史松，奉鳌少保将令，捉拿天地会反贼。茅十八，受死吧！");
        shi.do_kill(mao);

        me.notify("茅十八道：你奶奶的，大呼小叫干什么？");
    }
  
}
}
