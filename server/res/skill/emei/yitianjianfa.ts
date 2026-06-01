import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "倚天剑法";
    id = "yitianjianfa";
    grade = 4;
    first_title = "倚天传人";
    family = FAMILIES.EMEI;
    attack_actions = [
    "$N剑尖剑芒暴长，一招「倚天寒芒」，手中$w大开大阖，剑芒直刺$n的$l",
    "$N剑芒吞吐，单手$w一招「翻江倒海」，剑势曼妙，剑光直逼向$n的$l",
    "$N一式「神剑佛威」，屈腕云剑，剑光如彩碟纷飞，幻出点点星光飘向$n",
    "$N挥剑分击，剑势自胸前跃出，$w一式「群邪辟易」，毫无留恋之势，刺向$n",
    "$N左手剑指划转，腰部一扭，右手$w一记「荡妖除魔」自下而上刺向$n的$l",
    "$N脸色凝重凝重，缓缓举起$w，突然跃起身剑合一，使出一招“倚天不出”，手中$w由下至上划出一条美丽的弧线刺向$n的$l",
    "$N反身跃起，双手握剑举至头顶使出倚天剑法奥义“谁与争锋”，这看似简简单单的一剑，而厚重的剑气直奔$n的$l而去"

];
    desc = "峨眉派祖师郭襄在得到倚天剑后自创的一式剑法，招式狠辣，不留余地。";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 10000,
    skill: {
        sword: 500
    }
};
    pfm_set = {
    yi:
    {
        name: "倚天剑决",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        use: function (me, target, lv) {
            me.send_room("<HIY>$N长啸一声：武林至尊、宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋 ！</hiy>\n <HIR>顿时风云变色，$N手中舞出漫天剑光........ \n<HIR>");
            var str = ["<HIC>-----拔云见日!----- </HIC>\n", "<BLU>-----星河在天!-----</BLU> \n", "<HIY>-----倚天不出!----- </HIY>\n", "<HIR>-----谁与争锋!-----</HIR> \n"];
            var gj = me.gj;
            lv = parseInt(120 + (lv / 50));
            //  var max = 0;
            for (var i = 0; i < 4; i++) {
                if (me.do_attack({
                    target: target,
                    attack_before: str[i],
                    gj: gj
                })) {
                    //  max++;
                    gj = gj * lv / 100;
                }
            }

            // me.send_room("<HIR>$N暗念倚天剑决，身法陡然加快！</HIR>");
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            lv = parseInt(20 + (lv / 50));
            return "倚天剑决，瞬间攻击4次，当前一次攻击命中后，下次攻击伤害增加" + lv + "%";
        }
    }, hao:
    {
        name: "号令天下",
        distime: 30000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        use: function (me, target, lv) {
            var per = 10 + parseInt(lv / 50);
            var count = target.query_status("fumo");
            if (!count) count = 1;
            per = 100 + per * count;
            if (me.do_attack({
                attack_msg: "<HIR>$N面容肃穆，高举$W, 顿时剑光暴长，手中$W化作漫天剑光直射$n。<HIR>",
                target: target,
                mz: me.mz * per / 100,
                gj: me.gj * per / 100
            })) {
                target.clear_downside(false);
            }
            if (count >= 1) target.remove_status("fumo", true);
            // me.send_room("<HIR>$N暗念倚天剑决，身法陡然加快！</HIR>");
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 10 + parseInt(lv / 50);
            return "对敌人造成伤害，每层伏魔增加" + per + "%伤害和命中，命中后伏魔重置，驱除对方的有益状态";
        }
    }
};

    query_prop(lv, me) {
    return {
        diff_fy_per: 5 + parseInt(lv / 300)
    };
}
    query_enable_prop(lv) {
    return {
        sword: {
            gj: 30 + parseInt(lv * 1.8),
            mz: parseInt(lv * 1.8) + 20,
            desc: "命中敌人后会使敌方防御减少1%，可叠加最高20层"
        }
    };
}
    on_attack_over(me, target, par) {
    if (!par.is_dodge && !par.is_parry) {
        target.add_status({
            id: "fumo",
            name: "伏魔",
            desc: "你的防御减少了",
            max_count: 20,
            prop: {
                fy_per: -1
            },
            duration: 5000,
            count: 1,
            downside: true,
            override: 1
        });
    }
}
}

