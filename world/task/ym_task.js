import { USERTASK } from "../../os/task/playertask.js";

export default class extends USERTASK {
    id = "yamen";

    query_title(me) {
    let tag = TAGS[me.query_temp('ym_level', 0)];
    return `<${tag}>衙门兼职</${tag}>`;
}
    query_desc(me) {
    let lv = me.query_temp("ym_level", 0);
    if (!(lv > 0)) return;

    let tm = me.query_temp("ym_tm", 0);
    let ym = 0;
    let mem = "";
    let max = 60;
    if (tm > 0) {
        ym = Math.floor((Date.now() - tm * 100000) / 3600000);
        if (ym <= 0) {
            ym = 0;
            let time = tm * 100000 + 3600000 - Date.now();
            if (time > 0) {
                mem = "，下次领取" + this.format_time_span(time);
            }
        } else if (ym < max) {
            let time = tm * 100000 + 3600000 * (ym + 1) - Date.now();
            if (time > 0) {
                mem = "，下次领取" + this.format_time_span(time);
            }
        } else {
            mem = "，已到上限";
            ym = Math.min(ym, 60);
        }
    }
    return `你帮衙门追捕逃犯，目前是${TITLES[lv]}职位，可以领取衙门发放的报酬，当前累计${ym}/60。<br><mem>每小时获得一份报酬，通过追捕更高级别的逃犯提高收益等级${mem}</mem>`;
}
    format_time_span(time) {
    if (time > 3600000)
        return Math.floor(time / 3600000) + "小时后";
    if (time > 60000)
        return Math.floor(time / 60000) + "分钟后";
    return Math.floor(time / 1000) + "秒后";

}
    query_ymcount(me) {
    let sm = me.query_temp("ym_tm", 0);
    if (!sm) return 0;
    sm = Math.floor((Date.now() - sm * 100000) / 3600000);
    return Math.min(sm, 60);
}
    query_state(me) {
    let lv = me.query_temp("ym_level", 0);
    if (!(lv > 0)) return 0;
    let sm = this.query_ymcount(me);
    return sm > 0 ? 2 : 1;
}
    on_finish(me) {
    let ym_count = this.query_ymcount(me);
    if (!(ym_count > 0)) return false;
    let ym_lv = me.query_temp("ym_level", 0);
    if (!(ym_lv > 0)) return false;
    let exp = EXPS[ym_lv] * ym_count;
    let pot = exp;
    if (me.level > 2) {
        pot = parseInt(me.exp / 1200);
        if (pot > 150000) {
            pot = 150000;
        }
        pot = pot * ym_count;
    }
    me.add_exp(exp, pot);

    this.set_curtm(me, ym_count);

    let obj_count = STONES[ym_lv] * ym_count;

    let obj = me.add_obj("st/xuanjing", obj_count);
    if (obj) {
        me.send("你获得了" + obj.unit_name(obj_count) + "。");
    }
    obj_count = ym_count * ym_lv;
    while (obj_count > 0) {
        let count = this.random(obj_count);
        if (count < 1) count = 1;
        obj = me.add_obj(STONES_PATHS.random(), count);
        obj_count -= count;
        me.send("你获得了" + obj.unit_name(count) + "。");
    }
    me.send('<hic>你领取了' + ym_count + '份衙门发放的报酬。</hic>');

    let time = Date.now();
    if (time > WORLD.DATA.act_stime) {
        let stime = time - ym_count * 3600000;
        if (stime < WORLD.DATA.act_stime) stime = WORLD.DATA.act_stime;
        if (time > WORLD.DATA.act_etime) time = WORLD.DATA.act_etime;

        let count = Math.floor((time - stime) / 3600000);
        count = count * Math.max(me.query_temp('ym_level', 0) - 1, 1);
        if (count > 0) {
            let cjjf = me.add_temp('my', count);
            me.notify('<hiy>你获得' + count + "枚古币，当前总计" + cjjf + "。</hiy>");
        }
    }

    return true;
}
    set_curtm(me, count) {


    let tm = me.query_temp("ym_tm", 0);

    tm = Math.max((Date.now() - 3600000 * 60) / 100000, tm);


    tm += Math.floor((count * 36));


    me.set_temp("ym_tm", tm);

}
}

const WORLD = globalThis.WORLD;
const TAGS = ['wht', 'hig', 'hic', 'hiy', 'hiz', 'hio', 'ord'];
const TITLES = ['', '衙役', '捕快', '捕头', '总捕头', '巡检', '神捕'];
const EXPS = [0, 5000, 8000, 12000, 16000, 20000, 25000];
const STONES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 60, 70, 80, 90];
const STONES_PATHS = ["st/st_blu#0", "st/st_gre#0", "st/st_red#0", "st/st_yel#0"];
