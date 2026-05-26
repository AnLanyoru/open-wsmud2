this.inherits(ROOM);
this.name = "杂货铺"
this.desc = "这是一家小小的杂货铺，大箱小箱堆满了一地，都是一些日常用品。杨掌柜懒洋洋地躺在一只躺椅上，招呼着过往行人。据说私底下他也卖一些贵重的东西。摊上立着一块招牌(zhaopai)。";
this.exits = { "north": "yz/dongdajie1", "up": "yz/garments" };

this.no_fight = true;
this.set_item("zhaopai","招牌", "请用 \"list\" 列出货物表，\"buy\" 向老板购物。\n货真价实，童叟无欺");
this.set_npc("yz/yang");