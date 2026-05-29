import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "天山六阳掌";
    id = "liuyangzhang";
    grade = 3;
    family = FAMILIES.XIAOYAO;
    attack_actions = [
    "$N一招「<YEL>落日熔金</YEL>」，左掌叠于右掌之上，劈向$n",
    "$N一招「<RED>安禅制毒龙</RED>」，面色凝重，双掌轻飘飘地拍向$n",
    "$N一招「<MAG>日斜归路晚霞明</MAG>」，双掌幻化一片掌影，将$n笼罩于内。",
    "$N一招「<HIC>阳关三叠</HIC>」，向$n的$l连击三掌",
    "$N一招「<WHT>阳春一曲和皆难</WHT>」，只见一片掌影攻向$n",
    "$N双掌平挥，一招「<HIW>云霞出海曙</HIW>」击向$n",
    "$N一招「<HIR>白日参辰现</HIR>」，只见一片掌影攻向$n",
    "$N左掌虚晃，右掌一记「<RED>云霞出薛帷</RED>」击向$n的头部",
    "$N施出「<HIC>青阳带岁除</HIC>」，右手横扫$n的$l，左手攻向$n的胸口",
    "$N施出「<YEL>阳歌天钧</YEL>」，双掌同时击向$n的$l"
];
    desc = "逍遥派的天山六阳掌，绝招生死符让人谈虎色变。";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 5000,
    skill: {
        unarmed: 300,
        beimingshengong:300
    }
};
    pfm = {
    zhong:
    {
        name: "生死符",
        distime: 30000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        release_time: 8000,
        use: function (me, target, lv) {
         
            var time = 12000 - lv;
            if (time < 10000) time = 10000;
            var fu = 10 + parseInt(lv / 100);
            if (fu > 40) fu = 40;
            var sh = me.do_attack({
                target: target,
                attack_msg: "<red>$N化水为冰，凝于掌中，轻飘飘地拍向$n。</red>",
                miss_msg: "可是$p急忙闪在一旁，躲了开去。",
                no_parry:true,
            });
            if (sh) {
               // target.do_kill(me);
                target.add_status({
                    id:"liuyang",
                    duration: time,
                    downside: true,
                    name: "生死符",
                    desc: "你被种了生死符，10秒后你的气血将减为1",
                    no_clear:true,
                    on_expire: function (p) {
                        if (p.hp<=0) return;
                        if (p.is_fighting(me)) {
                            p.send_room("<hib>$N的生死符发作了，“哇”的一声，吐出一口殷红的<hir>鲜血</hir>。</hib>");
                            if (p.hp > me.max_hp ) {
                                p.damage(parseInt(me.hp * fu / 100),me);
                            }
                            else { 
                                p.add_hp(-p.hp + 1);
                            }
                            me.end_attack(p);

                        } else {
                            p.notify("<hiw>由于失去" + me.name + "的真气牵引，你的生死符没有发作。</hiw>");
                        }
                    }
                });
                me.end_attack(target);
            }

        },
        query_desc: function (me, lv) {
            var time = 12000 - lv;
            if (time < 10000) time = 10000;
            var fu = 10 + parseInt(lv / 300);
            if (fu > 40) fu = 40;
            return "逆运真气将阳刚之气转为阴柔，化水为冰，命中敌人后" + (time / 1000) + "秒后爆发，如果你的最大气血大于敌方当前气血，敌人气血将降为1，否则将受到你当前气血" + fu+"%的伤害。不可招架";
        }
    }, san: {
        name: "阳关三叠",
        distime: 12000,
        enable_skill: "unarmed",
        mp: 20,
        check: function (me, lv) {
            if (lv < 30) return false;
            return true;
        },
        use_condition: "需要天山六阳掌等级30",
        use: function (me, target, lv) {
            me.send_room("<hir>$N长笑一声，双掌快速拍向$n，竟如惊涛骇浪般汹涌而去！</hir>", target);
            var mz = me.mz;
            var gj = me.gj;
            var sp = 150 + parseInt(lv / 30);
            var before = "";
            for (var i = 0; i < 3; i++) {
                if (me.do_attack({
                    target: target,
                    gj: gj,
                    mz: mz,
                    attack_before: before, no_weapon: true
                })) {
                    gj = gj *sp/100;
                    before = "<hir>$N长笑一声，运掌如风，掌力更加迅猛\n</hir>";
                } else {
                    mz = mz * sp / 100;
                    before = "<hic>$N气随意转，掌风突变，化刚为柔，又如春风般无孔不入\n</hic>";
                }
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var sp = 50 + parseInt(lv / 30);
            return "以迅猛的掌力瞬间攻击对方三次，造成伤害后下次增加攻击" + sp + "%，否则增加" + sp +"%命中";
        }
    }, po: {
        name: "白虹掌力",
        distime: 10000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
             lv = 10 + parseInt(lv / 100);
             if (lv > 20) lv = 20;
             me.do_attack({
                 attack_msg: "<hiy>$N全身真气迸发，呼的一掌向$n头顶猛然贯落。</hiy>",
                target: target,
                gj: me.gj,
                damage_msg: "<HIR>$n慌忙抵挡，可已然不及，$N掌劲如洪水般涌入体内，接连震断数根肋骨。</HIR>",
                 mz: me.mz,
                 power_gj: me.max_mp * lv / 100
            })
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            lv = 10 + parseInt(lv / 100);
            if (lv > 20) lv = 20;
            var gj = parseInt(me.max_mp * lv / 100);
            return "提起全身真气对敌人造成你攻击力附加你最大内力" + lv + "%(" + gj + ")的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.2),
            mz: parseInt(lv),
        }
    };
}
}

const FAMILIES = globalThis.FAMILIES;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
