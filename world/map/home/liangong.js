this.inherits(ROOM);
this.name = "练功房"
this.desc = "这是一间布置的很别致的练功房，房间的北面各种武器玲琅满目，刀枪剑棍，十八般兵器在这里都能找到，四周石壁看上去很坚固，南半部散放着几个蒲团，供诸你打坐吐纳，调气养息，修练内功之用。";
this.exits = { "east": "home/yuanzi" };
this.add_action("xiulian", "修炼", null);
this.add_action("fenpei", "分配属性", null);
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
            { cmd: "dc " + me.id + " dazuo", name: "让" + me.name + "打坐" },
            { cmd: "makelove " + me.id, name: "和" + me.name + "双修" }
        ];
        me.master_json = null;
    }
   
    me.add_status({
        id: "room",
        duration: 0,
        desc: "你在练功房，心无旁骛，修炼效率得到提高",
        name: "静心",
        prop: {
            study_per:50,
            lianxi_per: 50,
            dazuo_per: 50
        }
    });
}