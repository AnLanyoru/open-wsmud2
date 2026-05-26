
this.inherits(ROOM);
this.name = "药林"
this.desc = "这是一片茂密的树林。很多棵几十丈高的大树聚在一块，象一把把琼天大伞，连日月都被遮蔽得黯然无光，这里生长这很多奇花异草，运气好还可以找到珍稀的药材。"
this.exits = { "north": "yz/dongmen" };
this.no_fight = true;

this.can_caiyao = true;
this.add_action("cai", "采药", function (me) {
    return WORLD.COMMANDS['caiyao'].enter(me);
});