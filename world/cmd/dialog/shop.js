import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const OBJ = globalThis.OBJ; const UTIL = globalThis.UTIL;
this.inherits(COMMAND);
this.command = "shop";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /(?:(\w+)\s+(\d+))/;
this.enter = function (me, par, count) {
    if (me.query_temp("new")) return me.notify("你先完成新手指导再说。");
    if (!me.is_player) return me.notify("你不能购买。");

    if (!this.list)
        this.load_selllist();

    if (count != undefined) {
        var item = this.list.get(par);
        if (!item) return me.notify("商店不出售这个东西。");
        if (item.is_show && item.is_show(me) === false) return me.notify("商店不出售这个东西。");

        count = parseInt(count);
        if (!(count > 0)) return;
        if (item.limit > 0 && me.query_temp(item.limit_key, 0) + count > item.limit) {

            return me.notify(item.name + "到达" + (item.limit_time < 3 ?
                ["本日", '本周', '本月'][item.limit_time] : "") + "购买上限。");
        }

        if (item.max > 0 && me.query_temp(item.max_key, 0) + count > item.max) {
            return me.notify("没有这么多的" + item.name + "出售了。");
        }
        if (item.on_buy && item.on_buy(me, count) === false) return;
        let discount = 1;
        if (item.query_discount) discount = item.query_discount(me);
        else discount = item.discount ?? 1;
        let need_money = 0;
        if (item.mtype === 0) {
            need_money = item.value * count * 10000;
            if (discount < 1) need_money = need_money * discount;
            need_money = parseInt(need_money);
            if (!(me.money >= need_money)) {
                return me.notify("你没有那么多的银两。");
            }
            me.add_money(-need_money, "购买" + item.name + "");
        } else if (item.mtype === 1) {
            need_money = item.value * count;

            if (discount < 1) need_money = need_money * discount;
            need_money = parseInt(need_money);
            if (!(me.cash_money >= need_money)) {
                return me.notify("你没有那么多的元宝。");
            }
            me.add_cash(-need_money, "购买" + item.name + "");
        } else {
            need_money = item.value * count;
            if (discount < 1) need_money = need_money * discount;
            need_money = parseInt(need_money);
            if (!(me.query_temp('my', 0) >= need_money))
                return me.notify("你没有那么多的古币。");
            me.add_temp('my', -need_money);
        }
        var obj = me.add_obj(item.path, count);
        me.notify("你从商店里购买了" + obj.unit_name(count) + "。");
        if (item.limit > 0) {
            let val = 0;
            if (item.limit_time === 0) {
                val = me.add_temp(item.limit_key, count, UTIL.diff_time());
            } else if (item.limit_time === 1) {
                val = me.add_temp(item.limit_key, count, UTIL.diff_week_time());
            } else if (item.limit_time === 2) {
                val = me.add_temp(item.limit_key, count, UTIL.diff_month_time());
            } else if (item.limit_time > 10000) {
                val = me.add_temp(item.limit_key, count, item.limit_time);
            }
            // me.send(`{"type":"dialog","dialog":"shop",item:["${item.id}",${val}],money:[${me.money},${me.cash_money}]}`);
            for (let x of this.list_keys) {
                if (x.limit_key === item.limit_key) {
                    me.send(`{"type":"dialog","dialog":"shop",item:["${x.id}",${Math.min(val, x.limit)}],${format_moneys(me)}}`);
                }
            }
        } else {
            me.send(`{"type":"dialog","dialog":"shop",${format_moneys(me)}}`);
        }
        if (item.max > 0) {
            let val = me.add_temp(item.max_key, count);
            if (val >= item.max) {
                me.send(`{"type":"dialog","dialog":"shop",remove:"${item.id}"}`);
                item.on_full && item.on_full(me);
            }
        }


        if (item.mtype === 1 && item.rcash) {
            me.add_money(need_money * 10000);
            me.notify('你获得' + need_money + '两<hiy>黄金</hiy>。');

        }
        WORLD.add_recover_obj(me, {
            name: obj.unit_name(count),
            count: count,
            value: need_money,
            limit_key: item.limit > 0 ? item.limit_key : null,
            max_key: item.max_key,
            id: obj.id,
            rcash: item.rcash,
            path: obj.path
        }, 12, item.mtype);
        return;
    }
    if (par && par === this.idx)
        return me.send(`{"type":"dialog","dialog":"shop",${format_moneys(me)}}`);

    var str = ['{"type":"dialog","dialog":"shop","selllist":['];
    for (let i = 0; i < this.groups.length; i++) {
        if (i > 0) str.push(',[');
        else str.push('[');
        for (let item of this.groups[i]) {
            if (item.is_show && item.is_show(me) === false) continue;
            str.push('["', item.id, '","', item.name, '","', item.desc, '"');
            str.push(',', item.value, ',', item.grade, ',');
            if (item.query_discount) str.push(item.query_discount(me));
            else str.push(item.discount ?? 1);
            if (item.limit > 0)
                str.push(',', item.limit, ',', me.query_temp(item.limit_key, 0), '');
            else if (item.max > 0)
                str.push(',', item.max, ',', me.query_temp(item.max_key, 0), '');
            str.push('],');
        }
        str.push('0]');
    }
    str.push('],', format_moneys(me));
    str.push(`,idx:"`, this.idx, `"}`);


    me.send(str.join(""));
}
function format_moneys(me) {
    return `money:[${me.money},${me.cash_money}]`;
    //  return `money:[${me.money},${me.cash_money},${me.query_temp('my', 0)}],mtype:"枚<hij>古币</hij>"`;
}


this.list = null;

this.list_keys = null;
this.idx = null;
this.load_selllist = function () {
    this.list = new Map();
    this.list_keys = [];
    this.idx = UTIL.create_id();
    for (let i = 0; i < this.groups.length; i++) {
        for (let item of this.groups[i]) {
            item.mtype = i;
            let obj = OBJ.CREATE(item.path);
            if (!obj) continue;
            item.name = obj.name;
            item.unit = obj.unit;
            item.grade = obj.grade;
            item.id = Object.getPrototypeOf(obj).id + i.toString();

            this.list.set(item.id, item);
            if (item.limit_key) {
                this.list_keys.push(item);
            }
        }
    }
}
//去掉元宝，每周兑换，按月领取，黄金频率降低

function query_age_discount(me) {
    var dt = Date.now() - me.reg_time * 60000;
    let age = Math.floor(dt / 86400000 / 12);
    if (age < 1) age = 1;
    else if (age > 10) age = 10;
    return age / 10;
}
const start_date = new Date(2026, 1, 15, 0, 0);
const end_date = new Date(2026, 1, 24, 0, 0);

this.groups = [
    [
        {
            name: "<hic>扫荡符</hic>", unit: "张", path: "cash/saodang", grade: 2,
            desc: "可以快速完成副本，前提是这个副本你已经解锁相关单人难度的扫荡模式", value: 1,
            discount: 0.5,
            query_discount: query_age_discount,
            limit: 50, limit_time: 0, limit_key: "shp1"
        },
        {
            name: "<hic>天师符</hic>", unit: "张", grade: 3,
            path: "cash/tianshifu", desc: "可使你原地复活，不用跑路", value: 5,
            query_discount: query_age_discount,
            limit: 10, limit_time: 0, limit_key: "shp2"
        },
        {
            name: "<hig>背包扩充</hig>", unit: "块", grade: 1,
            path: "cash/pack_add", desc: "使你的背包扩充10格，最大100格", value: 128,
            limit: 1, limit_time: 1, limit_key: "shp3"
        },
        {
            name: "<hig>仓库扩充</hig>", unit: "块", grade: 1,
            path: "cash/ck_add", desc: "使你的仓库扩充10格，最大400格", value: 168,
            limit: 1, limit_time: 1, limit_key: "shp4"
        },
        {
            name: "<hiy>洗髓丹</hiy>", unit: "颗", grade: 3,
            path: "cash/xi", desc: "重置你的先天属性", value: 128,
            limit: 5, limit_time: 1, limit_key: "shp5"
        },
        {
            name: "<hic>改名符</hic>", unit: "张", grade: 2,
            path: "cash/gaiming", limit: 1, limit_time: 2, limit_key: "shp9",
            desc: "更改你的名字", value: 200
        },
        {
            name: "<hio>叛师符</hio>", unit: "张", grade: 5,
            path: "cash/tuoli", value: 500,
            desc: "重新选择你的门派，会遗忘你当前门派的武功，返还你消耗的潜能(不包括100级前的消耗)",
            limit: 3, limit_time: 2, limit_key: "shp6"
        },
        {
            name: "<hio>变性丹</hio>", unit: "颗", grade: 5, value: 500,
            path: "cash/bian", desc: "更改性别，会遗忘不符合性别要求的武功，返还你消耗的潜能(不包括100级前的消耗)",
            limit: 3, limit_time: 2, limit_key: "shp7",
        }

    ]
    , [
        {
            name: "<hic>扫荡符</hic>", unit: "张", path: "cash/saodang", grade: 2,
            desc: "可以快速完成副本，前提是这个副本你已经解锁相关单人难度的扫荡模式", value: 1
        },
        {
            name: "<hic>天师符</hic>", unit: "张", grade: 3,
            path: "cash/tianshifu", desc: "可使你原地复活，不用跑路", value: 5
        },
        {
            name: "<hig>背包扩充</hig>", unit: "块", grade: 1,
            path: "cash/pack_add", desc: "使你的背包扩充10格，最大100格", value: 32
        },
        {
            name: "<hig>仓库扩充</hig>", unit: "块", grade: 1,
            path: "cash/ck_add", desc: "使你的仓库扩充10格，最大400格", value: 40
        },
        {
            name: "<hiy>洗髓丹</hiy>", unit: "颗", grade: 3,
            path: "cash/xi", desc: "重置你的先天属性", value: 80
        },
        {
            name: "<hic>改名符</hic>", unit: "张", grade: 2,
            path: "cash/gaiming", desc: "更改你的名字", value: 98
        },
        {
            name: "<hio>叛师符</hio>", unit: "张", grade: 5,
            path: "cash/tuoli",
            desc: "重新选择你的门派，会遗忘你当前门派的武功，返还你消耗的潜能(不包括100级前的消耗)",
            value: 300
        },
        {
            name: "<hio>变性丹</hio>", unit: "颗", grade: 5,
            path: "cash/bian", desc: "更改性别，会遗忘不符合性别要求的武功，返还你消耗的潜能(不包括100级前的消耗)",
            value: 300
        },
        {
            name: "房契", unit: "颗", grade: 3,
            path: "cash/fang", desc: "使用后获得扬州城豪华型住宅，拥有自己的练功房，钓鱼采药的小花园，和管家黄金购买的房子无区别。",
            value: 998, max_key: "shpm1", max: 1,
            is_show: function (me) {
                if (me.query_temp('home', 0) === 2) return false;
                if (me.query_bool('gift', 1)) return false;
                return true;
            },
            on_full: function (me) {
                me.remove_temp('shpm1');
                me.set_bool('gift', 1, true);//gift标志0随从包 1房契 2程灵素
            }
        }
    ]

];
}
