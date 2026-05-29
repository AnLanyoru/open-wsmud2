import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "北冥神功";
    id = "beimingshengong";
    grade = 3;
    force_rad = 0.75;
    family = FAMILIES.XIAOYAO;
    desc = "逍遥派镇派神功，可吸取他人内力以供己用，是迅速提升功力的捷径功法。";
    can_enables = ["force", "parry"];
    learn_condition = {
    skill: {
        force: 300
    }
};
    pfm = {
    //xi:
    //{
    //    name: "<hir>冥字诀</hir>",
    //    distime: 10000,
    //    enable_skill: "force",
    //    mp: 20,
    //    release_time: 5000,
    //    no_auto:true,
    //    use: function (me, target, lv) {

    //        var gj = Math.round(lv / 10);
    //        var mp = parseInt((gj * 120) / 100);

    //        me.send_room("<him>$N身法陡然加快，右掌直出，猛地对准$n的膻中大穴按了上去！</him>", target);
    //        if (me.max_mp >= me.limit_mp) {
    //            return me.notify("<hic>你觉得你的经脉充盈，已经没有办法再增加内力了。</hic>");
    //        }
    //        if (target.max_mp>mp&& me.mz / 2 + me.random(me.mz) > target.ds) {
    //            target.notify("<hiy>你顿觉全身内力如水银般循孔飞泄而出！\n</hiy>");
    //            me.notify("<hig>你觉得" + target.name + "的内力自手掌源源不绝地流了进来。\n</hig>", target);

    //            target.max_mp -=mp;
    //            me.max_mp += gj;
    //        } else if (target.max_mp < mp) {
    //            me.notify("<hiy>" + target.name + "已经内力涣散，你已经无法从他体内吸取任何内力了！\n</hiy>");
    //        } else {
    //            me.send_room("<hiy>可是$p看破了$P的企图，机灵地闪了开去。\n</hiy>", target);
    //        }
    //    },
    //    query_desc: function (me, lv) {
    //        var gj = Math.round(lv  / 10);
    //        return "战斗中吸取别人的" + gj + "点最大内力，此招损人利己，慎用！";
    //    }
    //},

    huifu:
    {
        name: "鲲字诀",
        distime: 30000,
        enable_skill: "force",
        mp: 0,
        release_time: 0,
        no_auto: true,
        use: function (me, target, lv) {

            var gj = lv * 5;
            me.send_room("<him>$N默运北冥神功，周身紫气环绕，转眼间已恢复活力！\n</him>", target);
            me.add_mp(gj);
        },
        query_desc: function (me, lv) {
            var gj = lv * 5;
            return "战斗中恢复自己" + gj + "点内力。";
        }
    }, power: {
        name: "凝神诀",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        no_auto: true,
        use_type: 2,
        use: function (me, target, lv) {
            if (me.query_temp('bmsg_add'))
                return me.notify('你已经附加凝神诀的效果了。');
            me.send_room("<hig>$N神凝丹田，息游紫府，周围灵气如潮水般朝$P汇聚过来。</hig>");

            var time = Math.round(lv * 100) + 60000;
            var nl = 100 + lv * 10;
            var ts = me.team || [me];
            for (var i = 0; i < ts.length; i++) {
                if (!ts[i].is_here(me)) continue;
                ts[i].add_status({
                    id: "force",
                    name: "北冥",
                    desc: "北冥神功之凝神诀，增加你的最大内力",
                    duration: time,
                    prop: {
                        desc: "增加" + nl + "最大内力"
                    }, on_attach: function (p) {
                        p.max_mp += nl;
                        p.set_temp('bmsg_add', nl);
                        p.recount();
                        p.notify_hp();
                    },
                    on_expire: function (p) {
                        p.max_mp -= nl;
                        p.remove_temp('bmsg_add', nl);
                        p.recount();
                        p.notify_hp();
                    }
                });
            }

        },
        query_desc: function (me, lv) {
            var gj = Math.round(lv * 100) + 60000;
            var nl = 100 + lv * 10;
            return "增加你和你附近队友的最大内力" + nl + "，持续" + (gj / 1000) + "秒";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            con: parseInt(lv / 6) + 2,
            dex: parseInt(lv / 7) + 2,
            limit_mp: lv * 105,
            desc: "当你命中敌人后，会吸取对方内力增加自身最大内力\n唯一：将你内力的75%转化为气血"
        }, parry: {
            zj: parseInt(lv * 1.4) + 20,
            dex: parseInt(lv / 7) + 2,
            desc: "当你招架成功后会减少敌人" + (lv + 10) + "当前内力"
        }
    };
}
    on_parry_over(me, target, par) {
    if (par.is_parry) {
        target.add_mp(-me.query_skill("beimingshengong", 0) - 10);
        //me.send_room("<hib>$n顿觉全身内力如水银般循孔飞泄而出！</hib>\n", target);
    }
}
    do_force_attack(me, target) {

    if (me.max_mp < me.limit_mp + me.query_prop("limit_mp")) {
        if (!me.query_temp("sk_beiming")) {
            me.set_temp("sk_beiming", 1, 8000);
            var gj = Math.round(me.query_skill("beimingshengong", 0) / 10);
            var mp = parseInt((gj * 120) / 100);
            if (target.max_mp > mp) {

                if (target.mp > mp) {
                    target.notify("<hir>你顿觉全身内力如水银般循孔飞泄而出！</hir>");
                    me.notify("<hir>你觉得" + target.name + "的内力自手掌源源不绝地流了进来。</hir>", target);

                    target.mp -= mp;
                    me.max_mp += gj;
                }
            }
        }
    }
    return 0;
}
}

