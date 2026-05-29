import { USERTASK } from "../../os/task/playertask.js";

export default function() {
    const OBJ = globalThis.OBJ;
this.inherits(USERTASK);
this.id = "sm";
this.on_create = function () {
}


const TAGS = ['hig', 'hic', 'hiy', 'hiz', 'hio', 'ord'];

const TITLES = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];
this.query_title = function (me) {
    let tag = TAGS[me.query_temp('sm_level', 0)];
    return `<${tag}>师门物资</${tag}>`;
}

this.query_desc = function (me) {
    let tm = me.query_temp("sm_tm", 0);
    if (!tm) return;

    let sm = 0;
    let mem = "";
    let max = 60;
    if (tm > 0) {
        sm = Math.floor((Date.now() - tm * 100000) / 3600000);
        if (sm <= 0) {
            sm = 0;
            let time = tm * 100000 + 3600000 - Date.now();
            if (time > 0) {
                mem = "，下次领取" + this.format_time_span(time);
            }
        } else if (sm < max) {
            let time = tm * 100000 + 3600000 * (sm + 1) - Date.now();
            if (time > 0) {
                mem = "，下次领取" + this.format_time_span(time);
            }
        } else {

            mem = "，已到上限";
            sm = Math.min(sm, 60);
        }
    }

    return `你是${me.family.query_task_title(me)}，在此期间将持续获得师门的资助，当前累计${sm}/60。<br><mem>每小时获得一份师门资源，可通过后勤管理提升师门职位${mem}</mem>`;
}
this.query_smcount = function (me) {
    let sm = me.query_temp("sm_tm", 0);
    if (!sm) return -1;
    sm = Math.floor((Date.now() - sm * 100000) / 3600000);
    return Math.min(sm, 60);
}
//0 不显示 1，进行中，2.可领取 3.已完成
this.query_state = function (me) {
    let sm = this.query_smcount(me);
    if (sm < 0) return 0;
    return sm > 0 ? 2 : 1;
}
this.format_time_span = function (time) {
    if (time > 3600000)
        return Math.floor(time / 3600000) + "小时后";
    if (time > 60000)
        return Math.floor(time / 60000) + "分钟后";
    return Math.floor(time / 1000) + "秒后";

}
const EXPS = [5000, 10000, 12500, 15000, 17500, 20000];

const GONGJI = [10, 20, 40, 60, 80, 100];
const MONEYS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];

this.on_finish = function (me) {
    let sm = this.query_smcount(me);
    if (!(sm > 0)) return false;
    let sm_level = me.query_temp('sm_level', 0);
    let gongji = GONGJI[sm_level] * sm;
    let exp = EXPS[sm_level] * sm;
    let pot = exp;
    if (me.level > 2) {
        pot = parseInt(me.exp / 1200);
        if (pot > 150000) {
            pot = 150000;
        }
        pot = pot * sm;
    }
    me.add_temp('gongji', gongji);
    if (!me.skills) me.skills = {};
    me.add_exp(exp, pot);


    var list = [];
    for (var i = 0; i < me.family.skills2.length; i++) {
        if (!me.skills[me.family.skills2[i].id]) {
            list.push(me.family.skills2[i].id);
        }
    }
    let items = [];
    let count = sm;
    while (count > 0) {
        if (count >= 10) {
            items.push({
                obj: list.length > 0 ? "book/up" :
                    "drug/limit_mp#" + Math.min(4, sm_level)
            });
            count -= 10;
        } else {
            items.push({
                obj: list.length > 0 ? "book/up" :
                    "drug/limit_mp#" + Math.min(4, sm_level),
                odds: count * 1000
            });
            count = 0;
        }
    }
    items = OBJ.create_by_odds(items);
    for (var i = 0; i < items.length; i++) {
        var item = me.add_obj(items[i]);
        if (item) {
            me.send("你获得了" + items[i].unit_name() + "。");
        }
    }

    this.set_curtm(me, sm);

    let limit = me.query_jclimit();
    let jingli = me.query_temp('ad_jl', 0);
    if (limit > jingli) {
        let ad_jl = 10 * sm;
        let add = limit - jingli;
        if (add > ad_jl) add = ad_jl;
        me.add_temp('ad_jl', add);
        me.notify('<hiy>你增加了' + add + "精力。</hiy>");
    } else {
        me.notify("<yel>你的精力已经达到上限。</yel>");
    }

    me.notify("<hic>你领取了" + sm + "份师门物资，获得" + gongji + "点师门功绩。</hic>");

    return true;
}

this.set_curtm = function (me, count) {


    let tm = me.query_temp("sm_tm", 0);

    tm = Math.max((Date.now() - 3600000 * 60) / 100000, tm);


    tm += Math.floor((count * 36));


    me.set_temp("sm_tm", tm);

}
}
