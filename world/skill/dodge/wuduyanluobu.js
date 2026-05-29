import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "五毒烟萝步";
    id = "wuduyanluobu";
    grade = 3;
    dodge_actions = [
    "$n不慌不忙，一式「江水横流」，身行倏的向一旁平移数尺,堪堪躲过了$N的功势。",
    "$n身行如鬼魅般一晃，刹那间已远去数丈之外，$N顿时扑了个空。",
    "$n身行忽的加快，如一缕青烟般绕着$N飞快旋转，看得$N一阵头晕眼花，急忙收招跳开。",
    "只见$n身子向后一翻，一招「缥渺孤鸿影」，后荡而起，掠向一旁。",
    "$n怪异的一笑，身行忽的变得朦胧不清，$N的凌厉招式竟然透体而过，原来竟是一具幻影。",
    "$n的身行顿时变得如蛇一般柔软，随着$N的招式左右摆动，竟使得$N招招落空。"
];
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 10000,
    skill: {
        dodge: 500
    }
};
    slots = [
    {
        prop: "wdylb_ds",
        value: lv => 100,
        format: (val) => {
            return "金蛇游身判定时的有效等级增加" + val;
        }
    }, {
        prop: "wdylb_tm",
        value: lv => 1000,
        format: (val) => {
            return "金蛇游身成功后对方的忙乱时间+1秒";
        }
    }
];
    pfm = {
    snake:
    {
        name: "金蛇游身",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        use: function (me, target, lv) {
            var time = 2000 + lv * 3;
            if (time > 10000) time = 10000;
            var msg = "<HIC>$N身行忽的一变，使出「金蛇游身」的绝技，身法越来越快。\n\n只见$N飞快的绕场游走，瞻之在前，望之在后，一时间到处都是$N的身影。</HIC>\n";

            if (me.random(lv / 2) + lv
                + me.query_prop('wdylb_ds') > target.query_skill(target.dodge_skill.id, 0)) {
                msg += "<hiy>$n不由得一阵手足无措，被$N连攻数招！\n</hiy>";
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    duration: time + me.query_prop('wdylb_tm'),
                    name: "忙乱",
                    downside: true
                }, me);
            } else {
                msg += "<hir>可是$n以静制动，紧守门户，丝毫不受$N的影响,$N自己倒累的满头大汗！\n</hir>";
            }
            me.send_room(msg, target);
        },
        query_desc: function (me, lv) {
            var time = 2000 + lv * 4;
            if (time > 10000) time = 10000;
            return "金蛇游身，如有万蛇缠身，成功后使敌人忙乱" + (time / 1000) + "秒。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.5) + 130,
            dex: parseInt(lv / 7)
        }
    };
}
}
