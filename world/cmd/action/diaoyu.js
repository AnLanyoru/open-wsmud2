this.inherits(COMMAND);
this.command = "diaoyu";

this.enter = function (me) {
    if (!me.environment || !me.environment.can_diaoyu)
        return false;
    var wea = me.query_weapon();
    if (!wea || !wea.path.startsWith("sp/tool/diao")) return me.notify("你没有装备钓竿不可以钓鱼。");
    var er = query_er(me);
    if (!er) return me.notify("你身上没有鱼饵，可以去扬州城的杂货店购买钓竿和鱼饵。");
    me.send_room("$N坐在岸边，把手中的$W甩到水里。");

    me.set_state({
        id: "diao",
        type: "work",
        title: "钓鱼",
        player: me,
        rate: 2,
        yuer: er,
        on_enter: do_diaoyu,
        stime: Date.now(),
        on_check: on_check,
        no_move: "你还在钓鱼，专心点比较好！",
        desc: '["你眼睛一眨也不眨地盯着浮漂，专心致志。","浮漂一上一下的在动，看样子有东西要上钩了！"]',
    });
}

function on_check(me) {
    var exp = WORLD.DATA.exps[me.level]
        + WORLD.DATA.query_temp("diaoyu_exp", 0);

    var pot = exp + me.query_prop('lsj_qn');
    let er = this.yuer;

    let grade = me.query_prop('diaoyu1') + (er.grade) * 5;
    let str = "";
    if (grade > 30) {
        str = "有概率钓到橙色及以下鱼类";
    } else if (grade > 10) {
        str = "有概率钓到紫色及以下鱼类";
    } else if (grade > 1) {
        str = "有概率钓到黄色及以下鱼类";
    } else {
        str = "有概率钓到蓝色及以下鱼类";
    }
    me.send(`你正在钓鱼，当前效率${grade}，每10秒获得${exp}经验，${pot}潜能，${str}。`);
}
function calculate_lv(grade) {
    // 权重基准(×10取整)

    // 根据grade启用对应品质上限（无红色档）
    let maxTier;
    if (grade > 30) maxTier = 5;      // 橙色
    else if (grade > 10) maxTier = 4; // 紫色
    else if (grade > 1) maxTier = 3;  // 黄色
    else maxTier = 2;                 // 蓝色

    const tiers = ['white', 'green', 'blue', 'yellow', 'purple', 'orange'];
    const weights = [7000, 2000, 500, 100, 20, 10]
    const ranges = [[0, 2], [3, 5], [6, 8], [9, 11], [12, 14], [15, 17]];

    // grade略微提升高品质概率：每一档高于白色的品质权重随grade和档位递增
    let total = 0;
    let ranges_cumulative = [];
    const cumulative = [];
    for (let i = 0; i <= maxTier; i++) {
        let w = weights[i];
        if (i >= 1) {
            w = Math.floor(w * (1 + grade * i / 1200));
        }
        total += w;
        ranges_cumulative.push(ranges[i]);
        cumulative.push(total);
    }

    const [lo, hi] = UTIL.weightedChoice(ranges_cumulative, cumulative);
    return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function do_diaoyu(me) {
    let r_i = me.random(100);
    if (r_i > 89) {
        let er = this.yuer;
        let grade = me.query_prop('diaoyu1') + er.grade * 5;
        let lv = calculate_lv(grade);
        let obj = me.add_obj('res/yu#' + lv);
        if (obj)
            me.send_room("<hig>$N钓到一条" + obj.color_name + "。</hig>");
        if (er.count > 1) {
            me.remove_obj(er, 1);
        } else {
            me.remove_obj(er);
            er = query_er(me);
            if (!er) {
                me.send_room("$N没有鱼饵了，无法继续钓鱼。");
                me.set_state(null);
            } else {
                this.yuer = er;
            }
        }
    }
    var exp = WORLD.DATA.get_exp(me)
        + WORLD.DATA.query_temp("diaoyu_exp", 0);
    var pot = exp + me.query_prop('lsj_qn');
    me.add_exp(exp, pot, 0);
}

function query_er(me) {
    for (var i = 0; i < me.items.length; i++) {
        if (me.items[i].path.startsWith("sp/tool/er#")) {
            return me.items[i];
        }
    }
}