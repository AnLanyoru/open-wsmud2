this.inherits(MONSTER);
this.set({
    name: "狼王",
    desc: "一只强壮的野狼，应该是这里的头领，对你龇了龇锋利的尖牙，吐出那长长的血红色的舌头",
    gender: 1,
    mp: 100,
    max_mp: 100,
    hp: 300,
    max_hp: 300,
    score: 20,
    dex: 16,
    str: 16
});
this.skill_map(
    ["bite", 10]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao1",
    min: 1,
    max: 5
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/ring", "eq/lv0/tiegun", "eq/lv0/jian", "eq/lv0/jin", "eq/lv0/shoes", "eq/lv0/duanyi", "book/book#dodge"]

});

this.on_died = function (me, corpse) {
    if (me.environment.is_time() && !me.equipment[0]) {
        corpse.items.push(OBJ.CREATE('res/langpi'));
    }
}
this.on_enter = function (me) {
    if (!this.environment.is_time()) {
        return this.do_kill(me);
    }
    if (!me.is_player) {
        if (me.is('yz/lw/she')) {
            me.on_died = this.on_shedied;
            return this.do_kill(me);
        }
        return;
    }

    if (this.name != "狼王") {
        return this.do_kill(me);
    }
    if (me.query_temp('langpi')) {
        me.notify(this.name + "龇牙弓背警惕的看着你。");
        if (!WORLD.DATA.query_temp('zq7', 0)) {
            var rm = ROOM.Get('yz/lw/milin2').query_copy2(me);
            for (var i = 0; i < rm.items.length; i++) {
                if (rm.items[i].is('yz/lw/lang')) {
                    rm.items[i].on_died = this.on_langdied;
                    rm.items[i].moveto(this.environment, null);
                    me.notify('一只小狼跟着你慢悠悠的溜达过来。');
                    return;
                }
            }
        }
        return;
    }
    var rm = ROOM.Get('yz/lw/milin2').query_copy2(me);
    if (!rm) {
        return;
    }
    var lang = 0;
    for (var i = 0; i < rm.items.length; i++) {
        if (rm.items[i].is('yz/lw/lang')) {
            lang++;
        }
    }
    if (lang != 2) {
        return this.do_kill(me);
    }

    if (WORLD.DATA.query_temp('zq1')) return;
    //一区脱光
    if (me.equipment) {
        for (var i = 0; i < me.equipment.length; i++) {
            if (me.equipment[i]) return;
        }

        this.call_out(() => {
            if (!this.fight_type)
                this.environment.create_lw(me, this, 1, "$N看到$n光溜溜的走了过来，发疯似的朝$p扑了过来....\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>");
        }, 2000);
    }
}
this.on_langdied = function (me, corpse) {
    //三区刺激变身
    var npc = me.environment.find_obj_bypath('yz/lw/langwang');
    if (npc && !WORLD.DATA.query_temp('zq7', 0) && me.environment.is_time()) {
        me.environment.create_lw(me, npc, 7, '<hir>$N看到你击杀了小狼，顿时双眼通红咆哮着冲了过来...</hir>\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>');
    }
}
this.on_shedied = function (npc, corpse) {
    //四区吃蛇变身
    if (npc.is_player) return;
    var me = null;
    for (var i = 0; i < npc.environment.items.length; i++) {
        if (npc.environment.items[i].is_player) {
            me = npc.environment.items[i];
            break;
        }
    }
    if (!me) return;
    if (npc.is('yz/lw/langwang') && !WORLD.DATA.query_temp('zq8', 0) && me.environment.is_time()) {
        npc.end_fight();
        me.environment.create_lw(me, npc, 8, '$N撕扯着毒蛇整个吞了下去...\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>');
    }
}