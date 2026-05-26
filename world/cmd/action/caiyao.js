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

function do_cai(me) {
    let lv = me.random(18);
    let obj = me.add_obj('res/cao#' + lv);
    if (obj) {
        me.send_room("<hig>$N采到一株" + obj.color_name + "。</hig>");
    }
    let exp = WORLD.DATA.get_exp(me)
        + WORLD.DATA.query_temp("caiyao_exp", 0);
    let pot = exp + me.query_prop('ly_qn');
    me.add_exp(exp, pot, 0);
}