this.inherits(ROOM);
this.name = "大厅"
this.desc = "你一走进来，一眼就看到大厅的墙上挂着一幅幅<cmd cmd='look tu'>春宫图(tu)</cmd>，一下子就明白了这是什么地方。厅内到处张灯结彩，香气扑鼻。几名打扮得妖里妖气的女人分站两旁对你发出媚笑。主人韦春芳上上下下、前前后后招呼着客人。从楼上传来了阵阵打情骂俏的声音。";
this.exits = { "up": "yz/lcy/erlou"};
this.set_item("tu", "图", "上面画了一些不可描述的内容");
this.set_npc("yz/lcy/weichunfang");