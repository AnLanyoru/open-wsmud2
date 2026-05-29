import { USERTASK } from "../../os/task/playertask.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(USERTASK);
this.id = "growup";
this.sort = 1;
this.query_title = function (player) {
    var stas = player.query_temp("grow_lv", 0);
    return "<hic>" + temps[stas].title + "</hic>";
}
this.query_desc = function (player) {
    var stas = player.query_temp("grow_lv", 0);
    return temps[stas].desc;
}
this.query_state = function (player) {
    if (!WORLD.is_server(player)) return 0;
    var stas = player.query_temp("grow_lv", 0);
    if (stas >= temps.length) return 0;
    return temps[stas].check(player);
}

this.on_finish = function (player) {
    if (!WORLD.is_server(player)) return player.notify("你无法完成。");
    var stas = player.query_temp("grow_lv", 0);
    if (stas >= temps.length) return;
    var st = temps[stas].check(player);
    if (st == 1) return player.notify("你还没完成这个任务。");
    temps[stas].finish(player);
    player.set_temp("grow_lv", stas + 1);
    return true;
}
const temps = [
    {
        title: "学会任意一个技能",
        desc: "通过秘籍或拜师学会一项技能，奖励：1000经验，1000潜能，<wht>铁剑</wht>\n<mem>可以通过去江湖-门派拜师，当铺购买秘籍，副本掉落武功秘籍等方式学习。</mem>",
        check: function (player) {
            if (!player.skills) return 1;
            for (var item in player.skills) {
                if (item != "force" || item != "unarmed") {
                    return 2;
                }

            }
            return 1;
        },
        finish: function (player) {
            player.add_exp(1000, 1000);
            var obj = player.add_obj("eq/lv0/jian");
            if (obj) {
                player.notify("你获得了" + obj.unit_name() + "。");
            }
        }
    }
    , {
        title: "完成一次副本",
        desc: "奖励：2000经验，10000潜能，一颗<hiy>养精丹</hiy>\n<mem>点击江湖-副本，尝试完成第一个副本。</mem>",
        check: function (player) {
            if (player.query_temp("fb_count") > 0) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(2000, 10000);
            var obj = player.add_obj("cash/jing#2", 3);
            if (obj) {
                player.notify("你获得了" + obj.unit_name(1) + "。");
            }
        }
    }, {
        title: "参与一种挂机工作",
        desc: "奖励：3000经验，10000潜能，<hig>背包扩充石</hig>\n<mem>扬州城的西门挖矿，东门采药，北门钓鱼，南门工作，开始任意一种工作后点击完成。</mem>",
        check: function (player) {
            if (player.state && player.state.type === 'work') return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(3000, 10000);
            var obj = player.add_obj("cash/pack_add");
            if (obj) {
                player.notify("你获得了" + obj.unit_name(1) + "。");
            }
        }
    },
    {
        title: "成长为<wht>武士</wht>",
        desc: "奖励：10000经验，10000潜能，三张<hic>天师符</hic>\n<mem>去扬州城广场寻找金古易提升你的境界。</mem>",
        check: function (player) {
            if (player.level > 0) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(10000, 10000);
            var obj = player.add_obj("cash/tianshifu", 3);
            if (obj) {
                player.notify("你获得了三张" + obj.color_name + "。");
            }
        }
    },
    {
        title: "找份兼职",
        desc: "去扬州城的衙门找份追捕工作，每日可以获得大量报酬，\n奖励：10000经验，10000潜能，奖励：80块<hig>玄晶</hig>",
        check: function (player) {
            if (player.query_temp('ym_level', 0) > 0) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(10000, 10000);
            var obj = player.add_obj('st/xuanjing', 80);
            if (obj) {
                player.notify("你获得了" + obj.unit_name(80) + "。");
            }
        }
    },
    {
        title: "武道塔试炼",
        desc: "进入武道塔试炼，并战胜第九层守护者\n奖励：20000经验，20000潜能，十张<hic>扫荡符</hic>\n<mem>点击江湖-武道塔进入挑战。</mem>",
        check: function (player) {
            if (player.query_temp('wd_level', 0) > 8) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(20000, 20000);
            var obj = player.add_obj("cash/saodang", 10);
            if (obj) {
                player.notify("你获得了" + obj.unit_name(10) + "。");
            }
        }
    }, {
        title: "成长为<hig>武师</hig>",
        desc: "奖励：10000经验，10000潜能，五张<hiy>天师符</hiy>",
        check: function (player) {
            if (player.level > 1) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(10000, 10000);
            var obj = player.add_obj("cash/tianshifu", 5);
            if (obj) {
                player.notify("你获得了" + obj.unit_name(5) + "。");
            }
        }
    }, {
        title: "参加襄阳守卫战",
        desc: "参加一次襄阳守卫战，并最少获得100的军功\n奖励：50000经验，50000潜能>",
        check: function (player) {
            if (player.query_temp('jg_week', 0) >= 100) {
                return 2;
            }

            return 1;
        },
        finish: function (player) {
            player.add_exp(50000, 50000);
        }
    }, {
        title: "成长为<hiy>宗师</hiy>",
        desc: "成长为<hiy>宗师</hiy>\n奖励：100000经验，100000潜能，一颗<hiy>洗髓丹</hiy>",
        check: function (player) {
            if (player.level > 2) return 2;
            return 1;
        },
        finish: function (player) {
            player.add_exp(100000, 100000);
            var obj = player.add_obj("cash/xi", 1);
            if (obj) {
                player.notify("你获得了" + obj.unit_name(1) + "。");
            }
        }
    }

];
}
