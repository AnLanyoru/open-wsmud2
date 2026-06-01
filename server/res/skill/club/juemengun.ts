import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "绝门棍";
    id = "juemengun";
    grade = 1;
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
    "$N手中$w上下翻飞，舞成了一团杖花，这杖花绕$n游走三圈后指向$n的$l"

];
    desc = "据说曾经是少林七十二绝技中的一种棍法，流传至今不知还有几分精髓，可以装备为棍法和轻功";
    can_enables = ["club", "dodge"];
    learn_condition = {
    max_mp: 800,
    skill: {
        club: 50
    }
};
    slots = [
    {
        prop: 'jm_mz',
        value: (lv) => lv / 50,
        format: (val) => {
            return '绝棍闷打命中增加' + val + '%';
        },
    },
    {
        prop: 'jm_sh',
        value: (lv) => lv / 50,
        format: (val) => {
            return '绝棍闷打伤害增加' + val + '%';
        },
    },
];
    pfm = {
    wu:
    {
        name: "绝棍闷打",
        distime: 10000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {
            var p = 120 + Math.round((lv / 5));
            var gj = me.gj * p / 100 + me.gj * me.query_prop('jm_sh') / 100;
            var mz = me.mz + 20 + me.mz * me.query_prop('jm_mz') / 100;

            me.do_attack({
                target: target,
                gj: gj,
                mz: mz,
                attack_msg: "<hiw>$N突然反身疾退，$n正疑惑发愣间，却见$N骤然转身，施展出「<red>绝棍闷打</red>」，左右上下挥舞游走间，漫天棍影已压向傻不楞登的$n</hiw>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var p = 120 + Math.round((lv / 5));
            return "快速混乱的闷棍，看似无章法，却使敌人难以躲闪，增加自身命中20，造成" + p + "%攻击力的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: lv + 5
        },
        dodge: {
            ds: lv + 5
        }
    };
}
}
