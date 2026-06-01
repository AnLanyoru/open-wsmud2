import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "蒙古骑枪";
    id = "mengguqiangfa";
    grade = 3;
    dodge_actions = [
    "$n右脚轻轻一点跃开躲过了$N的攻击。",
    "$n向旁边扑出，顺势一滚，闪到一边。",
    "$n斜里冲前一步，身法诡异，$N这一招落到空处。",
    "$n忽然直身飞入半空，很久也不见人影，半响后竟闪到了$N的背后。",
    "$n突然一个急转身，$N的这一招滑到了一边。",
];
    attack_actions = [
    "$N斜里冲前一步，身法诡异，手中$w横扫$n的$l",
    "$N忽然直身飞入半空，很久也不见人影，$n正搜寻间，$N已飞身扑下，$w攻向$n的$l",
    "$N原地一个后滚翻，却在落地的一刹那，身体向$n平飞过去，手中$w指向$n的$l",
    "$N突然一个急转身，$w横扫一圈后挟着猛烈的劲道打向$n的$l",
    "$N向前扑出，顺势一滚，接着翻身跳起，手里$w斜向上击向$n的$l",
    "$N手中$w上下翻飞，舞成了一团枪花，这枪花绕$n游走三圈后指向$n的$l"

];
    desc = "蒙古士兵使用的枪法";
    can_enables = ["club", "parry"];
    learn_condition = {
    max_mp: 5000,
    skill: {
        club: 500
    }
};
    slots = [
    {
        prop: "mgqq_cc",
        value: lv => 1,
        format: (val) => {
            return "连刺次数+1";
        }
    }, {
        prop: "mgqq_mz",
        value: lv => 50,
        format: (val) => {
            return "回马枪触发的连刺命中增加" + val + "%";
        }
    }
];
    pfm_set = {
    lian:
    {
        name: "连刺",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {
            var p = 1 + parseInt(lv / 100);
            if (p > 7) p = 7;
            p += me.query_prop('mgqq_cc');
            me.send_room("<hiy>$N身形一转，手中$W抖的笔直，快速向$n刺去</hiy>\n", target);
            for (var i = 0; i < p; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var p = 1 + parseInt(lv / 100);
            if (p > 7) p = 7;
            return "对敌人快速攻击" + p + "次";
        }
    }, hui:
    {
        name: "回马枪",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {

            var per = 150 + parseInt(lv / 20);
            if (me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz * per / 100,
                attack_msg: "<hir>$N突然反身疾退，$n正疑惑发愣间，却见$N骤然转身，施展出「<red>回马枪</red>」刺向傻不楞登的$n</hir>"
            })) {
                var p = 1 + parseInt(lv / 100);
                if (p > 7) p = 7;
                p += me.query_prop('mgqq_cc');
                let mz = me.mz + me.mz * me.query_prop('mgqq_mz') / 100;
                me.send_room("<hiy>紧跟着$N身形一转，手中$W抖的笔直，快速向$n刺去</hiy>\n", target);
                for (var i = 0; i < p; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: mz,
                        attack_before: "紧跟着"
                    });
                }
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 50 + parseInt(lv / 50);
            return "攻击出其不意，增加你" + per + "的命中，对敌人快速攻击，如果命中则触发连刺。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: parseInt(lv * 1.5) + 5,
            mz: parseInt(lv * 1.5) + 5
        },
        parry: {
            zj: parseInt(lv * 1.5) + 5,
            fy: parseInt(lv * 1.5) + 5
        }
    };
}
}
