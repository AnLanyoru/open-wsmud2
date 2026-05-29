import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(COMMAND);
this.command = "stats";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /^(\w+)(?:\s+([a-z]+))?(?:\s+(\d+))?$/;
const STATS = WORLD.STATS;
this.enter = function (me, par, fam, index) {
  
    if (!par) {
        return;
    }
    if (par === "top") {
        if (index) {

            return render_top_item(me, fam, index);
        }
        return renderTops(me, fam);
    }
    if (par === "weapon") {
        if (index) {

            return render_eq(me,fam,index);
        }
        return renderWeapons(me, fam);
    }
    if (par === "score") {

        if (index)
            return render_score_item(me,fam, index);
        return renderScore(me, fam);
    }


    if (par === "exp") {
        if (index)
            return this.render_item(me,EXP_STATS, fam, index);

        this.renderExp(me, fam);
    }
    if (par === "mp") {
        if (index)
            return this.render_item(me,MP_STATS,fam, index);
        this.renderMP(me, fam);
    }
    if (par === "money") {
        if (index)
            return this.render_item(me, MONEY_STATS, fam, index);
        this.renderMoney(me, fam);
    }
  
}

this.render_item = function (me, cache, fam, index) { 
    if (!fam) fam = "all";
    let stats = cache[fam];
    
    if (!stats|| !stats.result) return me.send('你要看什么？');
    index = parseInt(index) - 1;
    if (!(index >= 0 && index < stats.result.length))
        return  me.send('你要看什么？');
    let item = stats.result[index];
    if (!item) return me.send('没有这个人。');
    let user = WORLD.getUser(item.id);
    if (!user) return me.send(item.name + "现在不在线。");
    if (user.query_desc) {
        me.notify(user.query_desc(me, "look1"));
    }
}
function render_top_item(me, fam, index) { 
    let tops = STATS.TOPS;
    if (fam) tops = STATS['tops_' + fam.toUpperCase()] ?? [];
    let item = tops[index - 1];
    if (!item) return me.send('你要看什么？');
    return me.notify(item.query_desc(item, 'look1'));
}

function render_score_item(me, fam, index) { 
    let tops = STATS.SCORE;
    if (fam) tops = STATS.SC_STATS[fam.toUpperCase()] ?? [];
    let item = tops[index-1];
    if (!item) return me.send('你要看什么？');
    let user = WORLD.getUser(item.id);
    if (!user) return me.send('对方不在线。');
    return me.notify(user.query_desc(me));
}
function renderScore(me, fam) {
    let tops = STATS.SCORE;
    if (fam) tops = STATS.SC_STATS[fam.toUpperCase()] ?? [];

    var str = ['{"type":"dialog","dialog":"stats","scores":['];
    for (var i = 0; i < tops.length; i++) {
        if (i > 19) break;
        var item = tops[i];
        if (i > 0) str.push(",");
        str.push('["');
        str.push(item.name);
        str.push('",');
        str.push(item.score);
        str.push(']');
    }
    str.push('],score:');
    str.push(me.score);
    str.push("}");
    me.send(str.join(""));
}
// this.query_scores = function () { 
//     return SCORE_STATS;
// }
// const SCORE_STATS = {};
// function renderScore(me, fam) { 
//     let stype = fam;
//     if (!stype) stype = "all";
//     let stats = SCORE_STATS[stype];
//     if (!stats) { 
//         stats = new UserStats(
//             (me, item) => {
//                 return me.score < item.value
//             },
//             me => {
//                 return {
//                     id: me.id,
//                     value: me.score,
//                     name: me.color_name
//                 };
//             });
//         stats.type = "score";
//         stats.fam = fam;
//         SCORE_STATS[stype] = stats;
//     }
//     if (stats.isExpire()) {
//         stats.order(',score:'+me.score);
//     }
//     me.send(stats.cache);
// }
function renderTops(me, stype) {
    let tops = STATS.TOPS;
    let famid = null;
    if (stype) { 
        famid = stype.toUpperCase();
        tops = STATS["tops_" + famid];
        if (!tops) return me.send('没有这个榜单。');
    }
    var str = ['{"type":"dialog","dialog":"stats","tops":['];
    
    for (var i = 0; i < tops.length; i++) {
        var item = tops[i];
        if (i > 0) str.push(",");
        str.push('["', item.long_name(),'",',item.score,']');
    }
    if (!stype || famid === me.family.id) {
        str.push('],top:', (me.query_temp(stype ? "top_fam" : "top", 0)));
        str.push(',sc:', me.query_temp(stype ? "top_fam_sc" : "top_sc", 0));
    } else { 
        str.push('],top:0');
        str.push(',sc:0');
    }
 
    str.push(',fam:"', stype,'"');
    str.push("}");
    me.send(str.join(""));
}
function render_eq(me, type,index) { 

    if (!type) type = 'weapon';
    let eqs = STATS.EQ_STATS[EQUIP_TYPE[type.toUpperCase()]] ?? [];
    let wea = eqs[index - 1];
    me.send(wea.desc);
}
function renderWeapons(me,type) {
    var str = ['{"type":"dialog","dialog":"stats","weapons":['];
    if (!type) type = 'weapon';
    
    let eqs = STATS.EQ_STATS[EQUIP_TYPE[type.toUpperCase()]]??[];
    for (var i = 0; i < eqs.length; i++) {
        if (i > 9) break;
        var item = eqs[i];
        if (i > 0) str.push(",");
        str.push('["');
        if (item.name) {
            str.push('<wht>');
            str.push(item.name);
            str.push('的</wht>');
            str.push(item.wname);
        } else { 
            str.push('无');
        }
        str.push('",',item.score,']');
    }
    str.push(']');
    str.push("}");
    me.send(str.join(""));
}





const EXP_STATS = {};

this.renderExp = function (me, fam) {
    let stype = fam;
    if (!stype) stype = "all";
    let stats = EXP_STATS[stype];

    if (!stats) {
        stats = new UserStats(
            (me, item) => { return me.exp < item.value },
            me => {
                return {
                    id: me.id,
                    value: me.exp,
                    name: me.color_name
                };
            });
        stats.type = "exp";
        stats.fam = fam;
        EXP_STATS[stype] = stats;
    }
    if (stats.isExpire()) {
        stats.order();
    }
    me.send(stats.cache);
}
const MONEY_STATS = {};
this.renderMoney = function (me, fam) {
    let stype = fam;
    if (!stype) stype = "all";
    let stats = MONEY_STATS[stype];

    if (!stats) {
        stats = new UserStats(
            (me, item) => { return me.money < item.value },
            me => {
                return {
                    id: me.id,
                    value: me.money,
                    name: me.color_name
                };
            });
        stats.type = "money";
        stats.formatter = value => {
            if (value >= 10000) {
                return '"' + Math.floor(value / 10000) + "两黄金" + '"';
            }
            if (value > 100) {
                return '"' + Math.floor(value / 100) + "两白银" + '"';
            }
            if (value > 0) {
                return '"' + Math.floor(value / 100) + "个铜板" + '"';
            }
            return '""';
        };
        stats.fam = fam;
        MONEY_STATS[stype] = stats;
    }
    if (stats.isExpire()) {
        stats.order();
    }
    me.send(stats.cache);
}

const MP_STATS = {};
this.renderMP = function (me, fam) {
    let stype = fam;
    if (!stype) stype = "all";
    let stats = MP_STATS[stype];

    if (!stats) {
        stats = new UserStats(
            (me, item) => { return me.max_mp < item.value },
            me => {
                return {
                    id: me.id,
                    value: me.max_mp,
                    name: me.color_name
                };
            });
        stats.type = "mp";
        stats.fam = fam;
        MP_STATS[stype] = stats;
    }
    if (stats.isExpire()) {
        stats.order();
    }
    me.send(stats.cache);
}





function UserStats(order,added) {
    this.result = null;
    this.cache = null;
    this.time = 0;
    this.lessThan = order;
    this.addItem = added;
    this.maxCount = 20;
    this.type = null;
}
UserStats.prototype.formatter = function (val) {
    return val;
}
UserStats.prototype.isExpire = function () {
    return Date.now() - this.time > 0;
}
UserStats.prototype.order = function (append) {
    this.result = [];
    this.time = Date.now() + 60000;
    let fam = this.fam;
    if (fam) fam = fam.toUpperCase();
    for (let i = 0; i < WORLD.USERS.length; i++) {
        let user = WORLD.USERS[i];
        if (user.user_level > 4) continue;
        if (fam && user.family.id !== fam)
            continue;
        this.queue(user);
    }
    let str = ['{"type":"dialog","dialog":"stats","items":['];
    for (let i = 0; i < this.result.length; i++) {
        let user = this.result[i];
        if (i > 0) str.push(",");
        str.push('["', user.name, '",', this.formatter(user.value),']');
    }
    str.push(']');
    str.push(',"time":', Date.now(), '');
    str.push(',"st":"', this.type, '"', append ?? "");
    str.push(',"fam":"', this.fam,'"');
    
    str.push("}");
    this.cache= str.join("");
}
UserStats.prototype.queue = function (me) {
    let index = this.result.length - 1;
    if (index < 0) {
        this.result.push(this.addItem(me));
        return;
    }
    let user = this.result[index];
    if (this.result.length >= this.maxCount && this.lessThan(me,user)) {
        return;
    }
    while (index >= 0) {
        user = this.result[index];
        if (this.lessThan(me, user)) {
            this.result.splice(index + 1, 0, this.addItem(me));
            break;
        }
        index--;
    }
    if (index < 0) {
        this.result.splice(0, 0, this.addItem(me));
    }
    if (this.result.length >= this.maxCount) {
        this.result.length = this.maxCount;
    }
} 

//this.expStats = [];
//this.expStatsCache = null;
//this.expStatsTime = 0;

//this.maxCount = 50;
//this.orderExpBy = function (me, user) {
//    return me.exp > user.exp;
//}

//this.addExpItem = function (me) {
//    return {
//        id: me.id,
//        value: me.exp,
//        name: me.color_name
//    };
//}

//this.reStats = function (result,func) {
//    for (let i = 0; i < WORLD.USERS.length; i++) {
//        this.addToExpQueue(WORLD.USERS[i], result, func);
//    }
//    let str = [];
//    for (let i = 0; i < result.length; i++) {
//        let user = result[i];
//        str.push(i + 1, "、\t", user.name, '\t', user.value, '\r\n');
//    }
//    let time = new Date();
//    str.push("最后更新时间", time.getHours() + ":" + time.getMinutes());
//    return str.join("");
//}

//this.addToExpQueue = function (me, result, func) {
    
//    let index = result.length - 1;
//    if (index < 0) {
//        result.push(func(me));
//        return;
//    }
//    let user = result[index];
//    if (result.length >= this.maxCount && user.exp > me.exp) {
//        return;
//    }
//    while (index >= 0) {
//        user = result[index];
//        if (user.exp > me.exp) {
//            result.splice(index + 1, 0, func(me));
//            break;
//        }
//        index--;
//    }
//    if (index < 0) {
//        result.splice(0, 0, func(me));
//    }
//    if (result.length >= this.maxCount) {
//        result.length = this.maxCount;
//    }
//}
}
