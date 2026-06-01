import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { FAMILIES } from "../../core/skill/family.js";
import { COMMAND } from "../../core/command.js";

export default class extends TASK {
    id = "top";
    prev_time = 0;
    time_handler: any = null;

    startup() {
    var dt = new Date();
    var hour = dt.getHours();
    var day = dt.getDate();
    if (hour >= 20) day = day + 1;
    dt = new Date(dt.getFullYear(), dt.getMonth(), day, 20);
    var diff_time = +dt - Date.now();
    this.time_handler = this.call_out(this.run.bind(this), diff_time);
}
    stop() {
    clearTimeout(this.time_handler);
}
    run() {
    this.startup();
    var diff = Date.now() - this.prev_time;
    if (diff < 600000) return;
    this.send_score();
    this.send_tops();
    this.send_weapons();
    this.send_family();
    COMMAND.DO("sys", "排行榜奖励发放完毕，进入社交系统消息中收取。");
    this.prev_time = Date.now();
}
    send_score() {
    let data = WORLD.STATS.SC_STATS;
    for (let key of FAMS_TATAS) {
        let stats = data[key];
        if (!stats) continue;
        let topname = FAMILIES[key].name + "综合榜";
        for (var i = 0; i < stats.length; i++) {
            var user = stats[i];
            if (i > 19) break;
            if (!user.id) continue;
            (COMMAND.DO as any)("send", user.id, {
                from: "score",
                from_name: "综合榜奖励",
                content: "你目前在" + topname + "单排名第" +
                    (i + 1) + "，以下是你的每日奖励，请再接再厉继续保持。",
                attach: [
                    (WORLD.COMMANDS.reward as any).score_reward(i)
                ]
            });
        }
    }
}
    send_tops() {
    for (let key of FAMS_TATAS) {
        let tops = WORLD.STATS['tops_' + key];
        if (!tops) continue;
        let topname = FAMILIES[key].name + "高手榜";
        for (let i = 0; i < tops.length; i++) {
            let user = tops[i];
            if (!user.userid) continue;
            (COMMAND.DO as any)("send", user.userid, {
                from: "top",
                from_name: "高手榜奖励",
                content: "你目前在" + topname + "排名第" + (i + 1) + "，以下是你的每日奖励，请再接再厉继续保持。",
                attach: [
                    (WORLD.COMMANDS.reward as any).top_reward(i)
                ]
            });
        }
    }
}
    send_weapons() {
    const map = {};
    let eqs = WORLD.STATS.EQ_STATS ?? [];
    for (let stats of eqs) {
        for (let i = 0; i < stats.length; i++) {
            let item = stats[i];
            if (i > 9) break;
            if (!item.user) continue;
            let max_count = map[item.user] ?? 0;
            if (max_count >= 200) continue;
            let count = (50 + (10 - i) * 5);
            max_count += count;
            if (max_count > 200) {
                count = count - (max_count - 200);
                max_count = 200;
            }
            map[item.user] = max_count;

            (COMMAND.DO as any)("send", item.user, {
                from: "weapon",
                from_name: "兵器谱奖励",
                content: "你的" + item.wname + "在兵器谱排名第" + (i + 1) + "，以下是你的每日奖励，请再接再厉继续保持。",
                attach: [
                    {
                        obj: "st/xuanjing",
                        count: count
                    }
                ]
            });
        }
    }
}
    send_family() {

    for (var name in FAMILIES) {
        var fam = FAMILIES[name];
        this.sort_family(fam);
    }
}
    sort_family(fam) {
    var list: any = [];
    var user: any = null;
    if (fam.tops) {
        var max = 0;
        for (var key in fam.tops) {
            var item = fam.tops[key];
            if (item.score > max) {
                max = item.score;
                list.length = 0;
                list.push({ name: item.name, id: key });
            } else if (item.score == max) {
                list.push({ name: item.name, id: key });
            }
        }

        if (!list.length) return;
        if (list.length == 1) user = list[0];
        else {
            var last_time = Number.MAX_VALUE;
            for (var i = 0; i < list.length; i++) {
                var item: any = WORLD.getUser(list[i].id);
                var time = item ? item.query_temp('last_sm', 1) : Date.now();

                if (time < last_time) {
                    user = list[i];
                    last_time = time;
                }
            }
        }
    } else {
        if (fam !== FAMILIES.NONE) return;
        for (let user of WORLD.USERS) {
            if (user.family === FAMILIES.NONE && user.query_temp('wg_sr', 0)
                && user.query_temp('sr', 0)) {
                list.push(user);
            }
        }
        if (!list.length) return;
        user = list.random();
    }


    fam.set_dadizi(user.id, user.name);


    (COMMAND.DO as any)("send", user.id, {
        from: "fam",
        from_name: "门派奖励",
        content: "恭喜你成为" + fam.name + "的" + fam.top_name + "。",
        attach: [
            {
                obj: "sp/dizi#" + fam.id,
                count: 1
            }
        ]
    });
    user = WORLD.getUser(user.id);
    if (user) {
        user.set_temp('last_sm', Date.now());
    }
}
}

const FAMS_TATAS = ['WUDANG', 'HUASHAN', 'SHAOLIN',
    'EMEI', 'GAIBANG', 'XIAOYAO', 'SHASHOU', 'NONE'];
