import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "info";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    enter(me, tid) {
    let str = [];
    let notifier = me;
    if (tid) {
        if (me.user_level > 0) {
            me = WORLD.getUser(tid);
            if (!me)
                return notifier.send('没有这个角色。');
        }
    }

    str.push(me.color_name, '\n');

    str.push('武道塔进度', me.query_temp('wd_level', 0), '层，已累积', this.query_wdcount(me), '份奖励\n');

    str.push('武道残页总量', me.query_temp('wds', 0), '\n');
    str.push('门派职位等级', me.family.query_task_title(me),
        '，已累积', this.query_smcount(me), '份师门物资\n');
    str.push('衙门职位等级', YMTITLES[me.query_temp('ym_level', 0)],
        '，已累积', this.query_ymcount(me), '份奖励\n');

    str.push('今日副本次数', me.query_temp('fb_count_day', 0), '/20', '\n');
    str.push('BOSS挑战', me.query_temp('bcc', 0), '/5', '\n');
    if (me.query_temp('qingan')) {
        str.push('已经门派请安', '\n');
    } else {
        str.push('尚未请安', '\n');
    }
    if (me.level < 5 && me.level > 2) {

        str.push('获取圣元碎片', me.query_temp('mpz', 0), '/1\n');
    }
    if (me.level > 3)
        str.push('获取帝魄碎片', me.query_temp('mpcd', 0), '/1\n');

    str.push('获取额外', me.query_temp('sssc', 0), '/', 500 + me.query_prop('shashou'), '师门功绩\n');
    str.push('本周已经获取襄阳军功', me.query_temp('jg_week', 0), '/', JUNGONG_LIMITS[me.level], '\n');

    str.push('已领取', me.query_temp('xy_hd', 0) * REWARDS_LIMIT[me.level], '/', REWARDS_LIMIT[me.level] * 5, '奖励军功\n');
    notifier.send(str.join(""));
}
    query_wdcount(me) {
    let tm = me.query_temp("wd_tm", 0);
    if (!tm) return 0;
    tm = Math.floor((Date.now() - tm * 100000) / 3600000 / 24);
    return Math.min(tm, 7);
}
    query_smcount(me) {
    let sm = me.query_temp("sm_tm", 0);
    if (!sm) return -1;
    sm = Math.floor((Date.now() - sm * 100000) / 3600000);
    return Math.min(sm, 60);
}
    query_ymcount(me) {
    let sm = me.query_temp("ym_tm", 0);
    if (!sm) return 0;
    sm = Math.floor((Date.now() - sm * 100000) / 3600000);
    return Math.min(sm, 60);
}
}

const WORLD = globalThis.WORLD;
const REWARDS_LIMIT = [0, 10, 20, 30, 40, 50, 60];
const JUNGONG_LIMITS = [10, 50, 100, 200, 300, 400, 500];
const YMTITLES = ['', '衙役', '捕快', '捕头', '总捕头', '巡检 ', '神捕'];
