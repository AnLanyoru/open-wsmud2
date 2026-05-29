import { SKILL } from "../../../os/skill/skill.js";
import { WEAPON_TYPE } from "../../../os/const.js";

export default class extends SKILL {
    name = "千蛛万毒手";
    id = "qianzhuwandushou";
    grade = 3;
    attack_actions = [
    "$N身形一晃而至，一招「小鬼勾魂」，双掌带着一缕腥风拍向$n的前心",
    "$N身形化做一缕轻烟绕着$n急转，一招「天网恢恢」，双掌幻出无数掌影罩向$n",
    "$N大喝一声，一招「恶鬼推门」，单掌如巨斧开山带着一股腥风猛劈向$n的面门",
    "$N一声冷笑，一招「灵蛇九转」，身形一闪而至，一掌轻轻拍出，手臂宛若无骨，掌到中途竟连变九变，如鬼魅般印向$n的$l",
    "$N侧身向前，一招「地府阴风」，双掌连环拍出，一缕缕彻骨的寒气从掌心透出，将$n周围的空气都凝结了",
    "$N厉叫一声，身形忽的蜷缩如球，飞身撞向$n，一招「黄蜂吐刺」单掌如剑，直刺$n的心窝",
    "$N一个急旋，飞身纵起，半空中一式「毒龙摆尾」，反手击向$n的$l",
    "$N大喝一声，运起五毒神功，一招「毒火焚身」，刹那间全身毛发尽绿，一对碧绿的双爪闪电般的朝$n的$l抓去"
];
    desc = "五毒教的千蛛万毒手";
    can_enables = ["unarmed", "parry"];
    learn_condition = {
    max_mp: 8000,
    skill: {
        unarmed: 300,
        wudushengong: 300,
    }
};
    slots = [
    {
        prop: 'qzwds_cc',
        value: (lv, grade) => grade,
        format: (val) => {
            return '千蛛万毒毒发次数增加' + val + "次数";
        }
    },
    {
        prop: 'qzwds_sh',
        value: (lv) => 100 + Math.floor(lv / 10),
        format: (val) => {
            return '万蛊噬天在招架成功后使敌人受到的毒伤增加' + val + "%";
        }
    },
];
    pfm = {
    qian:
    {
        name: "千蛛万毒",
        distime: 36000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            if (me.do_attack({
                target: target,
                gj: me.gj,
                attack_msg: "<HIr>$N一声狞笑飞身纵起，凌空一指向$n的眉心点去。</HIr>",
                damage_msg: "<hir>只见一缕黑气从$N的指尖透出，只一闪就没入$n的眉心！</hir>",
                miss_msg: "<hig>可是$n早有准备，一个懒驴打滚，堪堪躲过了这一招。</hig>",
                parry_msg: "<hig>可是$n早有准备，一个懒驴打滚，堪堪躲过了这一招。</hig>"
            })) {

                var gj = parseInt(me.gj * (lv / 300) / 3);
                target.add_status({
                    id: "unarmed",
                    name: "千蛛万毒",
                    desc: "你中了千蛛万毒手，每三秒减少" + gj + "气血",
                    duration: 3000,
                    duration_count: 4 + me.query_prop('qzwds_cc'),
                    on_interval: function (player, count) {
                        if (player.hp > 0) {
                            player.damage2(gj, me);
                            player.send_room("<hir>$N的千蛛万毒手发作了，全身一阵发麻。</hir>");
                            if (player.fight_type)
                                me.end_attack(player);
                            else if (player.hp <= 0)
                                player.hp = 1;
                        }
                    },
                    downside: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = parseInt(me.gj * (lv / 300));
            return "将全身毒力集中在一点刺向敌人，命中后使敌人在12秒内持续受到" + gj + "点伤害。";
        }
    }, wan: {
        name: "万蛊噬天",
        distime: 60000,
        enable_skill: "parry",
        mp: 80,
        use: function (me, target, lv) {
            var msg = "<red>$N仰天一声长啸，强催内劲，全身竟浮现出隐隐碧绿之色。喝道：“万蛊噬天”。毒气弥漫，瞬间笼罩$P全身！</red>\n";
            me.send_room(msg);
            var time = 10000 + lv * 10;
            me.set_temp("wangu", 1, time);
            me.add_status({
                id: "wangu",
                name: "万蛊噬天",
                duration: time
            });
        },
        query_desc: function (me, lv) {
            var gj = lv + me.query_skill('wudushengong', 0);
            gj = 200 + parseInt(gj * (gj / 1000 + 1));

            var time = 10000 + lv * 10;
            return "毒气弥漫，笼罩全身，" + (time / 1000) + "秒内在被敌人命中时候使敌人受到" + gj + "点伤害。";
        }

    }
};

    query_prop(lv) {
    return {
        per: (-parseInt(lv / 300) - 1)
    };
}
    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.5 + 20),
            mz: lv,
            str: parseInt(lv / 8),
        }, parry: {
            zj: parseInt(lv * 1.5 + 20),
            fy: lv,
        }
    };
}
    on_parry_over(me, target, par) {
    if (me.query_temp("wangu")) {
        var lv = me.query_skill("wudushengong", 0) + me.query_skill("qianzhuwandushou", 0);
        var gj = 200 + parseInt(lv * (lv / 1000 + 1));
        if (par.is_parry) {
            let val = me.query_prop('qzwds_sh');
            if (val > 0) {
                gj = gj * val / 100;
            }
        }
        target.send_combat("<red>毒气顺着$W侵入$N体内，$P感到全身一阵发麻。</red>\n");
        target.damage2(gj, me);
        me.end_attack(target);
    }
}
    on_disenable(me, type) {
    if (type === "parry") {
        me.remove_status("wangu", true);
    }
}
}

