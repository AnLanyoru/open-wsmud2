this.inherits(SKILL);
this.name = "擒龙手";
this.id = "qinlong";
this.attack_actions = [
    "$N五指成爪，真气凝聚指尖，一招「龙爪探渊」直取$n的$l",
    "$N身形一闪，左爪虚晃，右爪「擒龙拿珠」猛扣$n的双目",
    "$N爪风呼啸，一式「锁龙缠腕」缠向$n的手腕，势要扣住脉门",
    "$N脚下踏动方位，双爪如影随形，「游龙戏爪」分袭$n双肩",
    "$N猛然欺近，爪尖泛着寒光，「猛龙探爪」直插$n的胸口",
    "$N爪势陡然加快，一招「惊龙回首」反撩$n的后心",
    "$N双臂交错，爪影层层叠叠，「群龙乱舞」罩向$n全身",
    "$N深吸一口气，单爪蓄力后猛地弹出，「飞龙出洞」击向$n的$l",
    "$N爪势陡沉，一式「龙爪捞月」反扣$n的脚踝 ",
    "$N身形跃起，双爪自上而下，「降龙攫顶」抓向$n的头颅 ",
    "$N爪风带着破空之声，「怒龙裂石」猛劈$n的l",
    "$N手腕翻转，爪尖转向内侧，「灵龙绕指」缠向$n的臂膀",
    "$N突然变招，爪势由刚转柔，「缠龙锁喉」扣向$n的脖颈",
    "$N双爪交替出击，一招「双龙夺宝」分取$n的左右$l",
    "$N爪力暗藏螺旋劲，「绞龙碎骨」抓向$n的关节 ",
    "$N虚踏一步，爪势如电，「捷龙追影」直追$n的$l",
    "$N收爪蓄力，猛地爆发，「擒龙归位」锁向$n的要害 "
];

this.desc = "曾经的少林绝技，在前朝覆灭后就随之消失了";
this.grade = 2;
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 10000,
    skill: {
        unarmed: 500
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            mz: parseInt(lv * 1.5) + 20,
            dex: parseInt(lv / 8) + 3
        }
    };
}
this.slots = [
    {
        prop: 'qlz_sh',
        value: (lv) => 100,
        format: (val) => {
            return '锁龙伤害增加100%';
        },
    },
    {
        prop: 'qlz_cd',
        value: (lv) => Math.min(50, lv / 200),
        format: (val) => {
            return '锁龙绝招冷却时间减少' + val + '%';
        },
    },
    {
        prop: 'qlz_hm',
        value: (lv) => 1,
        grade: 4,
        format: (val) => {
            return '锁龙触发后将使对方昏迷';
        },
    },
];
this.pfm = {
    suo:
    {
        name: "锁龙",
        distime: 32000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        distime_per_key: 'qlz_cd',
        mp: 30,
        use: function (me, target, lv) {
            var time = 8000;
            let gj = me.gj * (100 + lv / 10 + me.query_prop('qlz_sh')) / 100;


            me.do_attack({
                target: target,
                attack_msg: "<hic>$N双手如铁钳扣住$n的肩骨，真气顺势侵入$p经脉</hic>",
                gj: gj,
                mz: me.mz,
                no_weapon: true
            });
            me.end_attack(target);
            let dex1 = me.dex ?? 20;
            let dex2 = target.dex ?? 20;
            let is_add = dex1 + dex2 * me.query_prop('dex') >
                dex2 + dex2 * target.query_prop('dex');
            if (is_add) {
                if (me.query_prop('qlz_hm')) {
                    target.add_status({
                        id: "faint",
                        is_faint: true,
                        duration: time,
                        name: "昏迷", downside: true,
                        finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
                        start_msg: "<hir>$N只觉得眼前一黑，接着什么都不知道了。</hir>\n"
                    }, me);
                }
                else {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: time,
                        downside: true,
                        is_busy: true
                    }, me);
                }
            }
        },
        query_desc: function (me, lv) {
            let sh = 100 + lv / 10;
            return "对敌人造成" + sh + "%攻击力的伤害，如果身法出色则忙乱对方8秒";
        }
    }
};