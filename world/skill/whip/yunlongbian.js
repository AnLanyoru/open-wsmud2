import { SKILL } from "../../../os/skill/skill.js";

export default function() {
this.inherits(SKILL);
this.name = "云龙鞭法";
this.id = "yunlongbian";
this.grade = 1;

this.attack_actions = [
    "$N单手一扬，一招「开天辟地」，手中$w抖得笔直，对准$n当头罩下",
    "$N身形一转，一招「龙腾四海」，手中$w如矫龙般腾空一卷，猛地击向$n太阳穴",
    "$N唰的一抖长鞭，一招「矫龙出水」，手中$w抖得笔直，刺向$n双眼",
    "$N力贯鞭梢，一招「破云见日」，手中$w舞出满天鞭影，排山倒海般扫向$n全身",
    "$N运气于腕，一招「开山裂石」，手中$w象一根铜棍般直击向$n",
    "$N单臂一挥，一招「玉带围腰」，手中$w直击向$n腰肋",
    "$N高高跃起，一招「大漠孤烟」，手中$w笔直向$n当头罩下"

];
this.desc = "云龙门";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["whip"];
//this.on_learn = function (me) {
//    if (me.max_mp < 100)
//        return me.notify_fail("你的内力不够。");
//    if (me.query_skill("sword", 1) < 60)
//        return me.notify_fail("你的基础不够，无法领会更高深的技巧。");
//    if (me.query_skill("yunlongxinfa", 1) < 60)
//        return me.notify_fail("你的云龙心法等级不够，无法学习云龙剑。");
//    return true;
//}
this.learn_condition = {
    max_mp: 100,
    skill: {
        whip: 50
    }
};

this.query_enable_prop = function (lv) {
    return {
        whip: {
            gj: parseInt(lv * 1 + 10),
            mz: lv
        }
    };
}
this.slots = [
    {
        prop: 'ylbf_ml',
        value: (lv) => 1000,
        format: (val) => {
            return '缠字诀忙乱时间增加1秒';
        },
    },
    {
        prop: 'ylbf_mz',
        value: (lv) => 20,
        format: (val) => {
            return '缠字诀命中判定下限增加20%';
        },
    }
];
this.pfm = {
    chan:
    {
        name: "缠字诀",
        distime: 30000,
        enable_skill: "whip",
        mp: 20,
        use: function (me, target, lv) {
            var time = Math.round(lv * 100 / 5)
            if (time < 2000) time = 2000;
            else if (time > 10000) time = 10000;
            time += me.query_prop('ylbf_ml');
            let add = me.mz * me.query_prop('ylbf_mz') / 100;
            let rad_mz = me.mz - add;
            var msg = "<hic>$N使出云龙鞭法「缠」字诀，连挥长鞭企图把$n的全身缠住</hic>\n";
            if (add + me.random(rad_mz) > target.ds / 2) {
                msg += "结果$p被$P攻了个措手不及!\n";
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    duration: time,
                    name: "忙乱",
                    downside: true
                }, me);
            } else {
                msg += "可是$p看破了$P的企图，并没有上当。\n";
            }
            me.send_room(msg, target);
        },
        query_desc: function (me, lv) {
            var time = Math.round(lv / 50);
            if (time < 2) time == 2;
            else if (time > 10) time = 10;
            return "以诡异刁钻的鞭法缠住敌人，使敌人" + time + "秒内处于忙乱状态，期间无法攻击，招架";
        }
    }
};
}
