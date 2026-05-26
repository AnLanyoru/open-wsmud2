this.inherits(ROOM);
this.name = "内室"
this.desc = "这是药铺的内室，是平一指炼药的地方，整个房间空荡荡的只有一个药炉，虽说这里人来人往不是很安静，但到底是个可以让你免费炼药的地方";
this.exits = { "south": "yz/yaopu" };

this.add_action("lianyao", "炼药");
this.can_lianyao = true;