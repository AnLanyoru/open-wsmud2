this.inherits(COMMAND);
this.command = "wk";

this.enter = function (me) {

    var wea = me.query_weapon();
    if (me.master) {
        if (!me.is_in('home/huayuan')) return false;
        if (me.query_skill('guanshanjue', 0) < 100) {
            return me.notify('你的观山诀等级太低，无法在这里挖矿。');
        }
    }
    if (me.is_player) {
        if (!me.is_in('yz/kuang')) {
            if (!me.is_in('home/huayuan')) {
                return false;
            }
            if (me.query_skill('guanshanjue', 0) < 100) {
                return me.notify('你的观山诀等级太低，无法在这里挖矿。');
            }
        }
    }


    if (!wea || !wea.path.startsWith("sp/tool/chu")) return me.notify("挖矿不拿铁镐可怎么挖，你可以去扬州城的铁匠那里购买。");
    me.send_room("$N挥着铁镐开始认真挖矿。");

    me.set_state({
        id: "wk",
        type: "work",
        title: "挖矿",
        player: me,
        rate: 2,
        on_enter: do_diaoyu,
        stime: Date.now(),
        no_move: "你还在挖矿，专心点比较好！",
        desc: '["你扒拉着石头，仔细寻找碎石中有没有宝贝。","你拿着一块小石头对着阳光仔细的看着，不知道是不是宝贝。","你扔掉手中的碎石继续寻找，加油吧，运气好你就发达了。"]',
        on_check: on_check
    });
}

function on_check(me) {
    var exp = WORLD.DATA.exps[me.level]
        + WORLD.DATA.query_temp("kuang_exp", 0);
    var pot = exp + me.query_prop('gsj_qn');
    me.send(`你正在挖矿，每10秒获得${exp}经验，${pot}潜能，有概率挖到<hig>玄晶</hig>和其他宝石。`);
}
function do_diaoyu(me) {
    let obj = me.add_obj(["st/xuanjing", "st/st_red#0", "st/st_blu#0", "st/st_gre#0", "st/st_yel#0"
        , "st/st_red#1", "st/st_blu#1", "st/st_gre#1", "st/st_yel#1"][me.random(9)]);
    if (obj) {
        me.notify("<hig>恭喜你得到一颗" + obj.color_name + "。</hig>");
    }


    var exp = WORLD.DATA.get_exp(me)
        + WORLD.DATA.query_temp("kuang_exp", 0);

    var pot = exp + me.query_prop('gsj_qn');
    me.add_exp(exp, pot, 0);

}

