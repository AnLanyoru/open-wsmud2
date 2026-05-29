import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "中平枪法";
    id = "zhongpingqiang";
    grade = 3;
    attack_actions = [
    "$N双手一别，尽力前伸，使出一招「中平无敌」，手中$w平平直出，刺向$n的$l",
    "$N手中$w盘旋回转，风响阵阵，屈身下蹲，反手一招「夜叉探海」自下向$n的$l刺去",
    "$N举起$w，抖出一朵枪花，一招「灵蛇出洞」向$n分心扎去",
    "$N一招「反身拿枪」，手中$w划个小圈消去$n的后招，而后$w微抬，指向$n的$l"
];
    desc = "";
    can_enables = ["club", "parry"];
    learn_condition = {
    max_mp: 10000,
    skill: {
        club: 500
    }
};
    slots = [
    {
        prop: "zpqf_cc",
        value: lv => 10 + lv / 500,
        format: (val) => {
            return "突击命中后无视对方防御" + val + "%";
        }
    }, {
        prop: "zpqf_mz",
        value: lv => 1,
        count: 1,
        format: (val) => {
            return "回马枪刺出后无法躲闪";
        }
    }
];
    pfm = {
    lian:
    {
        name: "突击",
        distime: 10000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {
            var per = 100 + parseInt(lv / 10);
            var diff_fy = me.query_prop('zpqf_cc');
            me.do_attack({
                target: target,
                attack_msg: "<hiy>$N身形突进，手中$W犹如灵蛇出洞，快速向$n刺去</hiy>",
                gj: me.gj * per / 100,
                mz: me.mz,
                diff_fy: diff_fy
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 200 + parseInt(lv / 5);
            if (per > 500) per = 500;
            return "对敌人造成" + per + "%攻击力的伤害";
        }
    }, hui:
    {
        name: "回马枪",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {

            var per = 150 + parseInt(lv / 20);
            if (per > 200) per = 200;
            if (me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz * per / 100,
                no_dodge: me.query_prop('zpqf_mz') > 0,
                attack_msg: "<hir>$N突然反身疾退，$n正疑惑发愣间，却见$N骤然转身，施展出「<red>回马枪</red>」刺向傻不楞登的$n</hir>"
            })) {
                per = 100 + parseInt(lv / 10);
                me.do_attack({
                    target: target,
                    attack_msg: "<hiy>$N身形突进，手中$W犹如灵蛇出洞，快速向$n刺去</hiy>",
                    gj: me.gj * per / 100,
                    mz: me.mz
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 50 + parseInt(lv / 50);
            if (per > 100) per = 100;
            return "攻击出其不意，增加你" + per + "%的命中，对敌人快速攻击，如果命中则对敌人再发起一次突击。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: parseInt(lv * 1.8) + 5,
            mz: parseInt(lv * 1.7) + 5
        },
        parry: {
            zj: parseInt(lv * 1.5) + 5,
            fy: parseInt(lv * 1.5) + 5
        }
    };
}
}
