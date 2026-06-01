import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "化骨绵掌";
    id = "huagumianzhang";
    grade = 2;
    attack_actions = [
    "身形微晃，一招<HIB>「长恨深入骨」</HIB>，十指如戟，插向$n的双肩锁骨",
    "$N出手如风，十指微微抖动，一招<HIB>「素手裂红裳」</HIB>抓向$n的前胸",
    "$N双手忽隐忽现，一招<HIB>「长风吹落尘」</HIB>，鬼魅般地抓向$n的肩头",
    "$N左手当胸画弧，右手疾出，一招<HIB>「明月映流沙」</HIB>，猛地抓向$n的额头",
    "$N使一招<HIB>「森然动四方」</HIB>，激起漫天的劲风，撞向$n",
    "$N面无表情，双臂忽左忽右地疾挥，使出<HIB>「黯黯侵骨寒」</HIB>，十指忽伸忽缩，迅猛无比地袭向$n全身各处大穴",
    "$N使出<HIB>「黄沙飘惊雨」</HIB>，蓦然游身而上，绕着$n疾转数圈，$n正眼花缭乱间，$N已悄然停在$n身后，右手划出一道光圈，接着右手冲出光圈猛抓$n的后背",
    "$N突然双手平举，$n一呆，正在猜测间，便见$N嗖的一下将双手收回胸前，接着一招<HIB>「白骨无限寒」</HIB>，五指如钩，直抓向$n的腰间"
];
    desc = "蛇岛神龙教绝技，以掌为主，运转舒展，动作连绵不断，劲力阴毒无比";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 100
    }
};
    slots = [
    {
        prop: 'hgmz_ds',
        value: (lv) => 30,
        format: (val) => {
            return '使敌人中毒的伤害附加30%攻击力的伤害';
        },
    },
    {
        prop: 'hgmz_ds2',
        value: (lv) => 1,
        format: (val) => {
            return '暴击后使敌人中毒的持续次数+1';
        },
    },
];
    pfm_set = {
    hua:
    {
        name: "化骨",
        distime: 7000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            var sh = me.do_attack({
                attack_msg: "<mag>$N掌出如风，轻轻拍向$n的肩头。</mag>",
                target: target,
                gj: me.gj,
                no_append: true,
                damage_msg: "<hir>结果只听扑的一声，$p被$P一掌拍中，只觉得全身暖洋洋的，感到有点轻飘无力。</hir>"
            });

            if (sh > 0) {
                var str = 10 + Math.round(lv / 5);
                target.add_status({
                    id: "huagu",
                    name: "化骨",
                    desc: "你被化骨绵掌击中了",
                    prop: {
                        str: -str
                    },
                    duration: 10000 + lv * 10,
                    downside: true,
                    override: 1
                });
            }
            me.end_attack(target);

        },
        query_desc: function (me, lv) {
            var gj = 10 + Math.round(lv / 5);
            var t = 10000 + lv * 10;
            return "使用化骨绵掌的阴柔掌力，使敌人骨骼其软如绵，浑身无力，在" + (t / 1000) + "秒内减少" + gj + "点臂力。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: lv + 5,
            desc: "暴击后使敌人中毒，每3秒损失" + (lv + 10) + "气血"
        }
    };
}
    on_attack_over(me, target, par) {
    if (!par.is_dodge && !par.is_parry && par.iscirt) {
        me.send_room("<hib>一股阴寒的掌力顺着$N的手掌侵入$n，$p不由得打了个冷颤。</hib>", target);
        var lv = me.query_skill("huagumianzhang", 0) + 10;
        lv += me.gj * me.query_prop('hgmz_ds') / 100;
        var count = 4 + me.query_prop('hgmz_ds2');
        target.add_status({
            id: "miandu",
            name: "绵毒",
            desc: "你被化骨绵掌击中，劲气侵入体内,每三秒减少气血" + lv,
            duration: 3000,
            duration_count: count,
            on_interval: function (p) {
                if (p.hp > 0) {
                    p.send_room("<blu>$N的化骨绵掌发作了，脸色发青。</blu>");
                    p.damage(lv, me);
                    if (p.hp < 0) p.hp = 1;
                }
            },
            downside: true,
            override: 2
        });
    }
}
}
