import { SKILL } from "../../../os/skill/skill.js";

export default function() {
this.inherits(SKILL);
this.name = "神龙剑";
this.id = "shenlongjian";
this.grade = 1;

this.attack_actions = [
    "$N使一式「<BLK>潮泛银海</BLK>」，手中$w疾挽，漫天寒光，隐夹风雷之声，闪电般狂涌向$n的$l",
    "$N错步上前，使出「<RED>银雨飞花</RED>」，手中$w登时剑芒暴射，宛如漫天瑞雪飞洒向$n的$l",
    "$N手中$w一抖，一招「<GRN>花影滨飞</GRN>」，$w犹如狂风扫落叶般急攻向$n的$l",
    "$N手中$w锵啷啷长吟一声，一式「<BLU>神龙寻食</BLU>」，$w头上脚下洒攻而下，攻势之疾，无以伦比向$n的$l",
    "$N一式「<MAG>西风倒卷</MAG>」，手中$w将剑自下拖上，端的无比毒辣使$n难断虚实，无可躲避",
    "$N手中$w,一式「<BLU>天罗地网</BLU>」，仿佛一面无形的黑网向$n的$l斜斜击出",
    "$N一式「<HIR>日月失色</HIR>」，$w银光万道，如江河倒泻，剑芒绵绵无尽向$n的胸口递去",
    "$N一式「<YEL>金针渡劫</YEL>」，$w形神合一，把全部真气贯注剑身之上，快如天光乍闪向$n刺去"

];
this.desc = "神龙教的剑法";
//<$1>$2</$1>
//<$1>$2</$1>
this.can_enables = ["sword"];
this.learn_condition = {
    max_mp: 100,
    skill: {
        sword: 100
    }
};

this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv + 10)
        }
    };
}


this.slots = [
    {
        prop: 'slj_busy',
        value: (lv) => 1000,
        format: (val) => {
            return '神龙天降忙乱时间增加1秒';
        },
    },
    {
        prop: 'slj_hit',
        value: (lv) => 1,
        format: (val) => {
            return '神龙天降攻击次数+1';
        },
    },
];
this.pfm = {
    jiang:
    {
        name: "神龙天降",
        distime: 10000,
        enable_skill: "sword",
        mp: 20,
        use: function (me, target, lv) {
            me.send_room("<CYN>$N后跃一步，手捏剑决，口中念念有词，突然大喝一声「神龙天降」！！</CYN>", target);
            var sh = me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz,
                attack_msg: "<hiy>$N的剑法顿时变得诡异十分，幻出朵朵剑花，犹如数条金龙，迅速向$n飞去！</hiy>",
                damage_msg: "<hir>$n试图避开剑招，可全身僵硬不能动弹，疑惑中已经身中数剑，精神愈加恍惚起来！</hir>",
                miss_msg: "<CYN>$n顿感身体被制，情知不妙，立刻摄守神元，终于突破对方控制。</CYN>",
                parry_msg: "<CYN>$n顿感身体被制，情知不妙，立刻摄守神元，终于突破对方控制。</CYN>"
            });
            let count = me.query_prop('slj_hit');
            for (let i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_before: "<hiw>紧跟着</hiw>",
                });
            }
            me.end_attack(target);

            if (sh > 0) {
                target.add_status({
                    id: "busy",
                    name: "忙乱",
                    duration: 3000 + lv + me.query_prop('slj_busy'),
                    is_busy: true,
                    downside: true
                });
            }
        },
        query_desc: function (me, lv) {
            var t = 3000 + lv;
            return "诡异的剑法迷惑敌人，命中后对敌人造成伤害，并且使敌人忙乱" + t / 1000 + "秒。";
        }
    }
};
}
