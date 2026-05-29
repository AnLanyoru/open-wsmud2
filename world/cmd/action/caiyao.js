this.inherits(COMMAND);
this.command = "caiyao";

this.enter = function (me) {
    if (!me.environment) return false;
    if (!me.environment.can_caiyao)
        return me.notify('这里不能采药、');
    let name = "药林";
    if (me.environment.is('home/huayuan'))
        name = '花圃';
    me.send_room("$N走进" + name + "，开始认真寻找药材。");
    me.set_state({
        id: "cai",
        type: "work",
        title: "采药",
        player: me,
        attach_level: 0,
        rate: 2,
        on_enter: do_cai,
        stime: Date.now(),
        on_check: on_check,
        no_move: "你还在采药，专心点比较好！",
        desc: '["你仔细盯着树底下，石缝下面，一颗小草也不放过。","你找到一株奇怪的药草，努力辨别它的品种。","你爬到树上仔细寻找有没有需要的药材。"]',
    });
}

function on_check(me) {
    var exp = WORLD.DATA.exps[me.level]
        + WORLD.DATA.query_temp("caiyao_exp", 0)
        + me.query_prop('caiyao_exp');
    let grade = me.query_prop('caiyao1');

    let str = "";
    if (grade > 80) {
        str = "有概率采集到红色及以下药材";
    } else if (grade > 18) {
        str = "有概率采集到橙色及以下药材";
    } else if (grade > 10) {
        str = "有概率采集到紫色及以下药材";
    } else {
        str = "有概率采集到黄色及以下药材";
    }
    me.send(`你正在采药，当前效率${grade}，每10秒获得${exp}经验，${exp}潜能，${str}。`);
}

function calculate_lv(grade) {
    // 权重基准(×10取整，保证红色0.1权重变为1)
    const weights = {
        white: 7000,   // 0-2
        green: 2000,   // 3-5
        blue: 500,     // 6-8
        yellow: 100,   // 9-11
        purple: 20,    // 12-14
        orange: 10,    // 15-17
        red: 1         // 18-22
    };

    // 根据grade启用对应品质上限
    let maxTier;
    if (grade > 80) maxTier = 6;      // 红色
    else if (grade > 18) maxTier = 5; // 橙色
    else if (grade > 10) maxTier = 4; // 紫色
    else maxTier = 3;                 // 黄色

    const tiers = ['white', 'green', 'blue', 'yellow', 'purple', 'orange', 'red'];
    const ranges = [[0, 2], [3, 5], [6, 8], [9, 11], [12, 14], [15, 17], [18, 22]];

    // grade略微提升高品质概率：每一档高于白色的品质权重随grade和档位递增
    let total = 0;
    const cumulative = [];
    for (let i = 0; i <= maxTier; i++) {
        let w = weights[tiers[i]];
        if (i >= 1) {
            w = Math.floor(w * (1 + grade * i / 1200));
        }
        total += w;
        cumulative.push([total, i]);
    }

    const roll = Math.floor(Math.random() * total);
    for (const [threshold, idx] of cumulative) {
        if (roll < threshold) {
            const [lo, hi] = ranges[idx];
            return lo + Math.floor(Math.random() * (hi - lo + 1));
        }
    }

    return 0;
}

function do_cai(me) {
    let r_i = me.random(100);
    if (r_i > 89) {
    let grade = me.query_prop('caiyao1');
    let lv = calculate_lv(grade);
    let obj = me.add_obj('res/cao#' + lv);
    if (obj) {
        me.send_room("<hig>$N采到一株" + obj.color_name + "。</hig>");
    }}
    let exp = WORLD.DATA.get_exp(me)
        + WORLD.DATA.query_temp("caiyao_exp", 0);
    let pot = exp + me.query_prop('ly_qn');
    me.add_exp(exp, pot, 0);
}