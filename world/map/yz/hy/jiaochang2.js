this.inherits(ROOM);
this.name = "校场"
this.desc = "这里是一个青石铺就的空旷场地，中央有兵器架和木桩，地面布满深浅不一的脚印，东南角堆放着练习用的木人。周围零落站立着一些黑袍人，见你进来警惕的望着你。";
this.exits = {
    "south": "yz/hy/jiaochang1", "north": "yz/hy/jiaochang5",
    "west": "yz/hy/jiaochang3", "east": "yz/hy/jiaochang4"
};


this.set_npc('yz/hy/jiaoxi');

this.on_enter = function (me) {
    if (me.is_player) {
        let npc = this.find_by_path('yz/hy/jiaoxi');
        if (npc && !npc.fight_type) {
            npc.on_kill(me);
            npc.do_kill(me);
        }
    }
}