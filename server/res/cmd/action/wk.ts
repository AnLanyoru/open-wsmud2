import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "wk";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me) {

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
}

function on_check(me) {
    var exp = WORLD.DATA.exps[me.level]
        + WORLD.DATA.query_temp("kuang_exp", 0);
    var pot = exp + me.query_prop('gsj_qn');
    me.send(`你正在挖矿，每10秒获得${exp}经验，${pot}潜能，有概率挖到<hig>玄晶</hig>和其他宝石。`);
}
function calculate_lv(grade) {
    const items = ["st/xuanjing", "st/st_red#0", "st/st_blu#0", "st/st_gre#0", "st/st_yel#0",
        "st/st_red#1", "st/st_blu#1", "st/st_gre#1", "st/st_yel#1"];

    // 玄晶(0):500, 绿宝石(1-4):90, 蓝宝石(5-8):1
    const base = [500, 90, 90, 90, 90, 1, 1, 1, 1];

    // grade小幅将绿宝石概率分配给蓝宝石和玄晶，玄晶分配更多(95%)
    let weights = base.slice();
    if (grade > 0) {
        const shift = grade / 200;
        for (let i = 1; i <= 4; i++) {
            let loss = base[i] * shift;
            weights[i] -= loss;
            weights[0] += loss * 0.98;
            let blueGain = loss * 0.02 / 4;
            for (let j = 5; j <= 8; j++) {
                weights[j] += blueGain;
            }
        }
    }
    return UTIL.weightedChoice(items, weights);
}
function do_diaoyu(me) {
    let r_i = me.random(100);
    if (r_i > 89) {
    let obj = me.add_obj(calculate_lv(0));
    if (obj) {
        me.notify("<hig>恭喜你得到一颗" + obj.color_name + "。</hig>");
    } else {
        me.notify("<hig>你挖了一会儿，发现一些碎石，没有挖到宝贝。</hig>");
    }
}


    var exp = WORLD.DATA.get_exp(me)
        + WORLD.DATA.query_temp("kuang_exp", 0);

    var pot = exp + me.query_prop('gsj_qn');
    me.add_exp(exp, pot, 0);

}
