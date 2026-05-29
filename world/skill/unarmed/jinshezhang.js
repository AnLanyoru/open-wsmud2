import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(SKILL);
this.name = "金蛇游身掌";
this.id = "jinshezhang";
this.grade = 3;

this.attack_actions = [
    "$N双掌一错，一招「千蛇出洞」幻出漫天掌影拢向$n的$l",
    "$N暴喝一声，双掌连环推出，一招「大沼龙蛇」强劲的掌风直扑$n的$l",
    "$N双掌纷飞，一招「双蛇抢珠」直取$n的$l",
    "$N提气缠身游走，一招「游走式」，森森掌风无孔不入般地击向$n的$l",
    "$N盘身错步，双掌平推，凝神聚气，一招「盘身式」拍向$n的$l",
    "$N左掌立于胸前，右掌推出，一招「金蛇吐衅」击向$n$l",
    "$N使出「金蛇翻身咬」，身形凌空飞起，从空中当头向$n的$l出掌攻击",
    "$N使出一招「杯弓蛇影」，左掌化虚为实击向$n的$l",
    "$N左掌画了个圈圈，右掌推出，一招「金蛇缠丝手」击向$n$l",
    "$N使出「灵蛇游八方」，身形散作八处同时向$n的$l出掌攻击",
    "$N使出金蛇游身掌法「金蛇探头」，如鬼魅般欺至$n身前，一掌拍向$n的$l"
];
this.desc = "金蛇郎君所创的一门掌法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 10000,
    skill: {
        unarmed: 400
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.3) + 20,
            mz: parseInt(lv * 1.3) + 20,
            dex: parseInt(lv / 6)
        }
    };
}
this.slots = [
    {
        prop: 'jsys_ds',
        value: (lv) => 1,
        count: 1,
        format: (val) => {
            return '金龙升天命中后会解除对方的轻功增益';
        }
    },
    {
        prop: 'jsys_sh',
        value: (lv) => 5 + Math.floor(lv / 10),
        format: (val) => {
            return '金龙升天伤害增加' + val + "%";
        }
    },
];
this.pfm = {
    qian:
    {
        name: "金龙升天",
        distime: 26000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {

            var per = 100 + parseInt(lv / 100) + me.query_prop('jsys_sh');
            var gj = me.gj * per / 100;
            me.send_room("<hiy>$N内气上提，全身拔起，一招「金龙升天」，双掌凌空朝$n拍下\n</hiy>", target);
            if (me.do_attack({
                target: target,
                gj: gj,
                mz: me.mz,
                damage_msg: "<hir>$n全身都被笼罩在掌力之下，避无可避，一掌被拍了个正着，只觉四肢无力，动弹不得</hir>",
                no_weapon: true
            })) {
                if (me.query_prop('jsys_ds'))
                    target.remove_status('dodge');
                target.add_status({
                    id: "rash",
                    name: "定身",
                    desc: "你无法躲闪",
                    duration: 8000,
                    is_rash: true,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {

            var per = 100 + parseInt(lv / 100);
            return "对敌人造成你攻击力" + per + "%的伤害，命中后使敌人在8秒内无法闪避";
        }
    }
};
}
