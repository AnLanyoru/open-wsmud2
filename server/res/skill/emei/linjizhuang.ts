import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "临济十二庄";
    id = "linjizhuang";
    grade = 3;
    force_rad = 0.7;
    desc = "峨眉派内功心法";
    learn_condition = {
    max_mp: 2000,
    skill: {
        force: 200
    }
};
    pfm_set = {
    xi:
    {
        name: "鹤翔庄",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var gj = parseInt(lv / 300) + 10;
            me.notify("<hiy>你暗运龙鹤两庄，启天门，闭地户，聚精成力，顿觉气力倍增。</hiy>");
            me.add_status({
                id: "force",
                name: "鹤翔",
                on_interval: function (me) {
                    if (me.hp > 0) {
                        var hp = me.do_recover(me.max_hp * gj / 100);
                        if (hp > 0) me.notify("<hig>你恢复了" + hp + "点气血。</hig>");
                    }

                },
                duration_count: 5,
                duration: 2000
            });

        },
        query_desc: function (me, lv) {
            var gj = parseInt(lv / 300) + 10;
            return "每两秒内恢复你" + gj + "%气血，持续5次";
        }
    }, huifu:
    {
        name: "游龙庄",
        distime: 20000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            var gj = parseInt(me.gj * (lv / 5 + 100) / 100) + 2000;
            me.send_room("<hiy>$N宝相庄严，双手合十，天地间的真气如游龙般汇聚而来。</hiy>");
            var ts = me.team || [me];
            for (var i = 0; i < ts.length; i++) {
                var x = ts[i];
                if (x.hp > 0 && me.is_here(x)) {
                    gj = x.do_recover(gj);
                    if (gj > 0)
                        x.notify("<hig>你恢复了" + gj + "点气血。</hig>");
                    if (x.is_busy) {
                        x.remove_status("busy");
                        // me.reauto_attack();
                        x.send_room("<hig>梵音暮鼓，真气游龙，一时间$N心如明镜，再无杂念。\n</hig>");
                    }
                }

            }
        },
        query_desc: function (me, lv) {
            var gj = parseInt(me.gj * (lv / 5 + 100) / 100) + 2000;
            return "战斗中恢复自己和附近队友" + gj + "点气血，并消除队友的忙乱状态。";
        }
    }

    //, power: {
    //        name: "幽冥庄",
    //        distime: 300000,
    //        enable_skill: "force",
    //        mp: 20,
    //        release_time: 0,
    //        no_auto: true,
    //        use_type: 1,
    //        use: function (me, target, lv) {
    //            me.send_room("<mag>$N凝聚幽冥二气，口宣佛号: 阿弥陀佛！如鬼神之音，贯通两界！ </mag>");
    //            var items = me.environment.items;
    //            var hf = 30 + parseInt(lv / 15);
    //            if (hf > 100) hf = 100;
    //            for (var i = 0; i < items.length; i++) {
    //                if (items[i].otype == "corpse") {
    //                    var player = items[i].from;
    //                    if (player && player.hp <= 0) {
    //                        player.hp = parseInt(player.max_hp*hf/100);
    //                        player.mp = parseInt(player.max_mp * hf / 100);
    //                        player.notify('{type:"die",relive:true}');
    //                        player.moveto(me.environment, null, "<mag>" + player.name + "复活了。</mag>");
    //                        items[i].from=null;
    //                    }
    //                }
    //            }
    //        },
    //        query_desc: function (me, lv) {

    //            return "沟通幽冥之力，唤回游离在天地间的灵魂，使附近玩家复活（需剃度）。";
    //        }
    //    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 11,
            fy: lv,
            fy_per: 3 + parseInt(lv / 300),
            limit_mp: lv * 103,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}

    family = FAMILIES.EMEI;
    //"(\w+)"(.+?)"NOR"
    //<$1>$2</$1>
    can_enables = ["force"];
}

