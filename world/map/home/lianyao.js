this.inherits(ROOM);
this.name = "炼药房"
this.desc = "这是你的炼药房，还没进入就先闻到一股浓烈的药草香味，房间里面没有多余的设施，一个大大的炼药炉摆在房子中间。";
this.exits = { "west": "home/yuanzi" };

this.can_lianyao = true;
this.add_action("lianyao", "炼药");
//this.add_action("lianyao2", "研制丹药");
this.on_leave = function (me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
    me.remove_status("room");
}
this.on_enter = function (me) {
    if (me.master) {
        me.actions = [
            { cmd: "dc " + me.id + " lianyao", name: "让" + me.name + "炼药" }
        ];
        me.master_json = null;
    }

    me.add_status({
        id: "room",
        duration: 0,
        desc: "你在你的炼药房，炼药效率得到提升",
        name: "专心",
        prop: {
            lianyao1: 2
        }
    });
}