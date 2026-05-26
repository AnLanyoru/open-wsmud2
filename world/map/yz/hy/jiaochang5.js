this.inherits(ROOM);
this.name = "校场"
this.desc = "这里是一个青石铺就的空旷场地，中央有兵器架和木桩，地面布满深浅不一的脚印，东南角堆放着练习用的木人。周围零落站立着一些黑袍人，见你进来警惕的望着你。";
this.exits = {
    "southwest": "yz/hy/jiaochang3", "southeast": "yz/hy/jiaochang4",
    "south": "yz/hy/jiaochang2", "north": "yz/hy/yishiting"
};

this.move_exits = ['southwest', 'southeast'];
this.set_npc('yz/hy/jiaotu', 'yz/hy/jiaotu');