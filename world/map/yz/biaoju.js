this.inherits(ROOM);
this.name = "福威镖局"
this.desc = "你来到一座结构宏伟的建筑前，左右石坛上各插着一根两丈多高的旗杆，杆上青旗飘扬。右首旗子用金线绣着一头张牙舞爪的狮子，狮子上头有一只蝙蝠飞翔。左首旗子上写着“福威镖局”四个黑字，银钩铁划，刚劲非凡。入口处排着两条长凳，几名镖头坐着把守。少镖头正跟他们说笑。";
this.exits = { "south": "yz/zhengting", "north": "yz/xidajie2" };
this.set_npc("yz/linpingzhi", ["yz/biaotou", 2]);